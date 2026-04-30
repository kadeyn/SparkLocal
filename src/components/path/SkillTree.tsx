import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { skillTreeNodes, type SkillNode } from '@/data/skillTreeData'
import { trackSkillNodeClicked } from '@/lib/track'
import { cn } from '@/lib/utils'

// Coral color utility class (since Tailwind might not have it)
const coralStyles = {
  bg: { backgroundColor: '#FB7185' },
  border: { borderColor: '#FB7185' },
  glow: { boxShadow: '0 0 20px rgba(251, 113, 133, 0.5)' },
}

// Node positions for layout (x, y as percentages)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // Tier 0
  start: { x: 50, y: 90 },
  // Tier 1
  'first-connection': { x: 25, y: 72 },
  'first-hustle': { x: 50, y: 72 },
  'first-pitch': { x: 75, y: 72 },
  // Tier 2
  'repeat-client': { x: 20, y: 52 },
  'skill-stacker': { x: 40, y: 52 },
  'public-presence': { x: 60, y: 52 },
  'feedback-loop': { x: 80, y: 52 },
  // Tier 3
  'mini-portfolio': { x: 30, y: 32 },
  'mentor-moment': { x: 50, y: 32 },
  'hundred-club': { x: 70, y: 32 },
  // Tier 4
  'local-legend': { x: 35, y: 12 },
  'spark-master': { x: 65, y: 12 },
}

// Connection lines between nodes
const CONNECTIONS: Array<{ from: string; to: string }> = [
  // Tier 0 → Tier 1
  { from: 'start', to: 'first-connection' },
  { from: 'start', to: 'first-hustle' },
  { from: 'start', to: 'first-pitch' },
  // Tier 1 → Tier 2
  { from: 'first-hustle', to: 'repeat-client' },
  { from: 'first-connection', to: 'repeat-client' },
  { from: 'first-hustle', to: 'skill-stacker' },
  { from: 'first-pitch', to: 'public-presence' },
  { from: 'first-connection', to: 'feedback-loop' },
  { from: 'first-pitch', to: 'feedback-loop' },
  // Tier 2 → Tier 3
  { from: 'repeat-client', to: 'mini-portfolio' },
  { from: 'skill-stacker', to: 'mini-portfolio' },
  { from: 'feedback-loop', to: 'mentor-moment' },
  { from: 'public-presence', to: 'mentor-moment' },
  { from: 'repeat-client', to: 'hundred-club' },
  // Tier 3 → Tier 4
  { from: 'mini-portfolio', to: 'local-legend' },
  { from: 'hundred-club', to: 'local-legend' },
  { from: 'local-legend', to: 'spark-master' },
  { from: 'mentor-moment', to: 'spark-master' },
]

// Skill Node Component
function SkillNodeComponent({
  node,
  position,
  onClick,
}: {
  node: SkillNode
  position: { x: number; y: number }
  onClick: () => void
}) {
  const isEarned = node.status === 'earned'
  const isUnlocked = node.status === 'unlocked'
  const isLocked = node.status === 'locked'

  const nodeSize = node.tier === 0 ? 'w-16 h-16' : node.tier === 4 ? 'w-14 h-14' : 'w-12 h-12'

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border-2 transition-all duration-300',
        nodeSize,
        isEarned && 'bg-indigo-600 border-indigo-500 text-white shadow-lg',
        isUnlocked && 'border-2 text-white shadow-lg cursor-pointer hover:scale-110',
        isLocked && 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed opacity-60'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ...(isUnlocked ? { ...coralStyles.bg, ...coralStyles.border, ...coralStyles.glow } : {}),
        ...(isEarned ? { boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)' } : {}),
      }}
      whileHover={!isLocked ? { scale: 1.15 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: node.tier * 0.1, type: 'spring', stiffness: 300 }}
    >
      {isEarned && <CheckCircle2 className="w-5 h-5" />}
      {isUnlocked && <Sparkles className="w-5 h-5" />}
      {isLocked && <Lock className="w-4 h-4" />}

      {/* Pulse animation for unlocked nodes */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#FB7185' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}

// Node label component
function NodeLabel({ node, position }: { node: SkillNode; position: { x: number; y: number } }) {
  const labelOffset = node.tier === 0 ? 45 : 35

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 text-center pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `calc(${position.y}% + ${labelOffset}px)`,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: node.tier * 0.1 + 0.2 }}
    >
      <span
        className={cn(
          'text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full',
          node.status === 'earned' && 'text-indigo-700 bg-indigo-100',
          node.status === 'unlocked' && 'text-rose-700 bg-rose-100',
          node.status === 'locked' && 'text-slate-500 bg-slate-100'
        )}
      >
        {node.label}
      </span>
    </motion.div>
  )
}

// Connection line component
function ConnectionLine({
  from,
  to,
  isActive,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  isActive: boolean
}) {
  return (
    <motion.line
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke={isActive ? '#4F46E5' : '#CBD5E1'}
      strokeWidth={isActive ? 3 : 2}
      strokeLinecap="round"
      strokeDasharray={isActive ? '0' : '6 4'}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
  )
}

