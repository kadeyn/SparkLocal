import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Tag,
  Sparkles,
  Send,
  RefreshCw,
  BookOpen,
  Lightbulb,
} from 'lucide-react'
import { track } from '@/lib/track'
import { callAI } from '@/lib/ai'
import {
  KNOWLEDGE_BASE,
  getKnowledgeCategories,
  searchKnowledge,
  type KnowledgeEntry,
} from '@/data/operatorKnowledgeBase'
import { cn } from '@/lib/utils'

interface AIResponse {
  answer: string
  sources: string[]
}

export default function KnowledgeView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const categories = useMemo(() => getKnowledgeCategories(), [])

  const filteredEntries = useMemo(() => {
    let entries = KNOWLEDGE_BASE

    // Filter by category
    if (selectedCategory) {
      entries = entries.filter((e) => e.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery.trim()) {
      entries = searchKnowledge(searchQuery)
      if (selectedCategory) {
        entries = entries.filter((e) => e.category === selectedCategory)
      }
    }

    return entries
  }, [searchQuery, selectedCategory])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        track('operator_kb_entry_expanded', { entryId: id })
      }
      return next
    })
  }

  const askStrategyAI = async () => {
    if (!aiQuestion.trim() || aiLoading) return

    setAiLoading(true)
    track('operator_kb_ai_asked', { question: aiQuestion })

    // Build context from knowledge base
    const kbContext = KNOWLEDGE_BASE.map((e) => `[${e.id}] ${e.title}: ${e.content}`).join('\n\n')

    const mockAnswer: AIResponse = {
      answer: `Based on our strategy documentation, here's what I found relevant to your question:

${aiQuestion.toLowerCase().includes('retention') ? 'Our retention benchmarks are: Kids 60% at week 4, 40% at week 12. Owners 75% at week 4, 55% at week 12. The skill tree gamification significantly improves kid retention - kids with 2+ badges retain at 71%.' : ''}
${aiQuestion.toLowerCase().includes('growth') ? 'We use an owner-first market entry strategy, onboarding local business owners before kids. Target is 15+ verified owners per metro before launching kid acquisition. We expand metro-by-metro using school district boundaries as expansion units.' : ''}
${aiQuestion.toLowerCase().includes('revenue') || aiQuestion.toLowerCase().includes('pricing') ? 'SparkLocal charges a 12% take rate on completed transactions. Split: 8% from owner payment, 4% from kid earnings. No subscription fees for either side currently.' : ''}
${!aiQuestion.toLowerCase().includes('retention') && !aiQuestion.toLowerCase().includes('growth') && !aiQuestion.toLowerCase().includes('revenue') && !aiQuestion.toLowerCase().includes('pricing') ? 'Based on the knowledge base, I can provide insights on growth strategy, product features, revenue model, metrics, operations, competition, fundraising, team, and legal compliance. Please ask a more specific question about any of these areas.' : ''}`,
      sources: aiQuestion.toLowerCase().includes('retention')
        ? ['kb-11', 'kb-6']
        : aiQuestion.toLowerCase().includes('growth')
        ? ['kb-1', 'kb-2', 'kb-3']
        : aiQuestion.toLowerCase().includes('revenue')
        ? ['kb-7', 'kb-8']
        : ['kb-1', 'kb-9'],
    }

    try {
      const result = await callAI({
        system: `You are a strategy AI assistant for SparkLocal. Answer questions using ONLY the knowledge base provided. Always cite sources using their IDs (e.g., kb-1, kb-7).

Knowledge Base:
${kbContext}

Respond in JSON format:
{
  "answer": "Your detailed answer here, citing source IDs inline like [kb-1]",
  "sources": ["kb-1", "kb-7"] // Array of cited source IDs
}`,
        prompt: aiQuestion,
        json: true,
        mockResponse: mockAnswer,
      })

      setAiResponse(result as AIResponse)
    } catch (error) {
      console.error('Strategy AI error:', error)
      setAiResponse(mockAnswer)
    } finally {
      setAiLoading(false)
    }
  }

  const getEntryById = (id: string): KnowledgeEntry | undefined => {
    return KNOWLEDGE_BASE.find((e) => e.id === id)
  }

  return (
    <div className="space-y-6">
      {/* Ask Strategy AI */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Ask Strategy AI</h2>
            <p className="text-xs text-slate-400">
              Get answers from the knowledge base with cited sources
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askStrategyAI()}
            placeholder="Ask about growth strategy, metrics, revenue model..."
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={askStrategyAI}
            disabled={aiLoading || !aiQuestion.trim()}
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {aiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm whitespace-pre-wrap">{aiResponse.answer}</p>
                </div>

                {aiResponse.sources.length > 0 && (
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <p className="text-xs text-slate-500 mb-2">Sources cited:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.sources.map((sourceId) => {
                        const entry = getEntryById(sourceId)
                        return entry ? (
                          <button
                            key={sourceId}
                            onClick={() => {
                              setExpandedIds(new Set([sourceId]))
                              setSelectedCategory(null)
                              setSearchQuery('')
                              // Scroll to entry
                              document.getElementById(sourceId)?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                              })
                            }}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-violet-300 transition-colors"
                          >
                            {entry.title}
                          </button>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === null
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <BookOpen className="w-4 h-4" />
        <span>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </span>
      </div>

      {/* Knowledge Entries */}
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
                isExpanded ? 'border-violet-300 shadow-sm' : 'border-slate-200'
              )}
            >
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                      {entry.category}
                    </span>
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
                      <div className="pl-7 border-l-2 border-violet-200">
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                          {entry.content}
                        </p>
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
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
