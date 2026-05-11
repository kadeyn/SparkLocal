// Notification guard — pure function that decides whether a notification may
// be sent to a minor right now. Applied to every push, email, and SMS
// destined for a kid account.
//
// Defaults adopt the strictest U.S. standard (CA SB 976 / NY SAFE Act) for
// all minors regardless of jurisdiction. Business owners and parents are
// adults and are not subject to this gate — callers should branch on the
// recipient's account type before invoking this function.

import { COMPLIANCE_CONFIG } from './compliance'
import type { Track } from './compliance'

export interface NotificationContext {
  userTrack: Track
  userTimeZone: string // IANA timezone string, e.g. 'America/Chicago'
  parentConsentForOutsideBlackout: boolean
}

export function canSendNotification(ctx: NotificationContext): boolean {
  // Resolve "now" in the user's local timezone. We rely on the JS engine's
  // Intl support; in Node 18+ and every modern browser this is reliable.
  const userNow = new Date(new Date().toLocaleString('en-US', { timeZone: ctx.userTimeZone }))
  const hour = userNow.getHours()
  const minute = userNow.getMinutes()
  const dayOfWeek = userNow.getDay()
  const month = userNow.getMonth() + 1

  const currentTime = hour + minute / 60

  // Night blackout: midnight to 6am, every day.
  if (currentTime >= 0 && currentTime < 6) return false

  // School-day blackout: 8am-3pm Mon-Fri during school-year months.
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  const schoolMonths = COMPLIANCE_CONFIG.notificationBlackout.schoolYearMonths as readonly number[]
  const isSchoolYearMonth = schoolMonths.includes(month)

  if (isWeekday && isSchoolYearMonth && currentTime >= 8 && currentTime < 15) {
    return false
  }

  // `parentConsentForOutsideBlackout` is plumbed for the future case where
  // a verified-parent override lets a kid receive a 5am summer-camp wake-up
  // ping. Not exercised yet — defaults stay strict.
  return true
}
