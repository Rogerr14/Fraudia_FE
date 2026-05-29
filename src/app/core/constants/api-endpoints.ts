export const API_ENDPOINTS = {
  health: {
    check: '/health',
  },
  uploads: {
    dataset: '/imports/file',
    list: '/imports',
    errors: (importId: string) => `/imports/${importId}/errors`,
    assess: (importId: string) => `/imports/${importId}/assess`,
  },
  claims: {
    list: '/claims',
    detail: (claimId: string) => `/claims/${claimId}`,
    alerts: (claimId: string) => `/claims/${claimId}/alerts`,
    assessment: (claimId: string) => `/claims/${claimId}/assessment`,
    assess: (claimId: string) => `/claims/${claimId}/assess`,
    review: (claimId: string) => `/claims/${claimId}/review`,
    reviewHistory: (claimId: string) => `/claims/${claimId}/review-history`,
  },
  risk: {
    topClaims: '/risk/top',
    assessAll: '/risk/assess-all',
  },
  analytics: {
    summary: '/analytics/summary',
    providers: '/analytics/providers',
    alerts: '/analytics/alerts',
    reviewStatus: '/analytics/review-status',
    branches: '/analytics/branches',
    cities: '/analytics/cities',
  },
  imports: {
    list: '/imports',
    file: '/imports/file',
  },
  agent: {
    query: '/agent/query',
    sessions: '/agent/sessions',
    sessionMessages: (sessionId: string) => `/agent/sessions/${sessionId}/messages`,
    suggestedQuestions: '/agent/suggested-questions',
    explainClaim: (claimId: string) => `/agent/claims/${claimId}/explain`,
  },
  rules: {
    list: '/rules',
    detail: (ruleId: string) => `/rules/${ruleId}`,
  },
  catalogs: {
    decisions: '/catalogs/decisions',
    claimStatuses: '/catalogs/claim-statuses',
  },
};
