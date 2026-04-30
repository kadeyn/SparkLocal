import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useSurveyStore } from '@/lib/surveyState'
import { businessOwners } from '@/data/businessOwners'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Interest categories mapped to colors
const interestCategories = {
  trades: { label: 'Trades', color: '#F97362' },
  creative: { label: 'Creative', color: '#7B61FF' },
  service: { label: 'Service', color: '#22C8A9' },
}

// Map survey answers to interest categories
function mapAnswersToGalaxy(answers: {
  favoriteSubjects: string | null
  hobbies: string[]
  workStyle: string | null
}) {
  const galaxies: { label: string; color: string }[] = []

  // Map favorite subjects
  if (answers.favoriteSubjects) {
    if (
      answers.favoriteSubjects.includes('Math') ||
      answers.favoriteSubjects.includes('Science')
    ) {
      galaxies.push(interestCategories.trades)
    }
    if (
      answers.favoriteSubjects.includes('Art') ||
      answers.favoriteSubjects.includes('Writing')
    ) {
      galaxies.push(interestCategories.creative)
    }
  }

  // Map work style
  if (answers.workStyle) {
    if (answers.workStyle.includes('hands')) {
      if (!galaxies.find((g) => g.label === 'Trades')) {
        galaxies.push(interestCategories.trades)
      }
    }
    if (answers.workStyle.includes('people')) {
      galaxies.push(interestCategories.service)
    }
    if (answers.workStyle.includes('tech') || answers.workStyle.includes('screens')) {
      if (!galaxies.find((g) => g.label === 'Creative')) {
        galaxies.push(interestCategories.creative)
      }
    }
  }

  // Map hobbies
  const creativeHobbies = ['Making videos', 'Drawing or design', 'Music']
  const tradesHobbies = ['Working on cars', 'Building stuff with my hands', 'Cooking or baking']
  const serviceHobbies = ['Hanging with friends', 'Sports']

  if (answers.hobbies.some((h) => creativeHobbies.includes(h))) {
    if (!galaxies.find((g) => g.label === 'Creative')) {
      galaxies.push(interestCategories.creative)
    }
  }
  if (answers.hobbies.some((h) => tradesHobbies.includes(h))) {
    if (!galaxies.find((g) => g.label === 'Trades')) {
      galaxies.push(interestCategories.trades)
    }
  }
  if (answers.hobbies.some((h) => serviceHobbies.includes(h))) {
    if (!galaxies.find((g) => g.label === 'Service')) {
      galaxies.push(interestCategories.service)
    }
  }

  // Ensure we always have 3 galaxies
  const allCategories = [
    interestCategories.creative,
    interestCategories.trades,
    interestCategories.service,
  ]
  for (const cat of allCategories) {
    if (galaxies.length >= 3) break
    if (!galaxies.find((g) => g.label === cat.label)) {
      galaxies.push(cat)
    }
  }

  return galaxies.slice(0, 3)
}

