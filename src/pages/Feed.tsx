import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  MapPin,
  SlidersHorizontal,
  Zap,
  Play,
  Sparkles,
  ArrowRight,
  Home,
  Bookmark,
  MessageSquare,
  Check,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { businessOwners, type BusinessOwner } from '@/data/businessOwners'
import { aiIdeasForKadeyn, type AIGeneratedIdea } from '@/data/aiIdeas'

// Unsplash images for business types
const businessImages: Record<string, string> = {
  'Auto Shop': 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&auto=format',
  'Bakery & Café': 'https://images.unsplash.com/photo-1517433670267-30f41c09c77a?w=800&auto=format',
  'Barbershop': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format',
  'Grocery Store': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format',
  'Landscaping': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&auto=format',
  'Beauty Salon': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format',
}

// Filter categories
const filterCategories = [
  'All', 'Design', 'Tech', 'Food', 'Retail', 'Services', 'Outdoor', 'Creative'
]

// Fake interested kids
const interestedKids = [
  { initials: 'KS', color: 'bg-primary' },
  { initials: 'JM', color: 'bg-accent' },
  { initials: 'AK', color: 'bg-success' },
]

// ============ COMPONENTS ============

// Location Modal
function LocationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Location settings</DialogTitle>
          <DialogDescription>Coming soon</DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          We'll let you change your location and search radius in a future update.
        </p>
        <Button onClick={onClose} className="w-full mt-4">Got it</Button>
      </DialogContent>
    </Dialog>
  )
}

// Filter Sheet
function FilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [distance, setDistance] = useState(5)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>Filter opportunities</SheetTitle>
          <SheetDescription>Find the perfect gig for you</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Categories */}
          <div>
            <label className="text-sm font-medium mb-3 block">Categories</label>
            <div className="flex flex-wrap gap-2">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Distance: {distance} miles
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Flexible time commitment</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Age-appropriate only</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
          </div>

          <Button onClick={onClose} className="w-full" size="lg">
            Apply filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Interest Modal
