import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

interface SurveyState {
  answers: SurveyAnswers
  setAnswer: <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void
  reset: () => void
  markComplete: () => void
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
    }),
    {
      name: 'sparklocal-survey',
    }
  )
)
