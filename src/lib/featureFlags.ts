// Feature flags — single source of truth for what's shipped vs. deferred.
// Flag-gated changes should be toggled here, not by branching in components.

import { COMPLIANCE_CONFIG } from './compliance'

export const FEATURE_FLAGS = {
  // Track-level gates — derived from compliance config so the two never drift.
  explorerTrackUI: COMPLIANCE_CONFIG.explorerTrackEnabled,

  // Specific features deferred to later prompts in the May-2026 sequence.
  // Names mirror the prompt manifest so reviewers can grep across the codebase.
  parentMediatedPayments: false, // Implemented in prompt 2B (gated on init-7)
  openBadgesIssuer: true, // Implemented in prompt 2A
  familyPlanDualPriority: false, // Implemented in prompt 4
  boundedDailyFeed: true, // Implemented in prompt 3
  pathTabRestructure: true, // Implemented in prompt 3
  aiCostRouter: false, // Implemented in prompt 5
  sessionPacing: false, // Implemented in prompt 5

  // Always-on compliance features (this prompt).
  notificationBlackoutEnforcement: true,
  dataRetentionAutomation: true,
  separateParentConsent: true,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag]
}
