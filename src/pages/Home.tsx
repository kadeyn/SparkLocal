import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Briefcase,
  Shield,
  Zap,
  MapPin,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo } from '@/components/brand'
import { businessOwners } from '@/data'

// Unsplash images for each business type
const businessImages: Record<string, string> = {
  'Auto Shop': 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=250&fit=crop',
  'Bakery & Café': 'https://images.unsplash.com/photo-1517433670267-30f41c09c77a?w=400&h=250&fit=crop',
  'Barbershop': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=250&fit=crop',
  'Grocery Store': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=250&fit=crop',
  'Landscaping': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=250&fit=crop',
  'Beauty Salon': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=250&fit=crop',
}

// Fake interested kids data
const interestedKids = [
  { initials: 'KS', color: 'bg-primary' },
  { initials: 'JM', color: 'bg-accent' },
  { initials: 'AK', color: 'bg-success' },
  { initials: 'TR', color: 'bg-purple-500' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#opportunities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Opportunities
            </a>
            <Link to="/signup/business" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              For Businesses
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Link to="/signup/parent">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Trusted Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trusted in 200+ neighborhoods</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Where young
                <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent"> entrepreneurs </span>
                meet local
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"> opportunity</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
                SparkLocal connects students ages 11–18 with real gigs from local businesses.
                Build skills, earn money, and launch your future — all with parent-approved safety.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/signup/parent" className="flex-1 sm:flex-initial">
                  <Button size="xl" className="w-full sm:w-auto">
                    I'm a Parent
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link to="/onboarding/kid" className="flex-1 sm:flex-initial">
                  <Button size="xl" variant="accent" className="w-full sm:w-auto">
                    I'm a Student (11–18)
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link to="/signup/business" className="flex-1 sm:flex-initial">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    I'm a Local Business
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['bg-indigo-400', 'bg-pink-400', 'bg-emerald-400', 'bg-amber-400'].map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {['KS', 'JM', 'AT', 'RL'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">1,200+ students</span> have earned over{' '}
                  <span className="font-semibold text-success">$45,000</span> this month
                </p>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto w-[320px]">
                {/* Phone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />
                  <div className="bg-background rounded-[2.5rem] overflow-hidden">
                    {/* App Screen Content */}
                    <div className="h-[640px] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-background px-6 py-3 flex items-center justify-between text-xs">
                        <span className="font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 bg-foreground/80 rounded-sm" />
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="px-5 py-4 border-b">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold">SparkLocal</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Good morning, Kadeyn!</p>
                        <p className="text-2xl font-bold">Find your next gig</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-5 py-4 flex gap-3">
                        <div className="flex-1 bg-success/10 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Earned</p>
                          <p className="text-lg font-bold text-success">$185</p>
                        </div>
                        <div className="flex-1 bg-primary/10 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Jobs Done</p>
                          <p className="text-lg font-bold text-primary">7</p>
                        </div>
                      </div>

                      {/* Opportunity Cards */}
                      <div className="px-5 py-2">
                        <p className="text-sm font-semibold mb-3">Nearby opportunities</p>
                        {[
                          { title: 'Logo Design', biz: 'Bean & Brew', pay: '$60', urgent: true },
                          { title: 'Social Media', biz: 'FreshCuts', pay: '$45', urgent: false },
                        ].map((opp, i) => (
                          <div key={i} className="bg-card border rounded-2xl p-4 mb-3 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-sm">{opp.title}</p>
                                <p className="text-xs text-muted-foreground">{opp.biz}</p>
                              </div>
                              <span className="text-sm font-bold text-success">{opp.pay}</span>
                            </div>
                            {opp.urgent && (
                              <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
                                Urgent
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -left-16 top-32 bg-card border rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Just earned</p>
                      <p className="font-bold text-success">+$45.00</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -right-12 bottom-40 bg-card border rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Parent approved</p>
                      <p className="font-semibold text-sm">100% Safe</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple for everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a parent, student, or business owner, SparkLocal makes it easy to get started.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Parent Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 h-full relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">1</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <Badge className="mb-4">Parents</Badge>
                  <h3 className="text-xl font-bold mb-3">Create a family account</h3>
                  <p className="text-muted-foreground">
                    Sign up in 2 minutes, add your child's profile, and set safety preferences.
                    You'll approve every opportunity before they can apply.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Student Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 h-full relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">2</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-accent" />
                  </div>
                  <Badge variant="accent" className="mb-4">Students</Badge>
                  <h3 className="text-xl font-bold mb-3">Browse & apply to gigs</h3>
                  <p className="text-muted-foreground">
                    Explore local opportunities matched to your skills. Apply with one tap,
                    chat with business owners, and start earning.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Business Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8 h-full relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">3</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-7 h-7 text-success" />
                  </div>
                  <Badge variant="success" className="mb-4">Businesses</Badge>
                  <h3 className="text-xl font-bold mb-3">Post opportunities</h3>
                  <p className="text-muted-foreground">
                    Create gigs in minutes, review applicants, and hire motivated young talent.
                    Make a difference in your community while getting work done.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Opportunities Section */}
      <section id="opportunities" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <MapPin className="w-3 h-3 mr-1" />
              Near you
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Local opportunities near you
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real businesses in your neighborhood are looking for young talent right now.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessOwners.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/business/${business.id}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Cover Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={businessImages[business.businessType]}
                        alt={business.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Distance Pill */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {business.distance}
                      </div>
                      {/* Trade Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          {business.businessType}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 pt-0">
                      {/* Avatar */}
                      <div className="relative -mt-6 mb-3">
                        <Avatar className="w-12 h-12 border-4 border-background shadow-md">
                          <AvatarImage src={business.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                            {business.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Business Info */}
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {business.businessName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {business.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        {/* Interested Kids */}
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {interestedKids.slice(0, 3).map((kid, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full ${kid.color} border-2 border-background flex items-center justify-center text-[10px] text-white font-bold`}
                              >
                                {kid.initials[0]}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 5) + 3} interested
                          </span>
                        </div>

                        {/* Pay Badge */}
                        {business.opportunities[0] && (
                          <Badge variant="success" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-0.5" />
                            {business.opportunities[0].payType === 'fixed'
                              ? `$${business.opportunities[0].pay}`
                              : `$${business.opportunities[0].pay}/hr`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/app/feed">
              <Button size="lg" variant="outline">
                View all opportunities
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to spark something amazing?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of families, students, and businesses building the future of youth entrepreneurship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup/parent">
                <Button size="xl" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Get started free
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/signup/business">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Partner with us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 SparkLocal. Opportunity Engine for young entrepreneurs.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Safety</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
