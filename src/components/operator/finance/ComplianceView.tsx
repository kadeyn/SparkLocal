import {
  ShieldCheck,
  Lock,
  ToggleLeft,
  ToggleRight,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { COMPLIANCE_CONFIG } from '@/lib/compliance'
import { FEATURE_FLAGS, type FeatureFlag } from '@/lib/featureFlags'
import { RETENTION_POLICIES } from '@/lib/dataRetention'
import { DemoDataBanner } from '../shared'
import { cn } from '@/lib/utils'

// Mock state — wired to real counts in prompt 2.
const MOCK_TRACK_COUNTS = [
  { track: 'Explorer', count: 0, status: 'gated', helper: 'Feature-flagged off — ages 11-13 deferred to V1.1+' },
  { track: 'Builder', count: 287, status: 'active', helper: 'Ages 14-16 — V1 primary cohort' },
  { track: 'Pro', count: 154, status: 'active', helper: 'Ages 17-18 — V1 primary cohort' },
] as const

// Mock renewal queue — wired to real consent records in prompt 2.
const MOCK_CONSENT_RENEWALS = [
  { id: 'cr-1', kidName: 'Jaylen R.', parentEmail: 'mike.r@…', dueDate: '2026-05-18', scopes: 3 },
  { id: 'cr-2', kidName: 'Sofia M.', parentEmail: 'a.morales@…', dueDate: '2026-05-21', scopes: 2 },
  { id: 'cr-3', kidName: 'Bryce L.', parentEmail: 'l.lopez@…', dueDate: '2026-05-30', scopes: 3 },
  { id: 'cr-4', kidName: 'Mia T.', parentEmail: 'd.tran@…', dueDate: '2026-06-04', scopes: 2 },
]

// Which prompt in the May-2026 sequence ships each deferred flag.
const FLAG_PROMPT: Partial<Record<FeatureFlag, string>> = {
  parentMediatedPayments: 'Prompt 2',
  openBadgesIssuer: 'Prompt 2',
  boundedDailyFeed: 'Prompt 3',
  pathTabRestructure: 'Prompt 3',
  familyPlanDualPriority: 'Prompt 4',
  aiCostRouter: 'Prompt 5',
  sessionPacing: 'Prompt 5',
}

const FLAG_LABELS: Record<FeatureFlag, string> = {
  explorerTrackUI: 'Explorer track UI (ages 11-13)',
  parentMediatedPayments: 'Parent-mediated payments',
  openBadgesIssuer: 'Open Badges 3.0 issuer',
  familyPlanDualPriority: 'Family Plan dual-priority',
  boundedDailyFeed: 'Bounded daily feed',
  pathTabRestructure: 'Path tab: My Path + Explore',
  aiCostRouter: 'AI cost router',
  sessionPacing: 'Session pacing',
  notificationBlackoutEnforcement: 'Notification blackout (SB 976 / SAFE)',
  dataRetentionAutomation: 'Data retention automation',
  separateParentConsent: 'Separate parental consent flow',
}

function formatRetention(days: number): string {
  if (days >= 365) {
    const years = days / 365
    return `${years % 1 === 0 ? years : years.toFixed(1)} year${years === 1 ? '' : 's'}`
  }
  return `${days} days`
}

export default function ComplianceView() {
  const totalActiveUsers = MOCK_TRACK_COUNTS.filter((t) => t.status === 'active').reduce(
    (acc, t) => acc + t.count,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Compliance & Policy</h1>
            <p className="text-sm text-slate-500">
              Source of truth for age, consent, retention, and feature gating
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
              V1 floor
            </span>
          </div>
          <p
            className="text-2xl font-semibold text-slate-900"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {COMPLIANCE_CONFIG.minimumAge}+
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Minimum age</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              {COMPLIANCE_CONFIG.explorerTrackEnabled ? (
                <ToggleRight className="w-4 h-4 text-amber-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">
              {COMPLIANCE_CONFIG.explorerTrackEnabled ? 'On' : 'Off'}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900">Explorer track</p>
          <p className="text-xs text-slate-500 mt-0.5">Ages 11-13 — V1.1+</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <p
            className="text-2xl font-semibold text-slate-900"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {totalActiveUsers}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Active users · Builder + Pro</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-rose-700 font-semibold">
              30d
            </span>
          </div>
          <p
            className="text-2xl font-semibold text-slate-900"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {MOCK_CONSENT_RENEWALS.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Consent renewals due</p>
        </div>
      </div>

      {/* Users by track + consent renewal queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Users by track</h3>
              <p className="text-xs text-slate-500">Mock — wires to real counts in prompt 2</p>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_TRACK_COUNTS.map((t) => (
              <div key={t.track} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{t.track}</span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold',
                        t.status === 'gated'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700',
                      )}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.helper}</p>
                </div>
                <span
                  className="text-lg font-semibold text-slate-900 shrink-0"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Consent renewal queue</h3>
              <p className="text-xs text-slate-500">
                Annual renewal window per COPPA amended rule · next 30 days
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {MOCK_CONSENT_RENEWALS.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{r.kidName}</p>
                  <p className="text-xs text-slate-500 truncate">{r.parentEmail}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-500">{r.scopes} scopes</span>
                  <span
                    className="text-xs text-rose-700 font-medium"
                    style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                  >
                    {r.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retention policy table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Data retention policy</h3>
          <p className="text-xs text-slate-500">From <code className="text-[11px]">src/lib/dataRetention.ts</code> · COPPA amended rule (in force 2026-04-22)</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="py-2.5 px-5 font-medium">Data type</th>
              <th className="py-2.5 px-5 font-medium">Retain</th>
              <th className="py-2.5 px-5 font-medium">Method</th>
              <th className="py-2.5 px-5 font-medium">Legal basis</th>
            </tr>
          </thead>
          <tbody>
            {RETENTION_POLICIES.map((p) => (
              <tr key={p.dataType} className="border-t border-slate-100">
                <td className="py-3 px-5 text-slate-700">
                  <code className="text-[12px]">{p.dataType}</code>
                </td>
                <td
                  className="py-3 px-5 text-slate-700"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  {formatRetention(p.retentionDays)}
                </td>
                <td className="py-3 px-5">
                  <span
                    className={cn(
                      'text-[11px] px-2 py-0.5 rounded font-semibold uppercase',
                      p.deletionMethod === 'hard' && 'bg-rose-100 text-rose-700',
                      p.deletionMethod === 'anonymize' && 'bg-amber-100 text-amber-700',
                      p.deletionMethod === 'archive' && 'bg-blue-100 text-blue-700',
                    )}
                  >
                    {p.deletionMethod}
                  </span>
                </td>
                <td className="py-3 px-5 text-xs text-slate-600">{p.legalBasis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature flag status table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Feature flag status</h3>
          <p className="text-xs text-slate-500">
            From <code className="text-[11px]">src/lib/featureFlags.ts</code> · deferred features show the prompt that ships them
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {(Object.keys(FEATURE_FLAGS) as FeatureFlag[]).map((flag) => {
            const enabled = FEATURE_FLAGS[flag]
            const promptOwner = FLAG_PROMPT[flag]
            return (
              <div key={flag} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {enabled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{FLAG_LABELS[flag]}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      <code>{flag}</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {promptOwner && !enabled && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold uppercase">
                      {promptOwner}
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-[11px] px-2 py-0.5 rounded font-semibold uppercase',
                      enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {enabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notification blackout summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900">Notification blackout windows</h3>
            <p className="text-xs text-slate-500">
              Applied to all minors via <code className="text-[11px]">notificationGuard.ts</code> · adopts strictest U.S. standard regardless of jurisdiction
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Nightly
            </p>
            <p
              className="text-lg text-slate-900"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {COMPLIANCE_CONFIG.notificationBlackout.nightStart} – {COMPLIANCE_CONFIG.notificationBlackout.nightEnd}
            </p>
            <p className="text-xs text-slate-500 mt-1">Every day · user-local</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              School day
            </p>
            <p
              className="text-lg text-slate-900"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {COMPLIANCE_CONFIG.notificationBlackout.schoolDayStart} – {COMPLIANCE_CONFIG.notificationBlackout.schoolDayEnd}
            </p>
            <p className="text-xs text-slate-500 mt-1">Mon-Fri · Sep-May</p>
          </div>
        </div>
      </div>
    </div>
  )
}
