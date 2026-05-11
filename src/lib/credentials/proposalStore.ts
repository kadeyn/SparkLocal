// Badge proposal store — manages the mentor-proposes / kid-accepts flow.
//
// V1 persists to localStorage so the prototype is fully exercisable without a
// backend. V2+ swaps in a Supabase-backed `BadgeProposalProvider` by calling
// `setProposalProvider()`. The shape here is the long-lived contract; the
// localStorage impl is throwaway.

import type { IssuedBadge } from './issuer'

export type ProposalStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export interface BadgeProposal {
  id: string
  badgeClassId: string
  proposedBy: {
    mentorId: string
    mentorDisplayName: string // First name + last initial; never full last name
    mentorBusinessName?: string
  }
  recipientKidId: string
  recipientFirstName: string
  context: {
    gigId?: string
    completedAt: string // ISO date
    city: string // City-and-state only — never an address
    state: string
    skills: string[]
    mentorNote?: string // Mentor's optional message to the kid
  }
  proposedAt: string // ISO timestamp
  expiresAt: string // ISO timestamp — 30 days from proposal
  status: ProposalStatus
  acceptedAt?: string
  issuedCredential?: IssuedBadge // Populated on acceptance
}

export interface BadgeProposalProvider {
  createProposal(
    input: Omit<BadgeProposal, 'id' | 'proposedAt' | 'expiresAt' | 'status'>,
  ): Promise<BadgeProposal>
  listProposalsForKid(kidId: string, status?: ProposalStatus): Promise<BadgeProposal[]>
  acceptProposal(proposalId: string, kidId: string): Promise<BadgeProposal>
  declineProposal(proposalId: string, kidId: string): Promise<BadgeProposal>
  listAcceptedBadgesForKid(kidId: string): Promise<BadgeProposal[]>
  // V1 helper for operator audit + admin tooling. NOT part of any kid-facing
  // surface — never expose via the kid-side API.
  listAll(): Promise<BadgeProposal[]>
}

const STORAGE_KEY = 'sparklocal-badge-proposals'
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

class LocalStorageProposalProvider implements BadgeProposalProvider {
  private read(): BadgeProposal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as BadgeProposal[]
    } catch (err) {
      console.warn('Failed to parse badge proposals from localStorage; resetting.', err)
      return []
    }
  }

  private write(proposals: BadgeProposal[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals))
  }

  async createProposal(
    input: Omit<BadgeProposal, 'id' | 'proposedAt' | 'expiresAt' | 'status'>,
  ): Promise<BadgeProposal> {
    const now = new Date()
    const proposal: BadgeProposal = {
      ...input,
      id: `prop-${crypto.randomUUID()}`,
      proposedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + THIRTY_DAYS_MS).toISOString(),
      status: 'pending',
    }
    const all = this.read()
    all.push(proposal)
    this.write(all)
    return proposal
  }

  async listProposalsForKid(kidId: string, status?: ProposalStatus): Promise<BadgeProposal[]> {
    return this.read().filter(
      (p) => p.recipientKidId === kidId && (!status || p.status === status),
    )
  }

  async acceptProposal(proposalId: string, kidId: string): Promise<BadgeProposal> {
    // Dynamic import keeps the heavy credential-signing libraries out of the
    // initial JS bundle — they only load when a kid actually accepts.
    const { issueBadge } = await import('./issuer')
    const { getBadgeClass } = await import('./badgeSchema')

    const all = this.read()
    const proposal = all.find((p) => p.id === proposalId && p.recipientKidId === kidId)
    if (!proposal) throw new Error('Proposal not found')
    if (proposal.status !== 'pending') {
      throw new Error(`Cannot accept proposal in status: ${proposal.status}`)
    }
    if (new Date(proposal.expiresAt) < new Date()) {
      proposal.status = 'expired'
      this.write(all)
      throw new Error('Proposal expired')
    }

    // Validate the badge class exists before we try to sign.
    const badgeClass = getBadgeClass(proposal.badgeClassId)
    if (!badgeClass) throw new Error(`Unknown badge class: ${proposal.badgeClassId}`)

    const credential = await issueBadge({
      badgeClassId: proposal.badgeClassId,
      // V1 DID scheme; revisit when authenticated kid accounts ship.
      recipientDid: `did:sparklocal:kid:${kidId}`,
      recipientFirstName: proposal.recipientFirstName,
      mentorDisplayName: proposal.proposedBy.mentorDisplayName,
      mentorBusinessName: proposal.proposedBy.mentorBusinessName,
      gigContext: {
        city: proposal.context.city,
        state: proposal.context.state,
        completedAt: proposal.context.completedAt,
        skills: proposal.context.skills,
      },
      narrative: proposal.context.mentorNote,
    })

    proposal.status = 'accepted'
    proposal.acceptedAt = new Date().toISOString()
    proposal.issuedCredential = credential
    this.write(all)
    return proposal
  }

  async declineProposal(proposalId: string, kidId: string): Promise<BadgeProposal> {
    const all = this.read()
    const proposal = all.find((p) => p.id === proposalId && p.recipientKidId === kidId)
    if (!proposal) throw new Error('Proposal not found')
    if (proposal.status !== 'pending') {
      throw new Error(`Cannot decline proposal in status: ${proposal.status}`)
    }
    proposal.status = 'declined'
    this.write(all)
    return proposal
  }

  async listAcceptedBadgesForKid(kidId: string): Promise<BadgeProposal[]> {
    return this.read().filter((p) => p.recipientKidId === kidId && p.status === 'accepted')
  }

  async listAll(): Promise<BadgeProposal[]> {
    return this.read()
  }
}

let _provider: BadgeProposalProvider = new LocalStorageProposalProvider()

export function getProposalProvider(): BadgeProposalProvider {
  return _provider
}

export function setProposalProvider(provider: BadgeProposalProvider): void {
  _provider = provider
}
