// @deprecated — renamed/superseded by Explore in prompt 3. Kept on disk for
// one release cycle in case rollback is needed; no current import sites.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Palette, Wrench, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  galaxies,
  getCareersByGalaxy,
  getMentorsByCareer,
  getBusinessOwnerForMentor,
  type Galaxy,
  type Career,
  type Mentor,
} from '@/data/constellationData'
import { trackGalaxyClicked, trackCareerClicked, trackMentorClicked } from '@/lib/track'
import { cn } from '@/lib/utils'

type Stage = 'galaxies' | 'careers' | 'mentors'

const SESSION_KEY = 'sparklocal-constellation-visited'

// Floating dots background (replaces stars)
function FloatingDots() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    color: ['#4F46E5', '#FB7185', '#22C8A9'][Math.floor(Math.random() * 3)],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  )
}

// Galaxy icon component
function GalaxyIcon({ galaxy }: { galaxy: Galaxy }) {
  const iconProps = { className: 'w-8 h-8', style: { color: galaxy.color } }

  switch (galaxy.icon) {
    case 'Palette':
      return <Palette {...iconProps} />
    case 'Wrench':
      return <Wrench {...iconProps} />
    case 'Users':
      return <Users {...iconProps} />
    default:
      return <Star {...iconProps} />
  }
}

