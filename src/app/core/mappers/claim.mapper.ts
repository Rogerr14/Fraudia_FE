import { ClaimScore, mapAssessmentFromApi } from './assessment.mapper';
import { ClaimAlert, RiskAlertApiDto, mapAlertFromApi } from './alert.mapper';
import { asArray, asRecord, firstNonEmpty, toBoolean, toNumber } from './mapper.utils';

export interface PolicyApiDto {
  id?: string | null;
  code?: string | null;
  insured_id?: string | null;
  branch?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  premium_amount?: number | string | null;
  insured_amount?: number | string | null;
  deductible?: number | string | null;
  sales_channel?: string | null;
  city?: string | null;
  status?: string | null;
}

export interface InsuredApiDto {
  id?: string | null;
  code?: string | null;
  full_name?: string | null;
  document_number?: string | null;
  segment?: string | null;
  seniority_months?: number | null;
  city?: string | null;
  policy_count?: number;
  claims_12m?: number;
  current_delinquency?: boolean;
  client_score?: number | string | null;
}

export interface VehicleApiDto {
  id?: string | null;
  policy_id?: string | null;
  plate?: string | null;
  chassis?: string | null;
  engine?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
}

export interface ProviderApiDto {
  id?: string | null;
  code?: string | null;
  name?: string | null;
  provider_type?: string | null;
  city?: string | null;
  associated_claims?: number;
  average_amount?: number | string | null;
  observed_cases_pct?: number | string | null;
  seniority_months?: number | null;
  is_restricted?: boolean;
}

export interface DocumentApiDto {
  id?: string | null;
  claim_id?: string | null;
  document_type?: string | null;
  delivered?: boolean;
  legible?: boolean;
  issue_date?: string | null;
  inconsistency_detected?: boolean;
  notes?: string | null;
  status?: string | null;
}

export interface ClaimListItemApiDto {
  id: string;
  code?: string | null;
  ramo?: string | null;
  cobertura?: string | null;
  estado?: string | null;
  fecha_ocurrencia?: string | null;
  monto_reclamado?: string | null;
  ciudad?: string | null;
  score_total?: string | null;
  nivel_riesgo?: string | null;
  total_alertas: number;
  estado_flujo?: string | null;
  branch?: string | null;
  coverage?: string | null;
  status?: string | null;
  occurrence_date?: string | null;
  claimed_amount?: string | null;
  city?: string | null;
  score?: unknown;
  flow_status?: string | null;
  provider_id?: string | null;
}

export interface ClaimDetailApiDto extends ClaimListItemApiDto {
  reported_date?: string | null;
  estimated_amount?: string | null;
  paid_amount?: string | null;
  latest_decision?: string | null;
  latest_reviewed_at?: string | null;
  office?: string | null;
  description?: string | null;
  documents_complete?: boolean;
  provider_list_restrictive?: boolean;
  days_from_policy_start?: number | null;
  days_from_policy_end?: number | null;
  report_delay_days?: number | null;
  insured_claim_history?: number;
  insured_amount?: string | null;
  ratio_to_insured_amount?: string | null;
  max_narrative_similarity?: string | null;
  police_report_number?: string | null;
  vehicle?: VehicleApiDto | null;
  policy?: PolicyApiDto | null;
  insured?: InsuredApiDto | null;
  provider?: ProviderApiDto | null;
  documents?: DocumentApiDto[];
  risk_assessment?: unknown;
  score_detail?: unknown;
  score_data?: unknown;
  score?: unknown;
  alerts?: RiskAlertApiDto[];
  review_summary?: Record<string, unknown> | null;
}

export interface ClaimListResponseApiDto {
  items?: ClaimListItemApiDto[];
  claims?: ClaimListItemApiDto[];
  results?: ClaimListItemApiDto[];
  total?: number | string | null;
  page?: number | string | null;
  limit?: number | string | null;
}

export interface Policy {
  id: string;
  code?: string | null;
  insuredId: string;
  branch: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  insuredAmount: number;
  deductible: number;
  salesChannel?: string | null;
  city?: string | null;
  status?: string | null;
}

export interface Insured {
  id: string;
  code?: string | null;
  fullName?: string | null;
  documentNumber?: string | null;
  segment?: string | null;
  seniorityMonths: number;
  city?: string | null;
  policyCount: number;
  claimsLastYear: number;
  currentDelinquency: boolean;
  clientScore: number;
}

export interface Vehicle {
  id: string;
  policyId: string;
  plate?: string | null;
  chassis?: string | null;
  engine?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
}

export interface Provider {
  id: string;
  code?: string | null;
  name?: string | null;
  providerType?: string | null;
  city?: string | null;
  associatedClaims: number;
  averageAmount: number;
  observedCasesPct: number;
  seniorityMonths?: number | null;
  isRestricted: boolean;
}

export interface DocumentItem {
  id: string;
  documentType: string;
  delivered: boolean;
  legible: boolean;
  issueDate?: string | null;
  inconsistencyDetected: boolean;
  notes?: string | null;
  status?: string | null;
}

