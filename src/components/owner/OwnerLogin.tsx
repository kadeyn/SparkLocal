import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Briefcase } from 'lucide-react'
import { track } from '@/lib/track'

const LOCKOUT_DURATION = 30 // seconds
const MAX_ATTEMPTS = 3
const AUTH_KEY = 'sparklocal-owner-auth'

export default function OwnerLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const controls = useAnimation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
      navigate('/owner/dashboard', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setAttempts(0)
            setError('')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [lockoutRemaining])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (lockoutRemaining > 0 || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const correctPassword = import.meta.env.VITE_OWNER_PASSWORD

    if (password === correctPassword) {
      track('owner_login_attempted', { success: true })
      sessionStorage.setItem(AUTH_KEY, 'true')
      navigate('/owner/dashboard', { replace: true })
    } else {
      track('owner_login_attempted', { success: false })
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
      })

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_DURATION)
        setError(`Too many attempts. Try again in ${LOCKOUT_DURATION}s`)
      } else {
        setError('Wrong code')
      }

      setPassword('')
    }

    setIsSubmitting(false)
  }

  const isLocked = lockoutRemaining > 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <p className="text-slate-500 text-xs uppercase tracking-wider mb-6">
        SparkLocal · Owner OS
      </p>

      <motion.div
        animate={controls}
        className="w-full max-w-sm p-8 rounded-2xl relative"
        style={{
          background: '#161616',
          border: '1px solid transparent',
          backgroundImage: `
            linear-gradient(#161616, #161616),
            linear-gradient(135deg, #22C8A9, #FFA94D)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
              placeholder="Enter mentor code"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {isLocked && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Locked out for{' '}
                <span className="font-mono text-emerald-400">{lockoutRemaining}s</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password || isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-medium rounded-lg hover:from-emerald-400 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </motion.div>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to site
      </Link>
    </div>
  )
}