// Galaxy card component
function GalaxyCard({
  galaxy,
  onClick,
  index,
}: {
  galaxy: Galaxy
  onClick: () => void
  index: number
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-lg transition-all text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${galaxy.color}15` }}
        >
          <GalaxyIcon galaxy={galaxy} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{galaxy.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{galaxy.description}</p>
          <Badge variant="secondary" className="text-xs">
            {galaxy.careerCount} careers
          </Badge>
        </div>
      </div>
    </motion.button>
  )
}

// Career card component
function CareerCard({
  career,
  onClick,
  index,
}: {
  career: Career
  onClick: () => void
  index: number
}) {
  const galaxy = galaxies.find((g) => g.id === career.galaxyId)

  return (
    <motion.button
      onClick={onClick}
      className="w-full p-5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all text-left"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold">{career.title}</h3>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: galaxy?.color || '#4F46E5' }}
        >
          {career.matchScore}% match
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{career.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{career.avgSalary}</span>
        <span className="text-green-600">{career.growthRate}</span>
      </div>
    </motion.button>
  )
}

// Mentor card component
function MentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  const businessOwner = getBusinessOwnerForMentor(mentor.id)

  const handleClick = () => {
    trackMentorClicked(mentor.id)
  }

  return (
    <motion.div
      onClick={handleClick}
      className="p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 border-2 border-indigo-200">
          <AvatarImage src={businessOwner?.avatar} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">
            {businessOwner?.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{businessOwner?.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{mentor.specialty}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={mentor.availability === 'available' ? 'default' : 'secondary'}
              className={cn(
                'text-xs',
                mentor.availability === 'available' && 'bg-green-100 text-green-700'
              )}
            >
              {mentor.availability === 'available' ? 'Available' : 'Busy'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {mentor.rating}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-muted-foreground line-clamp-2">{mentor.bio}</p>
        <p className="text-xs text-indigo-600 mt-2">
          {mentor.studentsHelped} students helped
        </p>
      </div>
    </motion.div>
  )
}

// Center constellation SVG
function ConstellationCenter({ stage }: { stage: Stage }) {
  if (stage !== 'galaxies') return null

  return (
    <motion.div
      className="flex justify-center mb-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <svg width="200" height="160" viewBox="0 0 200 160">
        {/* Connection lines to galaxies */}
        {galaxies.map((galaxy, i) => {
          const angle = (i * 120 - 90) * (Math.PI / 180)
          const x = 100 + 60 * Math.cos(angle)
          const y = 80 + 50 * Math.sin(angle)
          return (
            <motion.line
              key={galaxy.id}
              x1="100"
              y1="80"
              x2={x}
              y2={y}
              stroke={galaxy.color}
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          )
        })}

        {/* Galaxy nodes */}
        {galaxies.map((galaxy, i) => {
          const angle = (i * 120 - 90) * (Math.PI / 180)
          const x = 100 + 60 * Math.cos(angle)
          const y = 80 + 50 * Math.sin(angle)
          return (
            <motion.circle
              key={galaxy.id}
              cx={x}
              cy={y}
              r="16"
              fill={galaxy.color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            />
          )
        })}

        {/* Center "You" node */}
        <motion.circle
          cx="100"
          cy="80"
          r="24"
          fill="white"
          stroke="#4F46E5"
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        />
        <motion.text
          x="100"
          y="84"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#4F46E5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Kadeyn
        </motion.text>
      </svg>
    </motion.div>
  )
}

// Main Constellation component
export default function Constellation() {
  const [stage, setStage] = useState<Stage>('galaxies')
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(null)
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  // Check if user has visited before (skip intro on repeat visits)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem(SESSION_KEY)
    if (hasVisited) {
      setShowIntro(false)
    } else {
      sessionStorage.setItem(SESSION_KEY, 'true')
      // Shortened intro animation (1.0s)
      const timer = setTimeout(() => setShowIntro(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleGalaxyClick = (galaxy: Galaxy) => {
    trackGalaxyClicked(galaxy.id)
    setSelectedGalaxy(galaxy)
    setStage('careers')
  }

  const handleCareerClick = (career: Career) => {
    trackCareerClicked(career.id)
    setSelectedCareer(career)
    setStage('mentors')
  }

  const handleBack = () => {
    if (stage === 'mentors') {
      setSelectedCareer(null)
      setStage('careers')
    } else if (stage === 'careers') {
      setSelectedGalaxy(null)
      setStage('galaxies')
    }
  }

  const currentCareers = selectedGalaxy ? getCareersByGalaxy(selectedGalaxy.id) : []
  const currentMentors = selectedCareer ? getMentorsByCareer(selectedCareer.id) : []

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-2xl relative"
      style={{
        background: `
          linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(251, 113, 133, 0.08) 100%),
          #FAFAF9
        `,
      }}
    >
      <FloatingDots />

      {/* Intro animation overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              >
                <Star className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-lg font-medium text-slate-600">Exploring your constellation...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        {/* Back button (only for career/mentor views) */}
        <AnimatePresence>
          {stage !== 'galaxies' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage: Galaxies */}
        <AnimatePresence mode="wait">
          {stage === 'galaxies' && (
            <motion.div
              key="galaxies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2" style={{ fontStyle: 'italic' }}>
                  Your Career Constellation
                </h2>
                <p className="text-sm text-muted-foreground">
                  Explore galaxies of careers that match your interests
                </p>
              </div>

              <ConstellationCenter stage={stage} />

              <div className="space-y-3">
                {galaxies.map((galaxy, i) => (
                  <GalaxyCard
                    key={galaxy.id}
                    galaxy={galaxy}
                    onClick={() => handleGalaxyClick(galaxy)}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Stage: Careers */}
          {stage === 'careers' && selectedGalaxy && (
            <motion.div
              key="careers"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedGalaxy.color}15` }}
                >
                  <GalaxyIcon galaxy={selectedGalaxy} />
                </div>
                <h2 className="text-xl font-bold">{selectedGalaxy.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedGalaxy.description}</p>
              </div>

              <div className="space-y-3">
                {currentCareers.map((career, i) => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    onClick={() => handleCareerClick(career)}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Stage: Mentors */}
          {stage === 'mentors' && selectedCareer && (
            <motion.div
              key="mentors"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{selectedCareer.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedCareer.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/80 border border-slate-200">
                    <p className="text-xs text-muted-foreground">Average Salary</p>
                    <p className="font-semibold">{selectedCareer.avgSalary}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 border border-slate-200">
                    <p className="text-xs text-muted-foreground">Growth Rate</p>
                    <p className="font-semibold text-green-600">{selectedCareer.growthRate}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedCareer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Local Mentors in This Field
                </h3>
                <div className="space-y-3">
                  {currentMentors.map((mentor, i) => (
                    <MentorCard key={mentor.id} mentor={mentor} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
