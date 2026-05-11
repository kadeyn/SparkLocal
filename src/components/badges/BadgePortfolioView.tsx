import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Bell,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Trophy,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BrandGradient } from '@/components/brand'
import { cn } from '@/lib/utils'
import { getBadgeClass } from '@/lib/credentials/badgeSchema'
import {
  getProposalProvider,
  type BadgeProposal,
} from '@/lib/credentials/proposalStore'
import BadgeProposalNotification from './BadgeProposalNotification'

interface BadgePortfolioViewProps {
  kidId: string
}

type VerifyState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'verified' }
  | { status: 'failed'; errors: string[] }

export default function BadgePortfolioView({ kidId }: BadgePortfolioViewProps) {
  const [pending, setPending] = useState<BadgeProposal[]>([])
  const [accepted, setAccepted] = useState<BadgeProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [openDetail, setOpenDetail] = useState<BadgeProposal | null>(null)
  const [verify, setVerify] = useState<VerifyState>({ status: 'idle' })
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const provider = getProposalProvider()
      const [p, a] = await Promise.all([
        provider.listProposalsForKid(kidId, 'pending'),
        provider.listAcceptedBadgesForKid(kidId),
      ])
      setPending(p)
      setAccepted(a)
    } finally {
      setLoading(false)
    }
  }, [kidId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleDownloadJson = (proposal: BadgeProposal) => {
    if (!proposal.issuedCredential) return
    const blob = new Blob([JSON.stringify(proposal.issuedCredential, null, 2)], {
      type: 'application/ld+json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filename = `${proposal.badgeClassId.replace(/[^a-z0-9]+/gi, '-')}-${proposal.id}.json`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAllJson = () => {
    const exported = {
      type: 'SparkLocalBadgePortfolio',
      kidId,
      exportedAt: new Date().toISOString(),
      credentials: accepted
        .map((p) => p.issuedCredential)
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sparklocal-portfolio-${kidId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = async () => {
    // V1 stub — points at a future /verify/:credentialId page.
    const baseUrl = window.location.origin
    const placeholder = openDetail?.id
      ? `${baseUrl}/verify/${openDetail.id}`
      : `${baseUrl}/verify`
    try {
      await navigator.clipboard.writeText(placeholder)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      // Clipboard permissions can fail in some browsers; fail silently.
    }
  }

  const handleVerify = async () => {
    if (!openDetail?.issuedCredential) return
    setVerify({ status: 'pending' })
    try {
      const { verifyBadge } = await import('@/lib/credentials/issuer')
      const result = await verifyBadge(openDetail.issuedCredential)
      if (result.valid) {
        setVerify({ status: 'verified' })
      } else {
        setVerify({ status: 'failed', errors: result.errors ?? ['Unknown error'] })
      }
    } catch (err) {
      setVerify({
        status: 'failed',
        errors: [err instanceof Error ? err.message : String(err)],
      })
    }
  }

  const openCredential = (proposal: BadgeProposal) => {
    setOpenDetail(proposal)
    setVerify({ status: 'idle' })
  }

  const closeDetail = () => {
    setOpenDetail(null)
    setVerify({ status: 'idle' })
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My <BrandGradient>portfolio</BrandGradient>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Open Badges 3.0 credentials — yours to share, port, or keep private.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      </header>

      {/* Pending proposals — surface first because they're the actionable bit */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-900">Pending proposals</h2>
          {pending.length > 0 && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              {pending.length}
            </Badge>
          )}
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Nothing waiting for you right now.
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {pending.map((proposal) => (
                <BadgeProposalNotification
                  key={proposal.id}
                  proposal={proposal}
                  kidId={kidId}
                  onAccepted={() => void refresh()}
                  onDeclined={() => void refresh()}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Accepted badges grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900">Accepted badges</h2>
          {accepted.length > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {accepted.length}
            </Badge>
          )}
        </div>

        {accepted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              When you accept a badge, it shows up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {accepted.map((proposal) => {
              const badge = getBadgeClass(proposal.badgeClassId)
              const mentorFirstName = proposal.proposedBy.mentorDisplayName.split(' ')[0]
              return (
                <motion.button
                  key={proposal.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openCredential(proposal)}
                  className="text-left rounded-2xl bg-white border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #fb7185 100%)',
                    }}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {badge?.name ?? 'Badge'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    From {mentorFirstName}
                  </p>
                  {proposal.acceptedAt && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(proposal.acceptedAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.button>
              )
            })}
          </div>
        )}
      </section>

      {/* Export options */}
      {accepted.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Export your portfolio</h2>
          <p className="text-xs text-slate-500 mb-4">
            Your badges follow you — including off SparkLocal.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadAllJson}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download as JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print as PDF
            </Button>
          </div>
        </section>
      )}

      {/* Credential detail dialog */}
      <Dialog open={openDetail !== null} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {openDetail && (() => {
            const badge = getBadgeClass(openDetail.badgeClassId)
            const mentorFirstName = openDetail.proposedBy.mentorDisplayName.split(' ')[0]
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    {badge?.name ?? 'Badge'}
                  </DialogTitle>
                  <DialogDescription>
                    From {mentorFirstName}
                    {openDetail.proposedBy.mentorBusinessName
                      ? ` at ${openDetail.proposedBy.mentorBusinessName}`
                      : ''}
                    {openDetail.acceptedAt
                      ? ` · accepted ${new Date(openDetail.acceptedAt).toLocaleDateString()}`
                      : ''}
                  </DialogDescription>
                </DialogHeader>

                {badge && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-700">{badge.description}</p>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                        Criteria
                      </p>
                      <p className="text-sm text-slate-700">{badge.criteria.narrative}</p>
                    </div>
                  </div>
                )}

                {/* Verify */}
                <div className="rounded-lg border border-slate-200 p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">Verify signature</p>
                    <Button size="sm" variant="outline" onClick={handleVerify} disabled={verify.status === 'pending'}>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                      {verify.status === 'pending' ? 'Verifying…' : 'Verify'}
                    </Button>
                  </div>
                  {verify.status === 'verified' && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Signature is valid — credential issued by SparkLocal.
                    </div>
                  )}
                  {verify.status === 'failed' && (
                    <div className="flex items-start gap-2 text-sm text-rose-700">
                      <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Could not verify locally.</p>
                        <p className="text-xs mt-0.5">
                          {verify.errors.join('; ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {verify.status === 'idle' && (
                    <p className="text-xs text-slate-500">
                      Checks the Ed25519 signature on this credential against SparkLocal's issuer
                      key.
                    </p>
                  )}
                </div>

                {/* Export */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadJson(openDetail)}>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download JSON
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    {copyState === 'copied' ? 'Copied' : 'Copy verification link'}
                  </Button>
                </div>

                {/* Raw credential */}
                <details className="rounded-lg bg-slate-900 text-slate-100 p-3">
                  <summary className="cursor-pointer text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Raw verifiable credential
                  </summary>
                  <pre className="mt-2 text-[11px] leading-snug overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(openDetail.issuedCredential, null, 2)}
                  </pre>
                </details>

                <button
                  type="button"
                  onClick={closeDetail}
                  aria-label="Close"
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
