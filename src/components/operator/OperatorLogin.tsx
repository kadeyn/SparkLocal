import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { track } from '@/lib/track'

const LOCKOUT_DURATION = 30 // seconds
const MAX_ATTEMPTS = 3

export default function OperatorLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const controls = useAnimation()
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if already authed
  useEffect(() => {
    if (sessionStorage.getItem('operator_authed') === 'true') {
      navigate('/operator', { replace: true })
    }
  }, [navigate])

  // Lockout countdown timer
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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (lockoutRemaining > 0 || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const correctPassword = import.meta.env.VITE_OPERATOR_PASSWORD

    if (password === correctPassword) {
      track('operator_login_attempted', { success: true })
      sessionStorage.setItem('operator_authed', 'true')
      navigate('/operator', { replace: true })
    } else {
      track('operator_login_attempted', { success: false })
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      // Shake animation
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
      {/* Eyebrow */}
      <p className="text-slate-500 text-xs uppercase tracking-wider mb-6">
        SparkLocal · Operator
      </p>

      {/* Login card */}
      <motion.div
        animate={controls}
        className="w-full max-w-sm p-8 rounded-2xl relative"
        style={{
          background: '#161616',
          border: '1px solid transparent',
          backgroundImage: `
            linear-gradient(#161616, #161616),
            linear-gradient(135deg, #7B61FF, #F97362)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password input */}
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
              placeholder="Enter access code"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
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

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Lockout countdown */}
          {isLocked && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Locked out for{' '}
                <span className="font-mono text-violet-400">{lockoutRemaining}s</span>
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLocked || !password || isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-medium rounded-lg hover:from-violet-500 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </motion.div>

      {/* Back link */}
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
