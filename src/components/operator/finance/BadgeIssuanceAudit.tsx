import {
  Award,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  XCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemoDataBanner } from '../shared'

// Mock issuance metrics — wired to real proposalStore counts in the
// Supabase migration prompt. V1 deliberately holds steady-state demo numbers
// so the audit view tells a coherent story for fundraising / design QA.
const MOCK_KPIS = [
  { id: 'issued', label: 'Badges issued', value: 142, delta: '+18 last 7d', tone: 'good' },
  { id: 'pending', label: 'Pending proposals', value: 23, delta: '+5 last 7d', tone: 'neutral' },
  { id: 'accept_rate', label: 'Acceptance rate', value: '87%', delta: '+2.4 pts', tone: 'good' },
  { id: 'mentors', label: 'Active issuers', value: 11, delta: '+1 last 7d', tone: 'good' },
] as const

const MOCK_FUNNEL = {
  proposed: 163,
  accepted: 142,
  declined: 12,
  expired: 9,
}

const MOCK_TOP_MENTORS = [
  { name: 'Marcus T.', business: 'Thompson HVAC & Air', proposed: 21, accepted: 19 },
  { name: 'Lina O.', business: 'Olsen Apparel Co.', proposed: 17, accepted: 16 },
  { name: 'Devon K.', business: 'FreshCuts Barbershop', proposed: 14, accepted: 12 },
  { name: 'Priya R.', business: 'Bloom Bakery', proposed: 11, accepted: 10 },
  { name: 'Jamal W.', business: 'Westside Auto', proposed: 9, accepted: 9 },
]

const MOCK_TOP_BADGES = [
  { id: 'first-hustle', name: 'First Hustle', issued: 38 },
  { id: 'social-media-content', name: 'Social Media Content Creator', issued: 24 },
  { id: 'recurring-customer', name: 'Recurring Customer', issued: 22 },
  { id: 'landscaping-basics', name: 'Landscaping Basics', issued: 17 },
  { id: 'apprentice-hvac', name: 'HVAC Apprentice', issued: 14 },
]

function ToneClass(tone: 'good' | 'neutral' | 'warn'): string {
  if (tone === 'good') return 'text-emerald-700'
  if (tone === 'warn') return 'text-amber-700'
  return 'text-slate-600'
}

export default function BadgeIssuanceAudit() {
  const issuerDid = import.meta.env.VITE_OB_ISSUER_DID as string | undefined
  const isProd = import.meta.env.PROD
  const usingEnvVarKey = true // V1: always env-var. Replace when KMS lands.
  const keyConfigured = Boolean(issuerDid)

  // Funnel percentages
  const proposed = MOCK_FUNNEL.proposed
  const acceptPct = Math.round((MOCK_FUNNEL.accepted / proposed) * 100)
  const declinePct = Math.round((MOCK_FUNNEL.declined / proposed) * 100)
  const expirePct = Math.max(0, 100 - acceptPct - declinePct)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Badge issuance</h1>
            <p className="text-sm text-slate-500">
              Open Badges 3.0 issuance health · acceptance funnel · key posture
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_KPIS.map((kpi) => (
          <div key={kpi.id} className="rounded-xl p-4 bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                {kpi.id === 'issued' && <Award className="w-4 h-4 text-indigo-600" />}
                {kpi.id === 'pending' && <Sparkles className="w-4 h-4 text-indigo-600" />}
                {kpi.id === 'accept_rate' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                {kpi.id === 'mentors' && <TrendingUp className="w-4 h-4 text-indigo-600" />}
              </div>
              <span className={cn('text-[10px] uppercase tracking-wider font-semibold', ToneClass(kpi.tone))}>
                {kpi.delta}
              </span>
            </div>
            <p
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {kpi.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Signing key health */}
      <div
        className={cn(
          'rounded-xl border p-5',
          isProd && usingEnvVarKey
            ? 'bg-amber-50 border-amber-200'
            : 'bg-white border-slate-200',
        )}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">Signing key health</h3>
              <p className="text-xs text-slate-500">
                Active issuer + rotation posture · read from VITE_OB_* env vars
              </p>
            </div>
          </div>

          {keyConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Key configured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Key NOT configured
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Issuer DID
            </p>
            <p
              className="text-xs text-slate-900 break-all"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {issuerDid ?? '— not set —'}
            </p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Storage
            </p>
            <p className="text-xs text-slate-900">env var (Vite)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Production must move to KMS / Vault
            </p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Last rotated
            </p>
            <p className="text-xs text-slate-900">Never (dev key)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">12-month rotation policy on roadmap</p>
          </div>
        </div>

        {isProd && usingEnvVarKey && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-100 border border-amber-300 p-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900">
              <strong>Production warning:</strong> the signing key is being read from a build-time
              env var. Move to KMS before any non-demo issuance. See
              <code className="mx-1">src/lib/credentials/keyProvider.ts</code> for the swap point.
            </p>
          </div>
        )}
      </div>

      {/* Funnel + top mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Proposal funnel</h3>
          <p className="text-xs text-slate-500 mb-4">
            {MOCK_FUNNEL.proposed} proposed · last 30 days
          </p>

          <div className="space-y-3">
            <FunnelRow
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              label="Accepted"
              count={MOCK_FUNNEL.accepted}
              percent={acceptPct}
              colorClass="bg-emerald-500"
            />
            <FunnelRow
              icon={<XCircle className="w-4 h-4 text-slate-400" />}
              label="Declined"
              count={MOCK_FUNNEL.declined}
              percent={declinePct}
              colorClass="bg-slate-400"
            />
            <FunnelRow
              icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              label="Expired (30d)"
              count={MOCK_FUNNEL.expired}
              percent={expirePct}
              colorClass="bg-amber-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Top mentors by issuance</h3>
          <p className="text-xs text-slate-500 mb-4">Last 30 days · proposed vs accepted</p>
          <div className="space-y-2">
            {MOCK_TOP_MENTORS.map((m) => {
              const rate = Math.round((m.accepted / m.proposed) * 100)
              return (
                <div
                  key={m.name}
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.business}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-semibold text-slate-900"
                      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                    >
                      {m.accepted}/{m.proposed}
                    </p>
                    <p className="text-[11px] text-emerald-700">{rate}% accept</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Most-issued badge classes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-1">Most-issued badge classes</h3>
        <p className="text-xs text-slate-500 mb-4">
          Where mentor proposals are concentrating · last 30 days
        </p>
        <div className="space-y-2">
          {MOCK_TOP_BADGES.map((b) => {
            const max = Math.max(...MOCK_TOP_BADGES.map((x) => x.issued))
            const pct = Math.round((b.issued / max) * 100)
            return (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-1/3 min-w-0">
                  <p className="text-sm text-slate-900 truncate">{b.name}</p>
                </div>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-rose-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span
                  className="text-xs text-slate-700 w-10 text-right shrink-0"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  {b.issued}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FunnelRow({
  icon,
  label,
  count,
  percent,
  colorClass,
}: {
  icon: React.ReactNode
  label: string
  count: number
  percent: number
  colorClass: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-slate-700">{label}</span>
        </div>
        <span
          className="text-slate-900 font-medium"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {count} <span className="text-slate-400 text-xs">({percent}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={cn('h-full', colorClass)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
