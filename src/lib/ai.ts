// SECURITY NOTE: This file makes AI provider calls directly from the
// browser, exposing the API key in the bundle. This is acceptable
// for local development, demos, and prototypes — but BEFORE
// production deployment, all AI calls must move to a server function
// (Supabase Edge Function or similar) and the VITE_ prefix removed
// from the API key environment variable.

export interface CallAIOptions {
  prompt: string
  system?: string
  maxTokens?: number // default 1000
  json?: boolean // if true, strips ```json fences and returns parsed object
  mockResponse?: string | object // canned response for demo mode
}

const DEMO_DELAY_MS = 600

/**
 * Single source of truth for all AI calls in the app.
 * Supports demo mode with canned responses and OpenRouter integration.
 */
export async function callAI(opts: CallAIOptions): Promise<string | unknown> {
  const { prompt, system, maxTokens = 1000, json = false, mockResponse } = opts

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

  // OpenRouter call
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const model = import.meta.env.VITE_OPENROUTER_MODEL

  if (!apiKey) {
    throw new Error('AI call failed: VITE_OPENROUTER_API_KEY is not set')
  }

  if (!model) {
    throw new Error('AI call failed: VITE_OPENROUTER_MODEL is not set')
  }

  try {
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
      throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`)
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`AI call failed: ${message}`)
  }
}
