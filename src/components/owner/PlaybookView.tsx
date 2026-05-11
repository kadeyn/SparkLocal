import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Tag,
} from 'lucide-react'
import { track } from '@/lib/track'
import { callAI, type AIError } from '@/lib/ai'
import { cn } from '@/lib/utils'
import {
  DEMO_OWNER_PLAYBOOK_RESPONSES,
  OWNER_KNOWLEDGE_BASE,
  getOwnerKnowledgeCategories,
  searchOwnerKnowledge,
  type OwnerKnowledgeEntry,
} from '@/data/ownerKnowledgeBase'

interface PlaybookAnswer {
  answer: string
  sources: string[]
}

const STARTER_EXAMPLES = [
  'How do I delegate a service call to a 16-year-old apprentice?',
  'What is the right hourly rate for a first-time kid hire?',
  'How do I handle a kid who is not showing up?',
  'When should I hire my apprentice full-time?',
  'Can I claim the Work Opportunity Tax Credit for a teen?',
]

function pickMockResponse(question: string): PlaybookAnswer {
  const q = question.toLowerCase()
  if (q.includes('delegate') || q.includes('hand off') || q.includes('watch')) return DEMO_OWNER_PLAYBOOK_RESPONSES.delegate
  if (q.includes('rate') || q.includes('pay') || q.includes('wage')) return DEMO_OWNER_PLAYBOOK_RESPONSES.rate
  if (q.includes('show') || q.includes('no-show') || q.includes('attendance')) return DEMO_OWNER_PLAYBOOK_RESPONSES.noshow
  if (q.includes('full-time') || q.includes('full time') || q.includes('promote')) return DEMO_OWNER_PLAYBOOK_RESPONSES.fulltime
  if (q.includes('tax') || q.includes('wotc') || q.includes('credit') || q.includes('deduct')) return DEMO_OWNER_PLAYBOOK_RESPONSES.tax
  return DEMO_OWNER_PLAYBOOK_RESPONSES.default
}

export default function PlaybookView() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<PlaybookAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AIError | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const categories = useMemo(() => getOwnerKnowledgeCategories(), [])

  const filteredEntries = useMemo(() => {
    let entries = OWNER_KNOWLEDGE_BASE
    if (selectedCategory) entries = entries.filter((e) => e.category === selectedCategory)
    if (searchQuery.trim()) {
      const found = searchOwnerKnowledge(searchQuery)
      entries = selectedCategory ? found.filter((e) => e.category === selectedCategory) : found
    }
    return entries
  }, [searchQuery, selectedCategory])

  const askPlaybook = async (q: string) => {
    const finalQuestion = (q ?? question).trim()
    if (!finalQuestion || loading) return

    setQuestion(finalQuestion)
    setLoading(true)
    setError(null)

    const kbContext = OWNER_KNOWLEDGE_BASE.map((e) => `[${e.id}] ${e.title}: ${e.content}`).join('\n\n')
    const mockResponse = pickMockResponse(finalQuestion)

    try {
      const result = await callAI({
        system: `You are an advisor to small-business owners using SparkLocal to hire teen apprentices. Answer questions using ONLY the knowledge base provided. Be direct, blunt, and quantify when possible. Always cite source IDs inline like [okb-7].

Knowledge Base:
${kbContext}

Respond in JSON:
{
  "answer": "Detailed answer with citations like [okb-1].",
  "sources": ["okb-1", "okb-7"]
}`,
        prompt: finalQuestion,
        json: true,
        maxTokens: 1200,
        mockResponse,
      })

      const parsed = result as PlaybookAnswer
      setResponse(parsed)
      track('owner_playbook_query', { query: finalQuestion, sourcesReturned: parsed.sources.length })
    } catch (err) {
      console.error('Playbook AI error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('owner_ai_error', { module: 'playbook', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getEntryById = (id: string): OwnerKnowledgeEntry | undefined => {
    return OWNER_KNOWLEDGE_BASE.find((e) => e.id === id)
  }

  const focusEntry = (id: string) => {
    setExpandedIds(new Set([id]))
    setSelectedCategory(null)
    setSearchQuery('')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Owner Playbook</h1>
          <p className="text-sm text-slate-500">AI-grounded answers from {OWNER_KNOWLEDGE_BASE.length} mentor-tested entries</p>
        </div>
      </div>

      {/* Ask the Playbook — glowing search hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f3a2e 0%, #1a4d6b 50%, #0c2a4d 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 10%, rgba(34,200,169,0.5) 0%, transparent 50%),
                               radial-gradient(circle at 90% 80%, rgba(123,97,255,0.4) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Ask the Playbook</h2>
              <p className="text-xs text-emerald-200/70">Grounded in {OWNER_KNOWLEDGE_BASE.length} entries · always cites sources</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askPlaybook(question)}
              placeholder="e.g., What hourly rate should I pay a 16-year-old?"
              className="flex-1 px-4 py-3 bg-slate-900/60 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={() => askPlaybook(question)}
              disabled={loading || !question.trim()}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* Starter examples */}
          {!response && !loading && (
            <div className="mt-4 flex flex-wrap gap-2">
              {STARTER_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => askPlaybook(ex)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* Response */}
          <AnimatePresence>
            {(response || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                {error ? (
                  <div
                    className="rounded-xl p-3 flex items-start gap-2"
                    style={{
                      background: 'rgba(249,115,98,0.1)',
                      border: '1px solid rgba(249,115,98,0.3)',
                    }}
                  >
                    <AlertTriangle size={14} className="text-red-300 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-red-200 mb-1">
                        {error.message || 'AI request failed'}
                      </div>
                      <div className="text-[11px] text-slate-300 mb-2">
                        {error.isRateLimit
                          ? 'Free model rate-limited. Retry in 30s, or set VITE_OPENROUTER_MODEL to a paid model in .env'
                          : 'Check your API key and network connection.'}
                      </div>
                      <button
                        onClick={() => askPlaybook(question)}
                        className="text-xs font-bold text-red-200 hover:text-red-100 flex items-center gap-1"
                      >
                        <RefreshCw size={11} /> Retry
                      </button>
                    </div>
                  </div>
                ) : response ? (
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                      <p className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">{response.answer}</p>
                    </div>

                    {response.sources.length > 0 && (
                      <div className="border-t border-emerald-500/20 pt-3 mt-3">
                        <p className="text-xs text-emerald-300/80 mb-2">Sources cited:</p>
                        <div className="flex flex-wrap gap-2">
                          {response.sources.map((sourceId) => {
                            const entry = getEntryById(sourceId)
                            return entry ? (
                              <button
                                key={sourceId}
                                onClick={() => focusEntry(sourceId)}
                                className="px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 rounded text-xs text-emerald-200 transition-colors"
                              >
                                {entry.title}
                              </button>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playbook…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === null
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <BookOpen className="w-4 h-4" />
        <span>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </span>
      </div>

      <div className="space-y-3">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedIds.has(entry.id)
          return (
            <motion.div
              key={entry.id}
              id={entry.id}
              layout
              className={cn(
                'bg-white border rounded-xl overflow-hidden transition-colors',
                isExpanded ? 'border-emerald-300 shadow-sm' : 'border-slate-200',
              )}
            >
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
              >
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{entry.category}</span>
                  </div>
                  <h3 className="font-medium text-slate-900 truncate">{entry.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-7 border-l-2 border-emerald-200">
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">{entry.content}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No entries found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
