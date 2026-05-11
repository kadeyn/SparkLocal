import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { BrandGradient } from '@/components/brand'
import { COMPLIANCE_CONFIG } from '@/lib/compliance'
import { cn } from '@/lib/utils'

interface AgeFloorGateProps {
  // Birth month/year the user just supplied. Used to remind them what they
  // told us and to populate the waitlist record. Optional because the gate
  // can also be reached via direct navigation from a parent surface.
  birthMonth?: number
  birthYear?: number
  // Caller-supplied submit handler. Default behavior simulates a successful
  // submit so the prototype shows the confirmation state; wire to real
  // persistence when the waitlist backend lands.
  onWaitlistSubmit?: (payload: { email: string; birthMonth: number; birthYear: number }) => Promise<void>
}

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

export default function AgeFloorGate({
  birthMonth,
  birthYear,
  onWaitlistSubmit,
}: AgeFloorGateProps) {
  const [email, setEmail] = useState('')
  const [month, setMonth] = useState<number | ''>(birthMonth ?? '')
  const [year, setYear] = useState<string>(birthYear ? String(birthYear) : '')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    email.trim().length > 3 &&
    email.includes('@') &&
    typeof month === 'number' &&
    year.length === 4 &&
    !Number.isNaN(Number(year))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        email: email.trim(),
        birthMonth: Number(month),
        birthYear: Number(year),
      }
      if (onWaitlistSubmit) {
        await onWaitlistSubmit(payload)
      } else {
        // Simulated success — wire to real persistence when the waitlist
        // backend lands. Keeps the prototype demo-able offline.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      setSubmitted(true)
    } catch (err) {
      console.error('Waitlist submit failed:', err)
      setError('We couldn\'t save that — try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-rose-500/90 relative overflow-hidden flex items-center justify-center px-6 py-12">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full"
      >
        <div className="rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl p-8 sm:p-10">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">
                  Waitlist
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                We're not <BrandGradient>quite there yet</BrandGradient>.
              </h1>

              <p className="text-base text-slate-700 mb-5 leading-relaxed">
                Right now SparkLocal is open to people {COMPLIANCE_CONFIG.minimumAge} and up. We're
                building the version for younger kids carefully — we want to get the safety,
                payment, and parent-side pieces right before we open it up.
              </p>

              {/* Parent-readable explanation block — clearer about the why */}
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1.5">
                  For parents
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Our V1 launches at {COMPLIANCE_CONFIG.minimumAge}+ to meet the amended FTC COPPA
                  Rule and California AADC requirements out of the gate, then expand to younger
                  ages once the operational and legal foundation is mature.{' '}
                  <Link to="/parent/age-policy" className="text-indigo-700 font-medium underline underline-offset-2 hover:text-indigo-900">
                    Read the full age-policy FAQ
                  </Link>
                  .
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Birth month and year
                  </label>
                  <p className="text-xs text-slate-500 mb-2">We don't collect the day — just enough to know when you'll be eligible.</p>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : '')}
                      className="col-span-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                      required
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={year}
                      onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Year"
                      className="px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold text-white transition-all',
                    'bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-500 hover:to-rose-400',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2',
                  )}
                >
                  {submitting ? 'Saving…' : (
                    <>
                      Join the waitlist
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-500 mt-5 text-center">
                We'll only email you when SparkLocal opens for your age. No marketing, no sharing.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">You're on the list.</h2>
              <p className="text-slate-600 leading-relaxed">
                We'll email you the moment SparkLocal opens up for your age. In the meantime,
                stay curious.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Back to home
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
