import { RiskLevel } from '../../../core/models/common.model';
import { Claim, ClaimApiDto, mapClaimFromApi } from '../../claims/models/claim.model';
import { calculatePercentage, normalizeRiskLevel } from '../../../shared/utils/risk.util';

export interface RiskDistributionApiDto {
  level: string;
  count: number;
}

export interface DashboardSummaryApiDto {
  total_claims: number;
  assessed_claims: number;
  average_score: number;
  total_claimed_amount: number | string;
  high_risk_amount: number | string;
  distribution: RiskDistributionApiDto[];
}

export interface ProviderRankingApiDto {
  provider_id: string;
  provider_name: string;
  provider_type: string;
  total_claims: number;
  high_risk_claims: number;
  average_score: number;
  total_claimed_amount: number | string;
  is_restricted: boolean;
}

export interface AlertRankingApiDto {
  code: string;
  title: string;
  severity: string;
  occurrences: number;
  total_points: number;
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
  branch: string;
  coverage: string;
  finalScore: number;
  riskLevel: RiskLevel;
  claimedAmount: number;
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
  redClaims: number;
  yellowClaims: number;
  averageScore: number;
}

export interface AlertRankingItem {
  code: string;
  title: string;
  severity: RiskLevel;
  occurrences: number;
  totalPoints: number;
}

export interface DashboardViewModel {
  summary: DashboardSummary;
  riskDistribution: RiskDistributionItem[];
  topRiskClaims: TopRiskClaim[];
  branchRisk: BranchRiskItem[];
  alertRanking: AlertRankingItem[];
}

export function mapDashboardSummaryFromApi(dto: DashboardSummaryApiDto): DashboardSummary {
  const greenClaims = getDistributionCount(dto.distribution, 'verde');
  const yellowClaims = getDistributionCount(dto.distribution, 'amarillo');
  const redClaims = getDistributionCount(dto.distribution, 'rojo') + getDistributionCount(dto.distribution, 'critico');

  return {
    totalClaims: dto.total_claims,
    assessedClaims: dto.assessed_claims,
    pendingClaims: Math.max(0, dto.total_claims - dto.assessed_claims),
    greenClaims,
    yellowClaims,
    redClaims,
    averageScore: Math.round(dto.average_score ?? 0),
    totalClaimedAmount: Number(dto.total_claimed_amount ?? 0),
    highRiskAmount: Number(dto.high_risk_amount ?? 0),
  };
}

export function mapRiskDistributionFromApi(dto: DashboardSummaryApiDto): RiskDistributionItem[] {
  const total = dto.distribution.reduce((sum, item) => sum + item.count, 0);
  return dto.distribution.map((item) => {
    const level = normalizeRiskLevel(item.level);
    return {
      level,
      label: level,
      count: item.count,
      percentage: calculatePercentage(item.count, total),
    };
  });
}

export function mapTopRiskClaimFromApi(dto: ClaimApiDto): TopRiskClaim {
  const claim = mapClaimFromApi(dto);
  return mapTopRiskClaimFromClaim(claim);
}

export function mapTopRiskClaimFromClaim(claim: Claim): TopRiskClaim {
  return {
    id: claim.id,
    branch: claim.branch ?? 'Sin ramo',
    coverage: claim.coverage ?? 'Sin cobertura',
    finalScore: claim.score.finalScore,
    riskLevel: claim.score.level,
    claimedAmount: claim.claimedAmount,
    mainAlerts: claim.score.alerts.slice(0, 3).map((alert) => alert.title),
  };
}

export function mapProviderRankingFromApi(dto: ProviderRankingApiDto): ProviderRankingItem {
  return {
    providerId: dto.provider_id,
    providerName: dto.provider_name,
    providerType: dto.provider_type,
    totalClaims: dto.total_claims,
    highRiskClaims: dto.high_risk_claims,
    averageScore: Math.round(dto.average_score ?? 0),
    totalClaimedAmount: Number(dto.total_claimed_amount ?? 0),
    isRestricted: dto.is_restricted,
  };
}

export function mapAlertRankingFromApi(dto: AlertRankingApiDto): AlertRankingItem {
  return {
    code: dto.code,
    title: dto.title,
    severity: normalizeRiskLevel(dto.severity),
    occurrences: dto.occurrences,
    totalPoints: dto.total_points,
  };
}

function getDistributionCount(items: RiskDistributionApiDto[], level: RiskLevel): number {
  return items
    .filter((item) => normalizeRiskLevel(item.level) === level)
    .reduce((sum, item) => sum + item.count, 0);
}
