// SECURITY NOTE: This file makes AI provider calls directly from the
// browser, exposing the API key in the bundle. This is acceptable
// for local development, demos, and prototypes — but BEFORE
// production deployment, all AI calls must move to a server function
// (Supabase Edge Function or similar) and the VITE_ prefix removed
// from the API key environment variable.

import {
  getCacheKey,
  getCached,
  setCached,
  deleteCached,
  getInflight,
  setInflight,
} from './aiCache'

export interface CallAIOptions {
  prompt: string
  system?: string
  maxTokens?: number // default 1000
  json?: boolean // if true, strips ```json fences and returns parsed object
  mockResponse?: string | object // canned response for demo mode
  bypassCache?: boolean // if true, skip cache read and delete existing entry on success
}

export interface AIError extends Error {
  status?: number
  isRateLimit?: boolean
}

const DEMO_DELAY_MS = 600

/**
 * Makes an OpenRouter API call with the specified model.
 * Returns the parsed response or throws an error with status info.
 */
async function makeOpenRouterCall(
  model: string,
  opts: CallAIOptions
): Promise<unknown> {
  const { prompt, system, maxTokens = 1000, json = false } = opts
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'SparkLocal Operator',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const error = new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`) as AIError
    error.status = response.status
    error.isRateLimit = response.status === 429
    throw error
  }

  const data = await response.json()
  let content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No content in response')
  }

  // Parse JSON if requested
  if (json) {
    // Strip ```json and ``` fences
    content = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

    try {
      return JSON.parse(content)
    } catch {
      throw new Error(`AI returned invalid JSON: ${content.slice(0, 100)}`)
    }
  }

  return content
}

/**
 * Single source of truth for all AI calls in the app.
 * Supports demo mode with canned responses, caching, deduplication,
 * and automatic fallback on 429 rate limits.
 */
export async function callAI(opts: CallAIOptions): Promise<unknown> {
  const {
    prompt,
    system,
    json = false,
    mockResponse,
    bypassCache = false,
  } = opts

  // Demo mode: return mock response after artificial delay
  if (import.meta.env.VITE_AI_DEMO_MODE === 'true') {
    await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS))

    if (mockResponse !== undefined) {
      if (json && typeof mockResponse === 'object') {
        return mockResponse
      }
      return typeof mockResponse === 'string' ? mockResponse : JSON.stringify(mockResponse)
    }

    return '[Demo mode — AI response would appear here]'
  }

  // Real AI call
  const provider = import.meta.env.VITE_AI_PROVIDER

  if (provider !== 'openrouter') {
    throw new Error(`AI call failed: Unknown provider "${provider}". Only "openrouter" is supported.`)
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const primaryModel = import.meta.env.VITE_OPENROUTER_MODEL
  const fallbackModel = import.meta.env.VITE_OPENROUTER_FALLBACK_MODEL

  if (!apiKey) {
    throw new Error('AI call failed: VITE_OPENROUTER_API_KEY is not set')
  }

  if (!primaryModel) {
    throw new Error('AI call failed: VITE_OPENROUTER_MODEL is not set')
  }

  const cacheKey = getCacheKey({ prompt, system, json })

  // Check cache (unless bypassing)
  if (!bypassCache) {
    const cached = getCached(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    // Dedupe in-flight calls — if same call already running, await it
    const inflight = getInflight(cacheKey)
    if (inflight) {
      return inflight
    }
  } else {
    // Bypassing cache: delete existing entry so new result replaces it
    deleteCached(cacheKey)
  }

  // Make the call, store the promise so concurrent callers dedupe
  const promise = (async () => {
    try {
      // Try primary model
      const result = await makeOpenRouterCall(primaryModel, opts)
      setCached(cacheKey, result)
      return result
    } catch (error) {
      const aiError = error as AIError

      // If 429 and fallback is configured, try fallback model
      if (aiError.isRateLimit && fallbackModel) {
        console.warn(`Primary model rate-limited, falling back to ${fallbackModel}`)

        try {
          const result = await makeOpenRouterCall(fallbackModel, opts)
          setCached(cacheKey, result)
          return result
        } catch (fallbackError) {
          // Fallback also failed, throw original error
          const fbError = fallbackError as AIError
          if (fbError.isRateLimit) {
            throw aiError // Throw original 429 error
          }
          throw fallbackError
        }
      }

      // Re-throw original error
      throw error
    }
  })()

  // Only set inflight if not bypassing cache (since bypass means we want fresh result)
  if (!bypassCache) {
    setInflight(cacheKey, promise)
  }

  try {
    return await promise
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const aiError = new Error(`AI call failed: ${message}`) as AIError
    if (error instanceof Error && 'status' in error) {
      aiError.status = (error as AIError).status
      aiError.isRateLimit = (error as AIError).isRateLimit
    }
    throw aiError
  }
}
