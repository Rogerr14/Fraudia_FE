import { RiskLevel } from '../../../core/models/common.model';
import { calculatePercentage, normalizeRiskLevel } from '../../../shared/utils/risk.util';
import { Claim, ClaimListItemApiDto, mapClaimFromApi } from '../../claims/models/claim.model';

export interface RiskDistributionApiDto {
  level?: string | null;
  nivel_riesgo?: string | null;
  count?: number | null;
}

export interface DashboardSummaryApiDto {
  total_claims?: number | string | null;
  assessed_claims?: number | string | null;
  average_score?: number | string | null;
  total_claimed_amount?: number | string | null;
  high_risk_amount?: number | string | null;
  distribution?: RiskDistributionApiDto[];
  distribucion_nivel_riesgo?: RiskDistributionApiDto[];
}

export interface ProviderRankingApiDto {
  provider_id?: string | null;
  provider_code?: string | null;
  provider_name?: string | null;
  provider_type?: string | null;
  total_claims?: number | string | null;
  high_risk_claims?: number | string | null;
  average_score?: number | string | null;
  total_claimed_amount?: number | string | null;
  is_restricted?: boolean | null;
}

export interface ProviderDashboardSummaryApiDto {
  items?: ProviderRankingApiDto[];
}

export interface AlertRankingApiDto {
  code?: string | null;
  title?: string | null;
  severity?: string | null;
  occurrences?: number | string | null;
  total_points?: number | string | null;
}

export interface AlertDashboardSummaryApiDto {
  items?: AlertRankingApiDto[];
}

export interface ReviewStatusItemApiDto {
  status?: string | null;
  flow_status?: string | null;
  count?: number | string | null;
}

export interface BranchCountItemApiDto {
  branch?: string | null;
  ramo?: string | null;
  count?: number | string | null;
}

export interface CityCountItemApiDto {
  city?: string | null;
  ciudad?: string | null;
  count?: number | string | null;
}

export interface DashboardSummary {
  totalClaims: number;
  assessedClaims: number;
  pendingClaims: number;
  greenClaims: number;
  yellowClaims: number;
  redClaims: number;
  averageScore: number;
  totalClaimedAmount: number;
  highRiskAmount: number;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  label: string;
  count: number;
  percentage: number;
}

export interface TopRiskClaim {
  id: string;
  code: string;
  branch: string;
  coverage: string;
  finalScore: number;
  riskLevel: RiskLevel;
  flowStatus?: string | null;
  claimedAmount: number;
  totalAlerts: number;
  mainAlerts: string[];
}

export interface ProviderRankingItem {
  providerId: string;
  providerName: string;
  providerType: string;
  totalClaims: number;
  highRiskClaims: number;
  averageScore: number;
  totalClaimedAmount: number;
  isRestricted: boolean;
}

export interface CityAlertItem {
  city: string;
  totalClaims: number;
  highRiskClaims: number;
  averageScore: number;
}

export interface BranchRiskItem {
  branch: string;
  totalClaims: number;
}

export interface AlertRankingItem {
  code: string;
  title: string;
  severity: RiskLevel;
  occurrences: number;
  totalPoints: number;
}

export interface ReviewStatusItem {
  status: string;
  count: number;
}

export function mapDashboardSummaryFromApi(dto: DashboardSummaryApiDto): DashboardSummary {
  const distribution = mapRiskDistributionFromApi(dto);
  const totalClaims = Number(dto.total_claims ?? 0);
  const assessedClaims = Number(dto.assessed_claims ?? totalClaims);

  return {
    totalClaims,
    assessedClaims,
    pendingClaims: Math.max(0, totalClaims - assessedClaims),
    greenClaims: getCountForLevel(distribution, 'verde'),
    yellowClaims: getCountForLevel(distribution, 'amarillo'),
    redClaims: getCountForLevel(distribution, 'rojo') + getCountForLevel(distribution, 'critico'),
    averageScore: Math.round(Number(dto.average_score ?? 0)),
    totalClaimedAmount: Number(dto.total_claimed_amount ?? 0),
    highRiskAmount: Number(dto.high_risk_amount ?? 0),
  };
}

