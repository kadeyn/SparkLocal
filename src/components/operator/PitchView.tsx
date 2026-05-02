import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Users,
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  MessageSquare,
  Target,
  Lightbulb,
  HandshakeIcon,
  PenLine,
} from 'lucide-react'
import { track } from '@/lib/track'
import { callAI } from '@/lib/ai'
import { DEMO_PITCH_RESPONSE } from '@/data/operatorMockData'
import { cn } from '@/lib/utils'

type AudienceType = 'owner' | 'parent' | 'kid'

interface PitchContext {
  audience: AudienceType
  name: string
  businessName?: string
  industry?: string
  location?: string
  additionalContext?: string
}

interface PitchResponse {
  audience: string
  opening: string
  problem: string
  solution: string
  proof: string
  ask: string
  signoff: string
}

const AUDIENCE_OPTIONS: { id: AudienceType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'owner',
    label: 'Business Owner',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Local business looking for young help',
  },
  {
    id: 'parent',
    label: 'Parent',
    icon: <Users className="w-5 h-5" />,
    description: 'Parent of a teen interested in earning',
  },
  {
    id: 'kid',
    label: 'Student',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Teen looking for opportunities',
  },
]

const SECTION_CONFIG = [
  { key: 'opening', label: 'Opening', icon: <MessageSquare className="w-4 h-4" /> },
  { key: 'problem', label: 'Problem', icon: <Target className="w-4 h-4" /> },
  { key: 'solution', label: 'Solution', icon: <Lightbulb className="w-4 h-4" /> },
  { key: 'proof', label: 'Social Proof', icon: <HandshakeIcon className="w-4 h-4" /> },
  { key: 'ask', label: 'The Ask', icon: <PenLine className="w-4 h-4" /> },
  { key: 'signoff', label: 'Sign-off', icon: <Check className="w-4 h-4" /> },
]

export default function PitchView() {
  const [context, setContext] = useState<PitchContext>({
    audience: 'owner',
    name: '',
    businessName: '',
    industry: '',
    location: '',
    additionalContext: '',
  })
  const [pitch, setPitch] = useState<PitchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generatePitch = async () => {
    if (!context.name.trim() || loading) return

    setLoading(true)
    track('operator_pitch_generated', { audience: context.audience })

    const mockResponse: PitchResponse = {
      ...DEMO_PITCH_RESPONSE,
      audience: context.audience,
      opening: DEMO_PITCH_RESPONSE.opening.replace('Marcus', context.name).replace('Thompson Auto Repair', context.businessName || 'your business'),
    }

    try {
      const result = await callAI({
        system: `You are a pitch writer for SparkLocal, a marketplace connecting local businesses with young workers ages 14-18. Generate a personalized outreach pitch.

Audience type: ${context.audience}
${context.audience === 'owner' ? `
- Focus on finding reliable young help
- Emphasize safety, vetting, and parental approval
- Mention specific use cases (social media, organizing, customer service)
` : context.audience === 'parent' ? `
- Focus on safe earning opportunities for their teen
- Emphasize background checks, real-time location, in-app messaging
- Mention skill development and resume building
` : `
- Focus on earning money and building skills
- Emphasize the types of gigs available
- Mention the progression system and badges
`}

Respond in JSON:
{
  "audience": "${context.audience}",
  "opening": "Personalized opening referencing their name and context",
  "problem": "The pain point this audience faces",
  "solution": "How SparkLocal solves it",
  "proof": "Social proof with specific examples",
  "ask": "Clear call to action",
  "signoff": "Professional sign-off"
}`,
        prompt: `Generate a pitch for:
Name: ${context.name}
${context.businessName ? `Business: ${context.businessName}` : ''}
${context.industry ? `Industry: ${context.industry}` : ''}
${context.location ? `Location: ${context.location}` : ''}
${context.additionalContext ? `Additional context: ${context.additionalContext}` : ''}`,
        json: true,
        mockResponse: mockResponse,
      })

      setPitch(result as PitchResponse)
    } catch (error) {
      console.error('Pitch generation error:', error)
      setPitch(mockResponse)
    } finally {
      setLoading(false)
    }
  }

  const copySection = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(key)
    track('operator_pitch_copied', { section: key })
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const copyFullPitch = async () => {
    if (!pitch) return

    const fullText = `${pitch.opening}

${pitch.problem}

${pitch.solution}

${pitch.proof}

${pitch.ask}

${pitch.signoff}`

    await navigator.clipboard.writeText(fullText)
    setCopiedAll(true)
    track('operator_pitch_copied', { section: 'full' })
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pitch Generator</h1>
          <p className="text-sm text-slate-500">Create personalized outreach for any audience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-medium text-slate-900 mb-4">Configure Pitch</h2>

          {/* Audience Selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setContext((prev) => ({ ...prev, audience: option.id }))}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    context.audience === option.id
                      ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center mb-2',
                      context.audience === option.id ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {option.icon}
                  </div>
                  <p className="text-sm font-medium text-slate-900">{option.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {context.audience === 'owner' ? 'Owner Name' : context.audience === 'parent' ? 'Parent Name' : 'Student Name'} *
            </label>
            <input
              type="text"
              value={context.name}
              onChange={(e) => setContext((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Marcus"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Conditional Fields */}
          {context.audience === 'owner' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={context.businessName}
                  onChange={(e) => setContext((prev) => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g., Thompson Auto Repair"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                <input
                  type="text"
                  value={context.industry}
                  onChange={(e) => setContext((prev) => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Auto repair, Restaurant, Retail"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input
              type="text"
              value={context.location}
              onChange={(e) => setContext((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Mobile, AL"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Context</label>
            <textarea
              value={context.additionalContext}
              onChange={(e) => setContext((prev) => ({ ...prev, additionalContext: e.target.value }))}
              placeholder="Any specific details to personalize the pitch..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePitch}
            disabled={loading || !context.name.trim()}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Pitch
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-slate-900">Generated Pitch</h2>
            {pitch && (
              <button
                onClick={copyFullPitch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-24 mb-2" />
                    <div className="h-16 bg-slate-50 rounded" />
                  </div>
                ))}
              </motion.div>
            ) : pitch ? (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {SECTION_CONFIG.map(({ key, label, icon }) => {
                  const text = pitch[key as keyof PitchResponse]
                  if (!text) return null

                  return (
                    <div key={key} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                          {icon}
                          {label}
                        </div>
                        <button
                          onClick={() => copySection(key, text)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-violet-600 transition-all"
                        >
                          {copiedSection === key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">
                        {text}
                      </p>
                    </div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-1">No pitch generated yet</p>
                <p className="text-sm text-slate-400">
                  Fill in the context and click Generate
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