export interface ClaimReviewSummary {
  latestDecision?: string | null;
  latestReviewedAt?: string | null;
  totalReviews: number;
  currentStatus?: string | null;
  comment?: string | null;
}

export interface Claim {
  id: string;
  code: string;
  policyId: string;
  insuredId: string;
  branch?: string | null;
  coverage?: string | null;
  occurrenceDate?: string | null;
  reportedDate?: string | null;
  claimedAmount: number;
  estimatedAmount: number;
  paidAmount: number;
  status?: string | null;
  flowStatus?: string | null;
  city?: string | null;
  office?: string | null;
  description?: string | null;
  documentsComplete: boolean;
  totalAlerts: number;
  latestDecision?: string | null;
  latestReviewedAt?: string | null;
  providerId?: string | null;
  vehiclePlate?: string | null;
  score: ClaimScore;
}

export interface ClaimDetail extends Claim {
  policy?: Policy | null;
  insured?: Insured | null;
  provider?: Provider | null;
  vehicle?: Vehicle | null;
  documents: DocumentItem[];
  alerts: ClaimAlert[];
  providerListRestrictive: boolean;
  daysFromPolicyStart?: number | null;
  daysFromPolicyEnd?: number | null;
  reportDelayDays?: number | null;
  insuredClaimHistory: number;
  insuredAmount: number;
  ratioToInsuredAmount: number;
  maxNarrativeSimilarity: number;
  policeReportNumber?: string | null;
  reviewSummary: ClaimReviewSummary;
}

export interface ClaimListResponse {
  items: Claim[];
  total: number;
  page: number;
  limit: number;
}

export function mapClaimFromApi(dto: ClaimListItemApiDto): Claim {
  const id = dto.id;
  const code = firstNonEmpty(dto.code, dto.id) ?? dto.id;
  const score = mapAssessmentFromApi(
    {
      score: dto.score_total ?? dto.score,
      level: dto.nivel_riesgo,
    },
    dto.nivel_riesgo,
  );

  return {
    id,
    code,
    policyId: '',
    insuredId: '',
    branch: firstNonEmpty(dto.branch, dto.ramo),
    coverage: firstNonEmpty(dto.coverage, dto.cobertura),
    occurrenceDate: firstNonEmpty(dto.occurrence_date, dto.fecha_ocurrencia),
    reportedDate: null,
    claimedAmount: toNumber(dto.claimed_amount ?? dto.monto_reclamado),
    estimatedAmount: 0,
    paidAmount: 0,
    status: firstNonEmpty(dto.status, dto.estado),
    flowStatus: firstNonEmpty(dto.flow_status, dto.estado_flujo),
    city: firstNonEmpty(dto.city, dto.ciudad),
    office: null,
    description: null,
    documentsComplete: false,
    totalAlerts: toNumber(dto.total_alertas),
    latestDecision: null,
    latestReviewedAt: null,
    providerId: dto.provider_id ?? null,
    vehiclePlate: null,
    score,
  };
}

export function mapClaimDetailFromApi(dto: ClaimDetailApiDto): ClaimDetail {
  const baseClaim = mapClaimFromApi(dto);
  const score = mapAssessmentFromApi(resolveAssessmentSource(dto), dto.nivel_riesgo);

  return {
    ...baseClaim,
    policyId: firstNonEmpty(dto.policy?.id, dto.policy?.code) ?? '',
    insuredId: firstNonEmpty(dto.insured?.id, dto.insured?.code) ?? '',
    reportedDate: dto.reported_date,
    estimatedAmount: toNumber(dto.estimated_amount),
    paidAmount: toNumber(dto.paid_amount),
    office: dto.office,
    description: dto.description,
    documentsComplete: toBoolean(dto.documents_complete),
    latestDecision: dto.latest_decision ?? baseClaim.latestDecision,
    latestReviewedAt: dto.latest_reviewed_at ?? baseClaim.latestReviewedAt,
    score,
    policy: dto.policy ? mapPolicyFromApi(dto.policy) : null,
    insured: dto.insured ? mapInsuredFromApi(dto.insured) : null,
    provider: dto.provider ? mapProviderFromApi(dto.provider) : null,
    vehicle: dto.vehicle ? mapVehicleFromApi(dto.vehicle, dto.policy?.id ?? dto.policy?.code ?? '') : null,
    vehiclePlate: dto.vehicle?.plate ?? null,
    documents: asArray<DocumentApiDto>(dto.documents).map((item, index) => mapDocumentFromApi(item, dto.id, index)),
    alerts: mapClaimAlertsPayload(dto.alerts ?? score.alerts),
    providerListRestrictive: toBoolean(dto.provider_list_restrictive),
    daysFromPolicyStart: dto.days_from_policy_start,
    daysFromPolicyEnd: dto.days_from_policy_end,
    reportDelayDays: dto.report_delay_days,
    insuredClaimHistory: dto.insured_claim_history ?? 0,
    insuredAmount: toNumber(dto.insured_amount),
    ratioToInsuredAmount: toNumber(dto.ratio_to_insured_amount),
    maxNarrativeSimilarity: toNumber(dto.max_narrative_similarity),
    policeReportNumber: dto.police_report_number,
    reviewSummary: mapReviewSummaryFromApi(dto.review_summary, dto),
  };
}

