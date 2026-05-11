// Compliance configuration — single source of truth for age, consent, and
// data-handling decisions across SparkLocal. Tied to the May 2026 research
// brief (Section 1, age floor; Section 4, COPPA amended rule).
//
// Anything that branches on age, consent scope, retention window, or
// notification policy should read from this module — never hardcode.

export const COMPLIANCE_CONFIG = {
  // V1 launch age floor — the foundational business decision from research
  // brief Section 1. Raising this from 11+ to 13+ dramatically reduces
  // compliance burden for V1.
  minimumAge: 13,

  // Feature flag — flip to true after V1 maturity (target: month 12-18
  // post-launch) AND after legal review of Explorer-track compliance.
  explorerTrackEnabled: false,

  // Data retention windows per COPPA amended rule (in force 2026-04-22).
  retentionDays: {
    activeUserData: 1095, // 3 years active use
    inactiveAccountData: 365, // 1 year post-inactivity before deletion
    portfolioExportWindow: 365, // 1 year post-account-deletion for export
    auditLogs: 2555, // 7 years for compliance audit trail
    securityIncidentLogs: 2555, // 7 years
  },

  // Notification restrictions per CA SB 976 / NY SAFE Act.
  // Adopted as defaults for ALL minors regardless of jurisdiction so we never
  // accidentally ship a notification at 2am to a kid in a strict state.
  notificationBlackout: {
    nightStart: '00:00', // No notifications midnight-6am
    nightEnd: '06:00',
    schoolDayStart: '08:00', // No notifications 8am-3pm Mon-Fri
    schoolDayEnd: '15:00',
    schoolYearMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5], // Sep-May
  },

  // Verifiable parental consent requirements (COPPA amended).
  consent: {
    requireSeparateConsentFor: [
      'third_party_disclosure',
      'targeted_advertising', // Required if ever enabled — currently disabled for minors
      'ai_training_data_use',
      'biometric_collection',
      'precise_location',
    ],
    consentRenewalDays: 365, // Annual renewal
    consentExpirationDays: 30, // Grace period before re-collection
  },
} as const

export type Track = 'explorer' | 'builder' | 'pro'

export interface AgeBandResult {
  track: Track
  allowed: boolean
  age: number
  reason?: string
}

/**
 * Determine the track a user lands on based on their birth date. Default
 * mapping is age-based; a future iteration will allow track override based on
 * demonstrated capacity (see `trackOverride` in surveyState).
 *
 * Returns `allowed: false` when:
 *   - the user is under the V1 age floor (currently 13)
 *   - the user is 11-13 and the Explorer track flag is off (currently the case)
 *   - the user is over 18
 */
export function determineTrackFromAge(birthDate: Date): AgeBandResult {
  const today = new Date()
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
  const age = today.getFullYear() - birthDate.getFullYear() - (hasHadBirthdayThisYear ? 0 : 1)

  if (age < COMPLIANCE_CONFIG.minimumAge) {
    return {
      track: 'explorer',
      allowed: false,
      age,
      reason: `You're ${age}. SparkLocal V1 launches at ${COMPLIANCE_CONFIG.minimumAge}+. Join the waitlist and we'll let you know when we open up.`,
    }
  }

  if (age <= 13) {
    if (!COMPLIANCE_CONFIG.explorerTrackEnabled) {
      return {
        track: 'explorer',
        allowed: false,
        age,
        reason: 'Explorer track is not yet available. Join the waitlist.',
      }
    }
    return { track: 'explorer', allowed: true, age }
  }

  if (age <= 16) return { track: 'builder', allowed: true, age }
  if (age <= 18) return { track: 'pro', allowed: true, age }

  return {
    track: 'pro',
    allowed: false,
    age,
    reason: 'SparkLocal is for users ages 13-18.',
  }
}

/**
 * Resolve a track from a birth month + year pair. We assume the 15th of the
 * month so off-by-a-day issues at month boundaries don't tip a user into the
 * wrong band. Returns null when the inputs are incomplete.
 */
export function determineTrackFromBirth(
  birthMonth: number | undefined,
  birthYear: number | undefined,
): AgeBandResult | null {
  if (!birthMonth || !birthYear) return null
  // Month is 1-12 in our schema; Date expects 0-11.
  const birthDate = new Date(birthYear, birthMonth - 1, 15)
  return determineTrackFromAge(birthDate)
}