export function mapRiskDistributionFromApi(dto: DashboardSummaryApiDto): RiskDistributionItem[] {
  const items = dto.distribucion_nivel_riesgo?.length ? dto.distribucion_nivel_riesgo : dto.distribution ?? [];
  const normalizedItems = items.map((item) => ({
    level: normalizeRiskLevel(item.level ?? item.nivel_riesgo),
    count: Number(item.count ?? 0),
  }));
  const total = normalizedItems.reduce((sum, item) => sum + item.count, 0);

  return normalizedItems.map((item) => ({
    level: item.level,
    label: item.level,
    count: item.count,
    percentage: calculatePercentage(item.count, total),
  }));
}

export function mapTopRiskClaimFromApi(dto: ClaimListItemApiDto): TopRiskClaim {
  const claim = mapClaimFromApi(dto);
  return mapTopRiskClaimFromClaim(claim);
}

export function mapTopRiskClaimFromClaim(claim: Claim): TopRiskClaim {
  return {
    id: claim.id,
    code: claim.code,
    branch: claim.branch ?? 'Sin ramo',
    coverage: claim.coverage ?? 'Sin cobertura',
    finalScore: claim.score.finalScore,
    riskLevel: claim.score.level,
    flowStatus: claim.flowStatus,
    claimedAmount: claim.claimedAmount,
    totalAlerts: claim.totalAlerts,
    mainAlerts: claim.score.alerts.slice(0, 3).map((alert) => alert.title),
  };
}

export function mapProviderRankingFromApi(dto: ProviderRankingApiDto): ProviderRankingItem {
  const providerName = dto.provider_name ?? dto.provider_code ?? 'Sin proveedor';

  return {
    providerId: dto.provider_id ?? dto.provider_code ?? providerName,
    providerName,
    providerType: dto.provider_type ?? 'Sin tipo',
    totalClaims: Number(dto.total_claims ?? 0),
    highRiskClaims: Number(dto.high_risk_claims ?? 0),
    averageScore: Math.round(Number(dto.average_score ?? 0)),
    totalClaimedAmount: Number(dto.total_claimed_amount ?? 0),
    isRestricted: dto.is_restricted ?? false,
  };
}

export function mapAlertRankingFromApi(dto: AlertRankingApiDto): AlertRankingItem {
  return {
    code: dto.code ?? 'SIN-CODIGO',
    title: dto.title ?? dto.code ?? 'Indicador de revisión',
    severity: normalizeRiskLevel(dto.severity),
    occurrences: Number(dto.occurrences ?? 0),
    totalPoints: Number(dto.total_points ?? 0),
  };
}

export function mapReviewStatusFromApi(dto: ReviewStatusItemApiDto): ReviewStatusItem {
  return {
    status: dto.status ?? dto.flow_status ?? 'SIN_ESTADO',
    count: Number(dto.count ?? 0),
  };
}

export function mapBranchCountFromApi(dto: BranchCountItemApiDto): BranchRiskItem {
  return {
    branch: dto.branch ?? dto.ramo ?? 'Sin ramo',
    totalClaims: Number(dto.count ?? 0),
  };
}

export function mapCityCountFromApi(dto: CityCountItemApiDto): CityAlertItem {
  return {
    city: dto.city ?? dto.ciudad ?? 'Sin ciudad',
    totalClaims: Number(dto.count ?? 0),
    highRiskClaims: 0,
    averageScore: 0,
  };
}

function getCountForLevel(items: RiskDistributionItem[], level: RiskLevel): number {
  return items
    .filter((item) => item.level === level)
    .reduce((sum, item) => sum + item.count, 0);
}