export function mapClaimListResponseFromApi(payload: unknown, page: number, limit: number): ClaimListResponse {
  const record = asRecord(payload);
  const recordItems = asArray<ClaimListItemApiDto>(record?.['items']);
  const claimItems = asArray<ClaimListItemApiDto>(record?.['claims']);
  const resultItems = asArray<ClaimListItemApiDto>(record?.['results']);
  const items = recordItems.length > 0 ? recordItems : claimItems.length > 0 ? claimItems : resultItems.length > 0 ? resultItems : asArray<ClaimListItemApiDto>(payload);

  return {
    items: items.map(mapClaimFromApi),
    total: toNumber(record?.['total']) || items.length,
    page: toNumber(record?.['page']) || page,
    limit: toNumber(record?.['limit']) || limit,
  };
}

export function mapClaimAlertsPayload(payload: unknown): ClaimAlert[] {
  const record = asRecord(payload);
  const recordItems = asArray<RiskAlertApiDto>(record?.['items']);
  const alertItems = asArray<RiskAlertApiDto>(record?.['alerts']);
  const items = recordItems.length > 0 ? recordItems : alertItems.length > 0 ? alertItems : asArray<RiskAlertApiDto>(payload);

  return items.map((alert) => mapAlertFromApi(alert, 'riesgo'));
}

function resolveAssessmentSource(dto: ClaimDetailApiDto): unknown {
  return dto.risk_assessment ?? dto.score_detail ?? dto.score_data ?? dto.score;
}

function mapPolicyFromApi(dto: PolicyApiDto): Policy {
  return {
    id: firstNonEmpty(dto.id, dto.code) ?? 'SIN-POLIZA',
    code: dto.code,
    insuredId: dto.insured_id ?? '',
    branch: dto.branch ?? '-',
    startDate: dto.start_date ?? '',
    endDate: dto.end_date ?? '',
    premiumAmount: toNumber(dto.premium_amount),
    insuredAmount: toNumber(dto.insured_amount),
    deductible: toNumber(dto.deductible),
    salesChannel: dto.sales_channel,
    city: dto.city,
    status: dto.status,
  };
}

function mapInsuredFromApi(dto: InsuredApiDto): Insured {
  return {
    id: firstNonEmpty(dto.id, dto.code) ?? 'SIN-ASEGURADO',
    code: dto.code,
    fullName: dto.full_name,
    documentNumber: dto.document_number,
    segment: dto.segment,
    seniorityMonths: dto.seniority_months ?? 0,
    city: dto.city,
    policyCount: dto.policy_count ?? 0,
    claimsLastYear: dto.claims_12m ?? 0,
    currentDelinquency: toBoolean(dto.current_delinquency),
    clientScore: toNumber(dto.client_score),
  };
}

function mapVehicleFromApi(dto: VehicleApiDto, fallbackPolicyId: string): Vehicle {
  return {
    id: firstNonEmpty(dto.id, dto.plate, dto.chassis) ?? 'SIN-VEHICULO',
    policyId: dto.policy_id ?? fallbackPolicyId,
    plate: dto.plate,
    chassis: dto.chassis,
    engine: dto.engine,
    brand: dto.brand,
    model: dto.model,
    year: dto.year,
    color: dto.color,
  };
}

function mapProviderFromApi(dto: ProviderApiDto): Provider {
  return {
    id: firstNonEmpty(dto.id, dto.code, dto.name) ?? 'SIN-PROVEEDOR',
    code: dto.code,
    name: dto.name,
    providerType: dto.provider_type,
    city: dto.city,
    associatedClaims: dto.associated_claims ?? 0,
    averageAmount: toNumber(dto.average_amount),
    observedCasesPct: toNumber(dto.observed_cases_pct),
    seniorityMonths: dto.seniority_months,
    isRestricted: toBoolean(dto.is_restricted),
  };
}

function mapDocumentFromApi(dto: DocumentApiDto, claimId: string, index: number): DocumentItem {
  return {
    id: dto.id ?? `${claimId}-document-${index + 1}`,
    documentType: dto.document_type ?? 'Documento',
    delivered: toBoolean(dto.delivered),
    legible: dto.legible ?? true,
    issueDate: dto.issue_date,
    inconsistencyDetected: toBoolean(dto.inconsistency_detected),
    notes: dto.notes,
    status: dto.status,
  };
}

function mapReviewSummaryFromApi(payload: unknown, dto: ClaimDetailApiDto): ClaimReviewSummary {
  const record = asRecord(payload);

  return {
    latestDecision: (record?.['latest_decision'] as string | null | undefined) ?? dto.latest_decision,
    latestReviewedAt: (record?.['latest_reviewed_at'] as string | null | undefined) ?? dto.latest_reviewed_at,
    totalReviews: toNumber(record?.['total_reviews']),
    currentStatus:
      (record?.['current_status'] as string | null | undefined) ??
      (record?.['flow_status'] as string | null | undefined) ??
      dto.flow_status ??
      dto.estado_flujo,
    comment: (record?.['comment'] as string | null | undefined) ?? null,
  };
}
