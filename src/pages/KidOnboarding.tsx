import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useSurveyStore } from '@/lib/surveyState'
import { cn } from '@/lib/utils'

// Question definitions
const questions = [
  {
    id: 1,
    key: 'favoriteSubjects' as const,
    type: 'single' as const,
    question: 'What subjects do you actually like in school?',
    options: [
      'Math & numbers',
      'Art & design',
      'Science & how things work',
      'Writing & stories',
      'Sports & PE',
      'Honestly, none of them',
    ],
  },
  {
    id: 2,
    key: 'hobbies' as const,
    type: 'multi' as const,
    maxSelect: 3,
    question: 'What do you do for fun?',
    options: [
      'Gaming',
      'Sports',
      'Making videos',
      'Drawing or design',
      'Working on cars',
      'Music',
      'Building stuff with my hands',
      'Cooking or baking',
      'Hanging with friends',
      'Reading',
    ],
  },
  {
    id: 3,
    key: 'moneyMotivation' as const,
    type: 'single' as const,
    question: 'Money-wise, where are you at?',
    options: [
      'Saving up for something specific',
      'Want spending money',
      'Helping out at home',
      'Just curious about earning',
    ],
  },
  {
    id: 4,
    key: 'wantToTry' as const,
    type: 'text' as const,
    question: "What's something you've always wanted to try?",
    placeholder: "Anything goes — be honest.",
  },
  {
    id: 5,
    key: 'timeAvailable' as const,
    type: 'single' as const,
    question: 'How much time do you actually have?',
    options: [
      'A few hours on weekends',
      'After school most days',
      'Summer only',
      "Whenever, I'm flexible",
    ],
  },
  {
    id: 6,
    key: 'zipCode' as const,
    type: 'zip' as const,
    question: "What's your zip code?",
    placeholder: '36601',
  },
  {
    id: 7,
    key: 'ageGate' as const,
    type: 'single' as const,
    question: 'Are you 13 or older?',
    options: ['Yes', "No, I'm 11 or 12"],
    valueMap: { Yes: 'over13', "No, I'm 11 or 12": 'under13' },
  },
  {
    id: 8,
    key: 'workStyle' as const,
    type: 'single' as const,
    question: 'Last one. What sounds best?',
    options: [
      'Working with my hands',
      'Working with people',
      'Working with tech or screens',
      'Working alone on my own thing',
      'Honestly not sure yet',
    ],
  },
]

// Loading messages
const loadingMessages = [
  'Finding opportunities near you...',
  'Matching you with local businesses...',
  'Pulling together your feed...',
]

// Floating shapes component for background decoration
function FloatingShapes({ step }: { step: number }) {
  const shapes = [
    { size: 300, x: '10%', y: '20%', color: 'rgba(79, 70, 229, 0.15)', delay: 0 },
    { size: 200, x: '80%', y: '60%', color: 'rgba(251, 113, 133, 0.12)', delay: 0.5 },
    { size: 250, x: '60%', y: '10%', color: 'rgba(79, 70, 229, 0.1)', delay: 1 },
    { size: 180, x: '20%', y: '70%', color: 'rgba(251, 113, 133, 0.15)', delay: 1.5 },
    { size: 150, x: '90%', y: '30%', color: 'rgba(79, 70, 229, 0.12)', delay: 2 },
  ]

  // Shift positions based on step for variety
  const offset = step * 5

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            backgroundColor: shape.color,
          }}
          animate={{
            x: [0, 20 + offset, -10, 0],
            y: [0, -15, 10 + offset, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  )
}

// Noise texture overlay
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Progress indicator
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium"
      role="status"
      aria-label={`Question ${current} of ${total}`}
    >
      {current}/{total}
    </div>
  )
}

// Back button
function BackButton({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  if (!visible) return null

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      aria-label="Go back to previous question"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </motion.button>
  )
}

// Pill button component
interface PillButtonProps {
  children: React.ReactNode
  selected?: boolean
  onClick: () => void
  disabled?: boolean
}

function PillButton({ children, selected, onClick, disabled }: PillButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-6 py-4 rounded-full text-left text-lg font-medium transition-all duration-200',
        'backdrop-blur-md border',
        selected
          ? 'bg-white text-indigo-600 border-white shadow-lg'
          : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </motion.button>
  )
}

