export const API_ENDPOINTS = {
  health: {
    check: '/health',
  },
  uploads: {
    dataset: '/uploads/dataset',
    status: (batchId: string) => `/uploads/${batchId}/status`,
  },
  claims: {
    list: '/siniestros',
    detail: (id: string) => `/siniestros/${id}`,
    create: '/siniestros',
    update: (id: string) => `/siniestros/${id}`,
    evaluate: (id: string) => `/siniestros/${id}/evaluate`,
    score: (id: string) => `/siniestros/${id}/score`,
    alerts: (id: string) => `/siniestros/${id}/alertas`,
    review: (id: string) => `/siniestros/${id}/review`,
    reviewHistory: (id: string) => `/siniestros/${id}/review-history`,
  },
  scoring: {
    evaluateBatch: '/scoring/evaluate-batch',
  },
  rules: {
    list: '/reglas',
    detail: (id: number) => `/reglas/${id}`,
  },
  dashboard: {
    summary: '/dashboard/summary',
    riskDistribution: '/dashboard/risk-distribution',
    topRiskClaims: '/dashboard/top-risk-claims',
    providersRanking: '/dashboard/providers-ranking',
    citiesAlerts: '/dashboard/cities-alerts',
    branchesRisk: '/dashboard/branches-risk',
  },
  agent: {
    query: '/agent/query',
    explain: (claimId: string) => `/agent/siniestro/${claimId}/explain`,
    suggestedQuestions: '/agent/suggested-questions',
  },
  reports: {
    criticalCases: '/reportes/casos-criticos',
    executiveSummary: '/reportes/resumen-ejecutivo',
  },
};
