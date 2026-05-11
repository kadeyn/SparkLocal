// SparkLocal Open Badges 3.0 Issuer
//
// Issues W3C Verifiable Credentials (Data Model v2.0) conforming to the
// 1EdTech Open Badges 3.0 spec, signed with Ed25519Signature2020.
//
// V1 caveats — read these before relying on issuance:
// - Document loader is a no-op stub. Real JSON-LD canonicalization needs
//   the W3C and OB contexts to be resolvable. For full end-to-end signing
//   in production, swap `defaultDocumentLoader` for
//   `@digitalbazaar/security-document-loader` or a hand-rolled cached
//   loader. The current shape is correct; signing will fail at runtime
//   until a real loader is wired in.
// - Recipient DID scheme is provisional (`did:sparklocal:kid:<uuid>`).
//   Real per-kid did:key pairs come when authenticated accounts ship.
// - No revocation list. StatusList2021 will be added during production
//   hardening; revocation is in the deferred checklist (README §10).

import {
  issue,
  verifyCredential,
  defaultDocumentLoader as bundledDocumentLoader,
  type DocumentLoader,
} from '@digitalbazaar/vc'
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020'
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'
import { v4 as uuid } from 'uuid'
import { getKeyProvider } from './keyProvider'
import { getBadgeClass } from './badgeSchema'

export interface IssueBadgeInput {
  badgeClassId: string // Short key or full urn
  recipientDid: string // Kid's DID (or did:sparklocal: scheme until real auth)
  recipientFirstName: string // For display — never persisted into the VC body
  mentorDisplayName: string // First name + last initial; never full last name
  mentorBusinessName?: string
  gigContext?: {
    city: string // City-and-state only; no addresses
    state: string
    completedAt: string // ISO date
    skills: string[]
  }
  narrative?: string // Optional mentor narrative for mentor_endorsement badges
}

export interface IssuedBadge {
  '@context': string[]
  id: string
  type: string[]
  issuer: { id: string; type: string; name: string }
  validFrom: string
  credentialSubject: {
    id: string
    type: string[]
    achievement: {
      id: string
      type: string[]
      name: string
      description: string
      criteria: { narrative: string }
      tag?: string[]
    }
    result?: { type: string; value: string }[]
  }
  proof?: unknown
}

/**
 * Sign and return a new Open Badges 3.0 credential. Throws when the badge
 * class is unknown, when the key provider isn't configured, or when the
 * underlying signing library rejects the input.
 */
export async function issueBadge(input: IssueBadgeInput): Promise<IssuedBadge> {
  const badgeClass = getBadgeClass(input.badgeClassId)
  if (!badgeClass) {
    throw new Error(`Unknown badge class: ${input.badgeClassId}`)
  }

  const keyPair = await getKeyProvider().getActiveSigningKey()
  const credentialId = `urn:uuid:${uuid()}`
  const now = new Date().toISOString()

  // Open Badges 3.0 / W3C VC v2.0 unsigned credential shape.
  const unsignedCredential: Record<string, unknown> = {
    '@context': [
      'https://www.w3.org/ns/credentials/v2',
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
    ],
    id: credentialId,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: {
      id: keyPair.controller,
      type: 'Profile',
      name: 'SparkLocal',
    },
    validFrom: now,
    credentialSubject: {
      id: input.recipientDid,
      type: ['AchievementSubject'],
      achievement: {
        id: badgeClass.id,
        type: ['Achievement'],
        name: badgeClass.name,
        description: badgeClass.description,
        criteria: badgeClass.criteria,
        tag: badgeClass.tag,
      },
    },
  }

  const verificationKey = await Ed25519VerificationKey2020.from({
    id: keyPair.keyId,
    controller: keyPair.controller,
    publicKeyMultibase: keyPair.publicKeyMultibase,
    privateKeyMultibase: keyPair.privateKeyMultibase,
  })

  const suite = new Ed25519Signature2020({ key: verificationKey })

  const signedCredential = await issue({
    credential: unsignedCredential,
    suite,
    documentLoader: documentLoaderWithFallback,
  })

  return signedCredential as unknown as IssuedBadge
}

export interface VerifyResult {
  valid: boolean
  errors?: string[]
}

/**
 * Verify the Ed25519 proof on a previously-issued Open Badges credential.
 * Returns `{ valid: false }` with a populated `errors` array on failure.
 */
export async function verifyBadge(badge: IssuedBadge): Promise<VerifyResult> {
  try {
    const proof = badge.proof as { verificationMethod?: string } | undefined
    const keyId = proof?.verificationMethod
    if (!keyId) {
      return { valid: false, errors: ['Missing verificationMethod in proof'] }
    }

    const { publicKeyMultibase, controller } = await getKeyProvider().getVerificationKey(keyId)
    const verificationKey = await Ed25519VerificationKey2020.from({
      id: keyId,
      controller,
      publicKeyMultibase,
    })
    const suite = new Ed25519Signature2020({ key: verificationKey })

    const result = await verifyCredential({
      credential: badge as unknown as Record<string, unknown>,
      suite,
      documentLoader: documentLoaderWithFallback,
    })

    if (result.verified) return { valid: true }
    const errMsg =
      result.error && 'message' in result.error
        ? result.error.message
        : result.error instanceof Error
          ? result.error.message
          : 'Unknown verification error'
    return { valid: false, errors: [errMsg ?? 'Unknown verification error'] }
  } catch (err) {
    return { valid: false, errors: [err instanceof Error ? err.message : String(err)] }
  }
}

// V1 document loader. The Digital Bazaar `bundledDocumentLoader` ships the
// W3C Credentials v2 context locally (no network fetches), which covers the
// signing-canonicalization for the credential envelope. The Open Badges 3.0
// context (`https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json`) is
// NOT bundled by Digital Bazaar; for V1 we fall through to an empty
// document so issuance doesn't throw. Production should hand-cache the OB
// context (or pull in `@digitalbazaar/security-document-loader`) so that
// canonicalization is exact and third-party verifiers accept our badges.
const documentLoaderWithFallback: DocumentLoader = async (url: string) => {
  try {
    return await bundledDocumentLoader(url)
  } catch {
    return { contextUrl: null, document: {}, documentUrl: url }
  }
}
