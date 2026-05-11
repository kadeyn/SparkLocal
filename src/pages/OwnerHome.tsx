import { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, ArrowRight, Users, Rocket, Wallet, BookOpen } from 'lucide-react'
import { track } from '@/lib/track'

const SECRET_WORD = 'MENTOR'
const BUFFER_MAX_LENGTH = 12
const BUFFER_TIMEOUT_MS = 3000

const MODULES = [
  { icon: Users, label: 'Pipeline', detail: 'Kid candidates from matched to completed.' },
  { icon: Rocket, label: 'Initiatives', detail: 'What you’re building at the shop — hires, expansion, training.' },
  { icon: Wallet, label: 'Finance', detail: 'Your P&L impact from SparkLocal, modeled.' },
  { icon: BookOpen, label: 'Playbook', detail: 'AI guidance grounded in an owner-specific knowledge base.' },
]

export default function OwnerHome() {
  const navigate = useNavigate()
  const keystrokeBufferRef = useRef('')
  const bufferTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSecretKeystroke = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      if (e.key.length !== 1 || !e.key.match(/[a-zA-Z]/)) {
        return
      }

      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current)
      }

      const newBuffer = (keystrokeBufferRef.current + e.key.toUpperCase()).slice(-BUFFER_MAX_LENGTH)
      keystrokeBufferRef.current = newBuffer

      if (newBuffer.endsWith(SECRET_WORD)) {
        track('owner_secret_triggered')
        keystrokeBufferRef.current = ''
        navigate('/owner/login')
        return
      }

      bufferTimeoutRef.current = setTimeout(() => {
        keystrokeBufferRef.current = ''
      }, BUFFER_TIMEOUT_MS)
    },
    [navigate],
  )

  useEffect(() => {
    if (import.meta.env.PROD) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        track('owner_dev_shortcut_triggered')
        navigate('/owner/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  useEffect(() => {
    window.addEventListener('keydown', handleSecretKeystroke)
    return () => {
      window.removeEventListener('keydown', handleSecretKeystroke)
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current)
      }
    }
  }, [handleSecretKeystroke])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#0a0a0a',
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}
    >
      <header className="px-6 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-emerald-300">Owner OS</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              The operational console for{' '}
              <span className="italic text-emerald-300">SparkLocal mentors</span>.
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
              A separate surface for the business owners who hire kids on the platform. See your
              pipeline of candidates, the operational initiatives you’re shipping, your P&L impact,
              and AI guidance grounded in an owner-specific knowledge base.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {MODULES.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-slate-100">{label}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5 bg-slate-900/40 border border-slate-800 mb-6">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Access</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                The Owner OS is gated. To get in, type the word{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-xs">
                  MENTOR
                </code>{' '}
                anywhere on this page, or in development press{' '}
                <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-xs">
                  Ctrl/Cmd+Shift+M
                </code>
                . Then enter the mentor code your SparkLocal contact provided.
              </p>
            </div>

            <button
              onClick={() => {
                track('owner_home_cta_clicked')
                navigate('/owner/login')
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-white text-sm font-semibold transition-all"
            >
              Go to login
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </main>

      <footer className="px-6 py-5 text-xs text-slate-600 text-center">
        SparkLocal · Owner OS · Internal preview
      </footer>
    </div>
  )
}