function InterestModal({
  open,
  onClose,
  business,
}: {
  open: boolean
  onClose: () => void
  business: BusinessOwner | null
}) {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false)
        onClose()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [sent, onClose])

  const handleSend = () => {
    setSent(true)
  }

  if (!business) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <p className="text-xl font-bold">Sent to Mom!</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Send to Mom for approval?</DialogTitle>
              </DialogHeader>

              {/* Business preview */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl mt-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={business.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                    {business.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{business.name}</p>
                  <p className="text-sm text-muted-foreground">{business.businessType}</p>
                  {business.opportunities[0] && (
                    <p className="text-sm text-success font-medium">
                      ${business.opportunities[0].pay} · {business.opportunities[0].title}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Because you're under 16, your parent will see this opportunity and decide if it's a good fit. You'll get a notification when they approve.
              </p>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Not yet
                </Button>
                <Button onClick={handleSend} className="flex-1">
                  Send for approval
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// Toast notification
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-foreground text-background rounded-full shadow-xl text-sm font-medium"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Top Bar
function TopBar({
  onLocationClick,
  onFilterClick,
}: {
  onLocationClick: () => void
  onFilterClick: () => void
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b lg:left-64">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Location */}
        <button
          onClick={onLocationClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
          aria-label="Change location"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span>Mobile, AL</span>
        </button>

        {/* Logo */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>

        {/* Filter */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>
    </header>
  )
}

// Trending Row
function TrendingRow() {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-4">
        Trending in Mobile, AL
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide">
        {businessOwners.map((business) => (
          <Link
            key={business.id}
            to={`/business/${business.id}`}
            className="flex-shrink-0 snap-start"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center w-20"
            >
              <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-md">
                <AvatarImage src={business.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                  {business.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium mt-2 text-center truncate w-full">
                {business.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-muted-foreground truncate w-full text-center">
                {business.businessType}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// AI Idea Card
function AIIdeaCard({ idea, onPlaybook }: { idea: AIGeneratedIdea; onPlaybook: () => void }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl p-6 relative overflow-hidden shadow-lg"
      style={{
        background: prefersReducedMotion
          ? 'linear-gradient(135deg, #4F46E5, #FB7185)'
          : undefined,
      }}
    >
      {/* Animated gradient background */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              'linear-gradient(135deg, #4F46E5, #7C3AED, #FB7185)',
              'linear-gradient(135deg, #7C3AED, #FB7185, #4F46E5)',
              'linear-gradient(135deg, #FB7185, #4F46E5, #7C3AED)',
              'linear-gradient(135deg, #4F46E5, #7C3AED, #FB7185)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* For You pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm w-fit mb-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </motion.div>
        <span className="text-xs font-semibold text-white uppercase tracking-wide">For You</span>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{idea.title}</h3>

      {/* Context */}
      <p className="text-white/80 text-sm mb-6">{idea.description.slice(0, 80)}...</p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Potential</p>
          <p className="text-success font-bold text-lg tabular-nums">{idea.estimatedEarnings}</p>
        </div>
        <button
          onClick={onPlaybook}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-600 font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          Get the playbook
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  )
}

// Business Owner Video Card
function BusinessVideoCard({
  business,
  onWatch,
  onInterested,
}: {
  business: BusinessOwner
  onWatch: () => void
  onInterested: () => void
}) {
  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl bg-card border shadow-sm overflow-hidden"
    >
      {/* Video thumbnail */}
      <div className="relative aspect-video">
        <img
          src={businessImages[business.businessType]}
          alt={`${business.businessName} preview`}
          className="w-full h-full object-cover"
        />
        {/* Play button */}
        <button
          onClick={onWatch}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Watch video from ${business.businessName}`}
        >
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-foreground ml-1" fill="currentColor" />
          </div>
        </button>
        {/* Trade badge */}
        <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground">
          {business.businessType}
        </Badge>
        {/* Distance pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium">
          <MapPin className="w-3 h-3" />
          {business.distance}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Avatar and info */}
        <div className="flex items-start gap-3 -mt-10 mb-3">
          <Avatar className="w-14 h-14 border-4 border-background shadow-md">
            <AvatarImage src={business.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
              {business.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="pt-8">
            <p className="font-semibold">{business.name}</p>
            <p className="text-sm text-muted-foreground">{business.businessName}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {business.description}
        </p>

        {/* Social proof */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-1.5">
            {interestedKids.map((kid, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${kid.color} border-2 border-background flex items-center justify-center text-[10px] text-white font-bold`}
              >
                {kid.initials[0]}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.floor(Math.random() * 5) + 3} kids interested
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onWatch} className="flex-1">
            Watch
          </Button>
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
            <Button variant="accent" onClick={onInterested} className="w-full">
              I'm interested
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}

// Mentorship Card
function MentorshipCard({ business }: { business: BusinessOwner }) {
  return (
    <Link to={`/business/${business.id}`}>
      <motion.article
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl bg-card border-l-4 border-l-primary border shadow-sm p-5"
      >
        {/* Label */}
        <Badge variant="outline" className="text-primary border-primary mb-3">
          MENTORSHIP
        </Badge>

        {/* Title */}
        <h3 className="text-lg font-bold mb-2">Shadow a day with {business.name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          See what a real day on the job looks like. Bring questions.
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={business.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-bold">
                {business.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{business.name}</p>
              <p className="text-xs text-muted-foreground">{business.businessType}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            Learn more
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.article>
    </Link>
  )
}

// Bottom Navigation (Mobile)
function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/app/feed', icon: Home, label: 'Feed' },
    { path: '/app/saved', icon: Bookmark, label: 'Saved' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages', notification: true },
    { path: '/app/path', icon: Sparkles, label: 'Path' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label, notification }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-label={label}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {notification && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Sidebar (Desktop)
function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/app/feed', icon: Home, label: 'Feed' },
    { path: '/app/saved', icon: Bookmark, label: 'Saved' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages', notification: true },
    { path: '/app/path', icon: Sparkles, label: 'Path' },
  ]

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r flex-col p-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">SparkLocal</span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, icon: Icon, label, notification }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {notification && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full" />
                )}
              </div>
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
        <Avatar>
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
            K
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">Kadeyn</p>
          <p className="text-xs text-muted-foreground">$185 earned</p>
        </div>
      </div>
    </aside>
  )
}

// Pull to refresh indicator
function PullToRefresh({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============ MAIN COMPONENT ============

export default function Feed() {
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [interestModalOpen, setInterestModalOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOwner | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Handle playbook click
  const handlePlaybook = () => {
    setToastMessage("Playbook coming soon — we'll save this for you")
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  // Handle interested click
  const handleInterested = (business: BusinessOwner) => {
    setSelectedBusiness(business)
    setInterestModalOpen(true)
  }

  // Generate feed items (interleaved pattern)
  const feedItems: Array<{ type: 'ai' | 'video' | 'mentorship'; data: AIGeneratedIdea | BusinessOwner }> = []
  const pattern = ['ai', 'video', 'ai', 'mentorship', 'video', 'ai', 'video', 'mentorship'] as const

  let aiIndex = 0
  let businessIndex = 0

  for (let i = 0; i < pattern.length; i++) {
    const type = pattern[i]
    if (type === 'ai') {
      feedItems.push({ type: 'ai', data: aiIdeasForKadeyn[aiIndex % aiIdeasForKadeyn.length] })
      aiIndex++
    } else if (type === 'video') {
      feedItems.push({ type: 'video', data: businessOwners[businessIndex % businessOwners.length] })
      businessIndex++
    } else {
      feedItems.push({ type: 'mentorship', data: businessOwners[(businessIndex + 2) % businessOwners.length] })
    }
  }

  // Pull to refresh (visual only)
  useEffect(() => {
    let startY = 0
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      if (currentY - startY > 100 && window.scrollY === 0) {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 1500)
      }
    }
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Top Bar */}
      <TopBar
        onLocationClick={() => setLocationModalOpen(true)}
        onFilterClick={() => setFilterSheetOpen(true)}
      />

      {/* Main content */}
      <main className="pt-16 pb-24 lg:pb-8 lg:pl-64">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Trending Row */}
          <TrendingRow />

          {/* Feed */}
          <div className="space-y-6 lg:space-y-8">
            {feedItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${index}`}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                {item.type === 'ai' && (
                  <AIIdeaCard
                    idea={item.data as AIGeneratedIdea}
                    onPlaybook={handlePlaybook}
                  />
                )}
                {item.type === 'video' && (
                  <BusinessVideoCard
                    business={item.data as BusinessOwner}
                    onWatch={() => window.location.href = `/business/${(item.data as BusinessOwner).id}`}
                    onInterested={() => handleInterested(item.data as BusinessOwner)}
                  />
                )}
                {item.type === 'mentorship' && (
                  <MentorshipCard business={item.data as BusinessOwner} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <BottomNav />

      {/* Modals */}
      <LocationModal open={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      <FilterSheet open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} />
      <InterestModal
        open={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        business={selectedBusiness}
      />

      {/* Toast */}
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Pull to refresh */}
      <PullToRefresh visible={refreshing} />
    </div>
  )
}