// Splash screen (Phase 1)
function SplashScreen({ onStart }: { onStart: () => void }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.h1
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
      >
        8 questions. 90 seconds.
      </motion.h1>
      <motion.p
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl sm:text-2xl text-white/70 mb-12"
      >
        Find ways to earn near you.
      </motion.p>
      <motion.button
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-4 rounded-full bg-white text-indigo-600 text-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
      >
        Start
      </motion.button>
    </motion.div>
  )
}

// Single select question
function SingleSelectQuestion({
  question,
  options,
  value,
  onChange,
  valueMap,
}: {
  question: string
  options: string[]
  value: string | null
  onChange: (value: string) => void
  valueMap?: Record<string, string>
}) {
  const handleSelect = (option: string) => {
    const mappedValue = valueMap?.[option] || option
    onChange(mappedValue)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-10 leading-tight">
          {question}
        </h2>
        <div className="space-y-3">
          {options.map((option) => {
            const mappedValue = valueMap?.[option] || option
            return (
              <PillButton
                key={option}
                selected={value === mappedValue}
                onClick={() => handleSelect(option)}
              >
                {option}
              </PillButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Multi select question
function MultiSelectQuestion({
  question,
  options,
  values,
  maxSelect,
  onChange,
}: {
  question: string
  options: string[]
  values: string[]
  maxSelect: number
  onChange: (values: string[]) => void
}) {
  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option))
    } else if (values.length < maxSelect) {
      onChange([...values, option])
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-2 leading-tight">
          {question}
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Pick up to {maxSelect} ({values.length}/{maxSelect} selected)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <PillButton
              key={option}
              selected={values.includes(option)}
              onClick={() => handleToggle(option)}
              disabled={!values.includes(option) && values.length >= maxSelect}
            >
              {option}
            </PillButton>
          ))}
        </div>
      </div>
    </div>
  )
}

// Text input question
function TextQuestion({
  question,
  placeholder,
  value,
  onChange,
  onSkip,
}: {
  question: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSkip: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto w-full">
        <label htmlFor="text-input" className="block">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-10 leading-tight">
            {question}
          </h2>
        </label>
        <input
          id="text-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
          autoFocus
        />
        <button
          onClick={onSkip}
          className="mt-4 text-white/50 hover:text-white/70 text-sm underline underline-offset-4 transition-colors"
        >
          Skip this question
        </button>
      </div>
    </div>
  )
}

// Zip code question
function ZipQuestion({
  question,
  placeholder,
  value,
  onChange,
}: {
  question: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5)
    onChange(val)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-20">
      <div className="max-w-md mx-auto w-full text-center">
        <label htmlFor="zip-input" className="block">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-10 leading-tight">
            {question}
          </h2>
        </label>
        <input
          id="zip-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-8 py-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-3xl text-center font-bold tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
          autoFocus
        />
      </div>
    </div>
  )
}

