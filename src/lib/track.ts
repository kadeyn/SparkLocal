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
