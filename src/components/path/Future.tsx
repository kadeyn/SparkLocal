// @deprecated — collapsed into MyPath in prompt 3 (planning function moved
// into both MyPath and Explore). Kept on disk for one release cycle in case
// rollback is needed; no current import sites.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Briefcase, Award, ChevronRight, MapPin, Star, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  futurePaths,
  getMentorNetworkBusinessOwners,
  type FuturePath,
  type Milestone,
} from '@/data/futurePathsData'
import { trackFuturePathSelected, trackMilestoneClicked } from '@/lib/track'
import { cn } from '@/lib/utils'

// Path icon component
function PathIcon({ path, size = 'md' }: { path: FuturePath; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const iconProps = { className: sizeClasses[size], style: { color: path.color } }

  switch (path.icon) {
    case 'Video':
      return <Video {...iconProps} />
    case 'Briefcase':
      return <Briefcase {...iconProps} />
    case 'Award':
      return <Award {...iconProps} />
    default:
      return <Star {...iconProps} />
  }
}

// Path selector tab
function PathTab({
  path,
  isSelected,
  onClick,
}: {
  path: FuturePath
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex-1 p-4 rounded-xl border-2 transition-all text-left',
        isSelected
          ? 'bg-white shadow-md'
          : 'bg-white/50 border-transparent hover:bg-white/80'
      )}
      style={{
        borderColor: isSelected ? path.color : 'transparent',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${path.color}15` }}
        >
          <PathIcon path={path} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{path.title}</p>
          <p className="text-xs text-muted-foreground truncate">{path.subtitle}</p>
        </div>
      </div>
    </motion.button>
  )
}

// Timeline milestone component
function TimelineMilestone({
  milestone,
  path,
  index,
  isExpanded,
  onToggle,
}: {
  milestone: Milestone
  path: FuturePath
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const isFirst = index === 0
  const isLast = index === path.milestones.length - 1

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-5 top-12 w-0.5 h-full -translate-x-1/2"
          style={{ backgroundColor: `${path.color}30` }}
        />
      )}

      {/* Milestone content */}
      <div className="flex gap-4">
        {/* Age marker */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2',
              isFirst ? 'text-white' : 'bg-white'
            )}
            style={{
              backgroundColor: isFirst ? path.color : 'white',
              borderColor: path.color,
              color: isFirst ? 'white' : path.color,
            }}
          >
            {milestone.age}
          </div>
        </div>

        {/* Content card */}
        <motion.button
          onClick={onToggle}
          className={cn(
            'flex-1 text-left p-4 rounded-xl border transition-all mb-4',
            isExpanded
              ? 'bg-white shadow-md border-slate-200'
              : 'bg-white/70 border-slate-100 hover:bg-white hover:shadow-sm'
          )}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">{milestone.title}</h4>
              {milestone.potentialEarnings && (
                <p className="text-sm text-green-600 font-medium">{milestone.potentialEarnings}</p>
              )}
            </div>
            <ChevronRight
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {milestone.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}

// Mentor network visualization
function MentorNetwork() {
  const mentors = getMentorNetworkBusinessOwners()

  return (
    <motion.div
      className="mt-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold">Your Local Mentor Network</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Real people in your community ready to guide your journey
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mentors.map((mentor, i) => (
          <motion.div
            key={mentor.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.05 }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={mentor.avatar} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                {mentor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{mentor.name.split(' ')[0]}</p>
              <p className="text-[10px] text-muted-foreground truncate">{mentor.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connection visualization */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>All mentors within 2 miles of you</span>
        </div>
      </div>
    </motion.div>
  )
}

// Main Future component
export default function Future() {
  const [selectedPath, setSelectedPath] = useState<FuturePath>(futurePaths[0])
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)

  const handlePathSelect = (path: FuturePath) => {
    trackFuturePathSelected(path.id)
    setSelectedPath(path)
    setExpandedMilestone(null)
  }

  const handleMilestoneToggle = (milestoneId: string) => {
    trackMilestoneClicked(milestoneId)
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId)
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-2xl"
      style={{
        // Cream gradient toned down 40%
        background: `linear-gradient(to bottom,
          rgba(255, 252, 248, 0.6) 0%,
          rgba(255, 243, 230, 0.6) 100%
        ), #FAFAF9`,
      }}
    >
      <div className="flex-1 overflow-auto p-6">
        {/* Path selector tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {futurePaths.map((path) => (
            <PathTab
              key={path.id}
              path={path}
              isSelected={selectedPath.id === path.id}
              onClick={() => handlePathSelect(path)}
            />
          ))}
        </div>

        {/* Selected path description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedPath.color}15` }}
              >
                <PathIcon path={selectedPath} size="lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedPath.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedPath.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{selectedPath.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Timeline */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Your Timeline
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedPath.milestones.map((milestone, i) => (
                <TimelineMilestone
                  key={milestone.id}
                  milestone={milestone}
                  path={selectedPath}
                  index={i}
                  isExpanded={expandedMilestone === milestone.id}
                  onToggle={() => handleMilestoneToggle(milestone.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mentor network */}
        <MentorNetwork />
      </div>
    </div>
  )
}
