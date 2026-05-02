// Analytics tracking helper
// Currently just console.log scaffolding - will be replaced with PostHog/Mixpanel later

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