// Interest Galaxy SVG component
function InterestGalaxy({
  galaxies,
}: {
  galaxies: { label: string; color: string }[]
}) {
  const centerX = 120
  const centerY = 100
  const radius = 60
  const nodeRadius = 28
  const centerNodeRadius = 22

  // Calculate positions for 3 nodes around center
  const positions = galaxies.map((_, i) => {
    const angle = (i * 120 - 90) * (Math.PI / 180)
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <svg
      width="240"
      height="200"
      viewBox="0 0 240 200"
      className="mx-auto"
      role="img"
      aria-label="Your interest constellation showing three connected interest areas"
    >
      {/* Connection lines */}
      {positions.map((pos, i) => (
        <motion.line
          key={`line-${i}`}
          x1={centerX}
          y1={centerY}
          x2={pos.x}
          y2={pos.y}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
        />
      ))}

      {/* Center "You" node */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={centerNodeRadius}
        fill="white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, type: 'spring' }}
      />
      <motion.text
        x={centerX}
        y={centerY + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#4F46E5"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        You
      </motion.text>

      {/* Interest nodes */}
      {galaxies.map((galaxy, i) => (
        <motion.g
          key={galaxy.label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.15, duration: 0.4, type: 'spring' }}
        >
          <circle
            cx={positions[i].x}
            cy={positions[i].y}
            r={nodeRadius}
            fill={galaxy.color}
          />
          <text
            x={positions[i].x}
            y={positions[i].y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="600"
          >
            {galaxy.label}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}

// Match preview card
function MatchCard({
  owner,
  index,
}: {
  owner: (typeof businessOwners)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
      className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
    >
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-12 h-12 mb-2 border-2 border-white/30">
          <AvatarImage src={owner.avatar} alt={owner.name} />
          <AvatarFallback className="bg-indigo-500 text-white text-sm">
            {owner.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-white text-sm truncate w-full">
          {owner.name.split(' ')[0]}
        </p>
        <p className="text-white/60 text-xs truncate w-full">
          {owner.businessType}
        </p>
        <p className="text-white/40 text-xs mt-1">{owner.distance}</p>
      </div>
    </motion.div>
  )
}

// Noise texture overlay
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Floating shapes for background
function FloatingShapes() {
  const shapes = [
    { size: 280, x: '15%', y: '25%', color: 'rgba(79, 70, 229, 0.12)', delay: 0 },
    { size: 200, x: '75%', y: '55%', color: 'rgba(251, 113, 133, 0.1)', delay: 0.5 },
    { size: 220, x: '55%', y: '15%', color: 'rgba(79, 70, 229, 0.08)', delay: 1 },
  ]

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
            x: [0, 15, -10, 0],
            y: [0, -12, 8, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function OnboardingResults() {
  const navigate = useNavigate()
  const { answers, reset } = useSurveyStore()

  // Get top 3 business owners
  const topMatches = businessOwners.slice(0, 3)

  // Map survey answers to interest galaxies
  const galaxies = mapAnswersToGalaxy({
    favoriteSubjects: answers.favoriteSubjects,
    hobbies: answers.hobbies,
    workStyle: answers.workStyle,
  })

  const handleRetake = () => {
    reset()
    navigate('/onboarding/kid')
  }

  const handleContinue = () => {
    navigate('/app/feed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/85 via-purple-500/75 to-rose-400/85 relative overflow-hidden">
      <FloatingShapes />
      <NoiseOverlay />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px] mx-auto space-y-10">
          {/* Hero block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-rose-300 uppercase tracking-widest text-sm font-semibold mb-3"
            >
              Your Match
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              We found{' '}
              <span
                className="text-white/90"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                6
              </span>{' '}
              local opportunities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-white/70 text-lg"
            >
              Within{' '}
              <span className="font-semibold text-white/90">4</span> miles of you
              in Mobile, AL.
            </motion.p>
          </motion.div>

          {/* Top 3 matches preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="space-y-3"
          >
            <h2
              className="text-white/80 text-sm font-semibold uppercase tracking-wide text-center"
            >
              Top 3 Matches
            </h2>
            <div className="flex gap-3 flex-col sm:flex-row">
              {topMatches.map((owner, i) => (
                <MatchCard key={owner.id} owner={owner} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Interest galaxy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center space-y-4"
          >
            <h2
              className="text-white text-lg font-semibold"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Three universes match what you said.
            </h2>
            <InterestGalaxy galaxies={galaxies} />
            <button
              className="inline-flex items-center gap-1 text-white/60 hover:text-white/90 text-sm font-medium transition-colors"
              onClick={() => {}}
            >
              Explore your full constellation
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="space-y-3 pt-4"
          >
            <Button
              onClick={handleContinue}
              className="w-full py-6 text-lg font-bold rounded-full bg-rose-400 hover:bg-rose-500 text-white shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              See my opportunities
            </Button>
            <button
              onClick={handleRetake}
              className="w-full py-3 text-white/60 hover:text-white/90 text-sm font-medium transition-colors underline underline-offset-4"
            >
              Retake the survey
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