// Legend component
function Legend() {
  const items = [
    { status: 'earned', label: 'Earned', color: 'bg-indigo-600' },
    { status: 'unlocked', label: 'Ready', color: '', style: coralStyles.bg },
    { status: 'locked', label: 'Locked', color: 'bg-slate-300' },
  ]

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {items.map((item) => (
        <div key={item.status} className="flex items-center gap-2">
          <div
            className={cn('w-4 h-4 rounded-full', item.color)}
            style={item.style}
          />
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// Node detail modal
function NodeModal({
  node,
  open,
  onClose,
}: {
  node: SkillNode | null
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()

  if (!node) return null

  const handleStartChallenge = () => {
    onClose()
    navigate('/app/feed')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-indigo-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                node.status === 'earned' && 'bg-indigo-600 text-white',
                node.status === 'locked' && 'bg-slate-200 text-slate-500'
              )}
              style={node.status === 'unlocked' ? coralStyles.bg : {}}
            >
              {node.status === 'earned' && <CheckCircle2 className="w-6 h-6 text-white" />}
              {node.status === 'unlocked' && <Sparkles className="w-6 h-6 text-white" />}
              {node.status === 'locked' && <Lock className="w-6 h-6" />}
            </div>
            <div>
              <DialogTitle className="text-lg">{node.label}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {node.xp} XP · Tier {node.tier}
              </p>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-foreground">
          {node.description}
        </DialogDescription>

        {node.challenge && (
          <div className="space-y-4 pt-2">
            <div>
              <h4 className="font-semibold text-sm mb-2">{node.challenge.title}</h4>
              <p className="text-sm text-muted-foreground">{node.challenge.description}</p>
            </div>

            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Steps
              </h5>
              <ol className="space-y-2">
                {node.challenge.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-xs text-muted-foreground">
              Estimated time: {node.challenge.estimatedTime}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {node.status === 'unlocked' && (
            <Button onClick={handleStartChallenge} className="flex-1" style={coralStyles.bg}>
              Start this challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {node.status === 'earned' && (
            <div className="flex-1 text-center py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
              Challenge completed!
            </div>
          )}
          {node.status === 'locked' && (
            <div className="flex-1 text-center py-2 px-4 bg-slate-100 text-slate-500 rounded-lg text-sm">
              Complete prerequisite challenges to unlock
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main SkillTree component
export default function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)

  const handleNodeClick = (node: SkillNode) => {
    trackSkillNodeClicked(node.id, node.status)
    setSelectedNode(node)
  }

  // Determine which connections are "active" (both ends earned)
  const activeConnections = useMemo(() => {
    return CONNECTIONS.map((conn) => {
      const fromNode = skillTreeNodes.find((n) => n.id === conn.from)
      const toNode = skillTreeNodes.find((n) => n.id === conn.to)
      const isActive =
        fromNode?.status === 'earned' &&
        (toNode?.status === 'earned' || toNode?.status === 'unlocked')
      return { ...conn, isActive }
    })
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tree canvas */}
      <div
        className="flex-1 relative overflow-hidden rounded-2xl"
        style={{
          background: `
            linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(251, 113, 133, 0.05) 100%),
            #FAFAF9
          `,
          backgroundImage: `
            radial-gradient(circle, rgba(79, 70, 229, 0.1) 1px, transparent 1px),
            linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(251, 113, 133, 0.05) 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
        }}
      >
        {/* SVG for connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeConnections.map((conn, i) => {
            const fromPos = NODE_POSITIONS[conn.from]
            const toPos = NODE_POSITIONS[conn.to]
            if (!fromPos || !toPos) return null
            return (
              <ConnectionLine
                key={i}
                from={fromPos}
                to={toPos}
                isActive={conn.isActive}
              />
            )
          })}
        </svg>

        {/* Tier labels */}
        <div className="absolute left-4 top-4 space-y-1">
          {[4, 3, 2, 1, 0].map((tier) => (
            <div
              key={tier}
              className="text-xs text-muted-foreground/50 font-medium"
              style={{
                position: 'absolute',
                top: tier === 4 ? '8%' : tier === 3 ? '28%' : tier === 2 ? '48%' : tier === 1 ? '68%' : '86%',
              }}
            >
              {tier === 0 ? 'Start' : tier === 4 ? 'Master' : `Tier ${tier}`}
            </div>
          ))}
        </div>

        {/* Nodes */}
        {skillTreeNodes.map((node) => {
          const position = NODE_POSITIONS[node.id]
          if (!position) return null
          return (
            <SkillNodeComponent
              key={node.id}
              node={node}
              position={position}
              onClick={() => handleNodeClick(node)}
            />
          )
        })}

        {/* Node labels */}
        {skillTreeNodes.map((node) => {
          const position = NODE_POSITIONS[node.id]
          if (!position) return null
          return <NodeLabel key={`label-${node.id}`} node={node} position={position} />
        })}
      </div>

      {/* Legend */}
      <Legend />

      {/* Node detail modal */}
      <NodeModal
        node={selectedNode}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}