// Loading screen (Phase 3)
function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 1200)

    const navigateTimeout = setTimeout(() => {
      navigate('/onboarding/results')
    }, 4000)

    return () => {
      clearInterval(messageInterval)
      clearTimeout(navigateTimeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Animated map pin */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-8"
      >
        {/* Abstract neighborhood pattern */}
        <svg
          width="200"
          height="150"
          viewBox="0 0 200 150"
          className="opacity-30"
          aria-hidden="true"
        >
          {/* Houses/buildings as simple shapes */}
          <rect x="20" y="80" width="30" height="40" rx="4" fill="white" />
          <rect x="60" y="70" width="25" height="50" rx="4" fill="white" />
          <rect x="95" y="85" width="35" height="35" rx="4" fill="white" />
          <rect x="140" y="75" width="28" height="45" rx="4" fill="white" />
          {/* Roads */}
          <rect x="0" y="120" width="200" height="8" rx="2" fill="white" opacity="0.5" />
          <rect x="85" y="100" width="8" height="50" rx="2" fill="white" opacity="0.5" />
        </svg>
        {/* Map pin */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl">
            <MapPin className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="w-4 h-4 bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </motion.div>
      </motion.div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-xl sm:text-2xl text-white/80 text-center"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// Main component
export default function KidOnboarding() {
  const [step, setStep] = useState(0) // 0 = splash, 1-8 = questions, 9 = loading
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const { answers, setAnswer, markComplete } = useSurveyStore()
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle next step
  const goNext = useCallback(() => {
    if (step < 9) {
      setDirection(1)
      setStep((prev) => prev + 1)
    }
    if (step === 8) {
      markComplete()
    }
  }, [step, markComplete])

  // Handle back
  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1)
      setStep((prev) => prev - 1)
    }
  }, [step])

  // Auto-advance for single select questions
  const handleSingleSelect = useCallback(
    (key: keyof typeof answers, value: string) => {
      setAnswer(key, value as never)
      setTimeout(goNext, 300)
    },
    [setAnswer, goNext]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step >= 1 && step <= 8) {
        const currentQ = questions[step - 1]
        if (currentQ.type === 'text' || currentQ.type === 'zip') {
          goNext()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, goNext])

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? '100%' : '-100%',
      opacity: prefersReducedMotion ? 0 : 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? '-100%' : '100%',
      opacity: prefersReducedMotion ? 0 : 1,
    }),
  }

  // Render current question
  const renderQuestion = () => {
    const q = questions[step - 1]
    if (!q) return null

    switch (q.type) {
      case 'single':
        return (
          <SingleSelectQuestion
            question={q.question}
            options={q.options}
            value={answers[q.key] as string | null}
            onChange={(value) => handleSingleSelect(q.key, value)}
            valueMap={(q as { valueMap?: Record<string, string> }).valueMap}
          />
        )
      case 'multi':
        return (
          <MultiSelectQuestion
            question={q.question}
            options={q.options}
            values={answers[q.key] as string[]}
            maxSelect={(q as { maxSelect: number }).maxSelect}
            onChange={(values) => setAnswer(q.key, values as never)}
          />
        )
      case 'text':
        return (
          <TextQuestion
            question={q.question}
            placeholder={(q as { placeholder: string }).placeholder}
            value={answers[q.key] as string}
            onChange={(value) => setAnswer(q.key, value as never)}
            onSkip={goNext}
          />
        )
      case 'zip':
        return (
          <ZipQuestion
            question={q.question}
            placeholder={(q as { placeholder: string }).placeholder}
            value={answers[q.key] as string}
            onChange={(value) => setAnswer(q.key, value as never)}
          />
        )
      default:
        return null
    }
  }

  // Check if current question allows proceeding
  const canProceed = () => {
    if (step < 1 || step > 8) return false
    const q = questions[step - 1]
    switch (q.type) {
      case 'single':
        return answers[q.key] !== null
      case 'multi':
        return (answers[q.key] as string[]).length > 0
      case 'text':
        return true // Can always skip
      case 'zip':
        return (answers[q.key] as string).length === 5
      default:
        return false
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-rose-500/90 relative overflow-hidden"
    >
      {/* Background effects */}
      <FloatingShapes step={step} />
      <NoiseOverlay />

      {/* Progress indicator (only during questions) */}
      {step >= 1 && step <= 8 && <ProgressIndicator current={step} total={8} />}

      {/* Back button (only from question 2 onward) */}
      <AnimatePresence>
        {step >= 2 && step <= 8 && <BackButton onClick={goBack} visible={true} />}
      </AnimatePresence>

      {/* Continue button for multi-select, text, and zip */}
      {step >= 1 && step <= 8 && (
        <AnimatePresence>
          {canProceed() && questions[step - 1].type !== 'single' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={goNext}
              className="fixed bottom-6 left-6 z-50 px-8 py-3 rounded-full bg-white text-indigo-600 font-bold shadow-xl hover:shadow-2xl transition-shadow duration-200"
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait" custom={direction}>
        {step === 0 && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SplashScreen onStart={() => setStep(1)} />
          </motion.div>
        )}

        {step >= 1 && step <= 8 && (
          <motion.div
            key={`question-${step}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderQuestion()}
          </motion.div>
        )}

        {step === 9 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
