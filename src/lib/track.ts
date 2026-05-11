// Analytics tracking helper
// Currently just console.log scaffolding - will be replaced with PostHog/Mixpanel later

import type { SwipeDirection } from './feed/dailyFeed'

type TrackEventProps = Record<string, string | number | boolean | undefined>

export function track(eventName: string, props?: TrackEventProps): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, props || {})
  }

  // Future: PostHog, Mixpanel, etc.
  // if (window.posthog) {
  //   window.posthog.capture(eventName, props)
  // }
}

// Pre-defined event helpers for type safety
export const trackPathViewed = (view: 'tree' | 'constellation' | 'future') => {
  track('path_viewed', { view })
}

export const trackSkillNodeClicked = (nodeId: string, status: 'earned' | 'unlocked' | 'locked') => {
  track('skill_node_clicked', { node_id: nodeId, status })
}

export const trackGalaxyClicked = (galaxyId: string) => {
  track('galaxy_clicked', { galaxy_id: galaxyId })
}

export const trackCareerClicked = (careerId: string) => {
  track('career_clicked', { career_id: careerId })
}

export const trackMentorClicked = (mentorId: string) => {
  track('mentor_clicked', { mentor_id: mentorId })
}

export const trackFuturePathSelected = (pathId: string) => {
  track('future_path_selected', { path_id: pathId })
}

export const trackMilestoneClicked = (milestoneId: string) => {
  track('milestone_clicked', { milestone_id: milestoneId })
}

// Operator portal event helpers
export const trackOperatorGroupSwitched = (group: string) => {
  track('operator_group_switched', { group })
}

export const trackOperatorRoadmapVectorSwitched = (vector: string) => {
  track('operator_roadmap_vector_switched', { vector })
}

export const trackOperatorInitiativeOpened = (
  initiativeId: string,
  stage: string,
  health: string
) => {
  track('operator_initiative_opened', { initiativeId, stage, health })
}

export const trackOperatorInitiativeVerdictGenerated = (
  initiativeId: string,
  verdict: string
) => {
  track('operator_initiative_verdict_generated', { initiativeId, verdict })
}

export const trackOperatorCashFlowScenarioSwitched = (scenario: string) => {
  track('operator_cashflow_scenario_switched', { scenario })
}

export const trackOperatorStatementsViewSwitched = (stmt: string) => {
  track('operator_statements_view_switched', { stmt })
}

export const trackOperatorLBOTargetSelected = (targetId: string) => {
  track('operator_lbo_target_selected', { targetId })
}

export const trackOperatorLBODebtChanged = (debtPct: number) => {
  track('operator_lbo_debt_changed', { debtPct })
}

export const trackOperatorAISynthesisRegenerated = (module: string) => {
  track('operator_ai_synthesis_regenerated', { module })
}

export const trackOperatorAIError = (module: string, isRateLimit: boolean) => {
  track('operator_ai_error', { module, isRateLimit })
}

// Owner OS event helpers
export const trackOwnerLoginAttempted = (success: boolean) => {
  track('owner_login_attempted', { success })
}

export const trackOwnerDashboardViewed = () => {
  track('owner_dashboard_viewed')
}

export const trackOwnerPipelineKidOpened = (kidId: string, stage: string) => {
  track('owner_pipeline_kid_opened', { kidId, stage })
}

export const trackOwnerInitiativeOpened = (initiativeId: string) => {
  track('owner_initiative_opened', { initiativeId })
}

export const trackOwnerInitiativeVerdictReceived = (
  initiativeId: string,
  verdict: 'scale' | 'troubleshoot' | 'kill',
) => {
  track('owner_initiative_verdict_received', { initiativeId, verdict })
}

export const trackOwnerPlaybookQuery = (query: string, sourcesReturned: number) => {
  track('owner_playbook_query', { query, sourcesReturned })
}

export const trackOwnerFinanceProjectionViewed = (scenario: string) => {
  track('owner_finance_projection_viewed', { scenario })
}

// Daily feed (prompt 3) event helpers
export function trackFeedCardSwiped(
  direction: SwipeDirection,
  cardCategory: string,
  matchScore: number,
): void {
  track('feed_card_swiped', { direction, cardCategory, matchScore })
}

export function trackFeedDayExhausted(
  cardsActedOn: number,
  interested: number,
  saved: number,
  declined: number,
): void {
  track('feed_day_exhausted', { cardsActedOn, interested, saved, declined })
}

export function trackFeedSessionNudgeShown(elapsedMinutes: number): void {
  track('feed_session_nudge_shown', { elapsedMinutes: Math.round(elapsedMinutes) })
}

// Path tab (prompt 3) event helpers — replaces the legacy trackPathViewed
// for the new two-tab structure. Legacy helper stays for backward compat.
export function trackPathTabViewed(tab: 'mypath' | 'explore'): void {
  track('path_tab_viewed', { tab })
}

export function trackPathExploreCardAdded(cardType: string): void {
  track('path_explore_card_added', { cardType })
}

export function trackMyPathNextStepClicked(stepType: string): void {
  track('my_path_next_step_clicked', { stepType })
}
