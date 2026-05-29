export type {
  Claim,
  ClaimDetail,
  ClaimDetailApiDto,
  ClaimListItemApiDto,
  ClaimListResponse,
  ClaimListResponseApiDto,
  ClaimReviewSummary,
  DocumentItem,
  Insured,
  Policy,
  Provider,
  Vehicle,
} from '../../../core/mappers/claim.mapper';

export type { ClaimAlert, RiskAlertApiDto } from '../../../core/mappers/alert.mapper';
export type { ClaimScore, RiskAssessmentApiDto } from '../../../core/mappers/assessment.mapper';

export {
  mapClaimAlertsPayload,
  mapClaimDetailFromApi,
  mapClaimFromApi,
  mapClaimListResponseFromApi,
} from '../../../core/mappers/claim.mapper';

export interface ClaimFilters {
  riskLevel?: string;
  flowStatus?: string;
  branch?: string;
  coverage?: string;
  city?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}
