// Data retention policy scaffolding. The actual scheduled-job logic will run
// server-side in production; this module is the source of truth for what
// data SparkLocal keeps, for how long, and on what legal basis.
//
// Defined here in the client bundle so the operator portal can surface the
// policy in the ComplianceView without round-tripping a server.

import { COMPLIANCE_CONFIG } from './compliance'

export type DeletionMethod = 'hard' | 'anonymize' | 'archive'

export interface RetentionPolicy {
  dataType: string
  retentionDays: number
  deletionMethod: DeletionMethod
  legalBasis: string
}

export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    dataType: 'survey_responses',
    retentionDays: COMPLIANCE_CONFIG.retentionDays.activeUserData,
    deletionMethod: 'hard',
    legalBasis: 'COPPA amended rule data minimization',
  },
  {
    dataType: 'message_content',
    retentionDays: COMPLIANCE_CONFIG.retentionDays.activeUserData,
    deletionMethod: 'hard',
    legalBasis: 'COPPA amended rule data minimization',
  },
  {
    dataType: 'gig_completion_records',
    retentionDays: COMPLIANCE_CONFIG.retentionDays.activeUserData,
    deletionMethod: 'anonymize',
    legalBasis: 'Business records; user-side portable via Open Badges export',
  },
  {
    dataType: 'mentor_kid_interaction_logs',
    retentionDays: COMPLIANCE_CONFIG.retentionDays.auditLogs,
    deletionMethod: 'archive',
    legalBasis: 'Child safety audit; CA AADC compliance',
  },
  {
    dataType: 'parental_consent_records',
    retentionDays: COMPLIANCE_CONFIG.retentionDays.auditLogs,
    deletionMethod: 'archive',
    legalBasis: 'COPPA verifiable parental consent record-keeping',
  },
]

// Stub — implemented for real server-side in the prompt-2 sequence.
export function getRetentionPolicy(dataType: string): RetentionPolicy | undefined {
  return RETENTION_POLICIES.find((p) => p.dataType === dataType)
}
