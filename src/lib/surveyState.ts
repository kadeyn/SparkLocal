import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track } from './compliance'

export interface SurveyAnswers {
  favoriteSubjects: string | null
  hobbies: string[]
  moneyMotivation: string | null
  wantToTry: string
  timeAvailable: string | null
  zipCode: string
  ageGate: 'over13' | 'under13' | null
  workStyle: string | null
  completedAt: string | null

  // Track + consent state (added in compliance foundation commit).
  trackOverride?: Track // Future demonstrated-capacity promotion. Defaults age-derived.
  ageConfirmedAt?: string // ISO timestamp when birthdate was verified.
  parentConsentScopes: string[] // Active separate-consent scopes (see compliance.ts).
  parentConsentRenewalDue?: string // ISO date when annual renewal becomes required.

  // Birth month + year. We do NOT collect day per COPPA data-minimization
  // guidance — month+year is sufficient for age-band determination via
  // determineTrackFromAge() (which assumes the 15th of the month).
  birthMonth?: number // 1-12
  birthYear?: number // four-digit year
}

interface SurveyState {
  answers: SurveyAnswers
  setAnswer: <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void
  reset: () => void
  markComplete: () => void

  // Typed helpers for the new track + consent state. They route through the
  // same store so persistence and rehydration stay consistent.
  setTrackOverride: (track: Track | undefined) => void
  recordAgeConfirmation: () => void
  setParentConsentScopes: (scopes: string[]) => void
  setParentConsentRenewalDue: (isoDate: string | undefined) => void
}

const initialAnswers: SurveyAnswers = {
  favoriteSubjects: null,
  hobbies: [],
  moneyMotivation: null,
  wantToTry: '',
  timeAvailable: null,
  zipCode: '',
  ageGate: null,
  workStyle: null,
  completedAt: null,
  trackOverride: undefined,
  ageConfirmedAt: undefined,
  parentConsentScopes: [],
  parentConsentRenewalDue: undefined,
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      answers: initialAnswers,
      setAnswer: (key, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [key]: value,
          },
        })),
      reset: () => set({ answers: initialAnswers }),
      markComplete: () =>
        set((state) => ({
          answers: {
            ...state.answers,
            completedAt: new Date().toISOString(),
          },
        })),

      setTrackOverride: (track) =>
        set((state) => ({
          answers: { ...state.answers, trackOverride: track },
        })),

      recordAgeConfirmation: () =>
        set((state) => ({
          answers: { ...state.answers, ageConfirmedAt: new Date().toISOString() },
        })),

      setParentConsentScopes: (scopes) =>
        set((state) => ({
          answers: { ...state.answers, parentConsentScopes: scopes },
        })),

      setParentConsentRenewalDue: (isoDate) =>
        set((state) => ({
          answers: { ...state.answers, parentConsentRenewalDue: isoDate },
        })),
    }),
    {
      name: 'sparklocal-survey',
      // Bump when the persisted shape changes. Older clients run through
      // `migrate` so non-optional new fields (e.g. parentConsentScopes) always
      // hydrate to a sane default instead of `undefined`.
      version: 1,
      migrate: (persisted, _fromVersion) => {
        const raw = (persisted as { answers?: Partial<SurveyAnswers> } | undefined)?.answers ?? {}
        return {
          answers: {
            ...initialAnswers,
            ...raw,
            parentConsentScopes: raw.parentConsentScopes ?? [],
          },
        } as { answers: SurveyAnswers }
      },
    },
  ),
)
