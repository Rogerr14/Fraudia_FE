import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import { ClaimsService } from '../../claims/services/claims.service';
import {
  AlertRankingApiDto,
  AlertRankingItem,
  BranchRiskItem,
  CityAlertItem,
  DashboardSummary,
  DashboardSummaryApiDto,
  DashboardViewModel,
  ProviderRankingApiDto,
  ProviderRankingItem,
  RiskDistributionItem,
  TopRiskClaim,
  mapAlertRankingFromApi,
  mapDashboardSummaryFromApi,
  mapProviderRankingFromApi,
  mapRiskDistributionFromApi,
  mapTopRiskClaimFromApi,
} from '../models/dashboard.model';
import { ClaimApiDto } from '../../claims/models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private http: HttpClientService,
    private claimsService: ClaimsService
  ) {}

  getSummary(): Observable<DashboardSummary> {
    return this.getSummaryDto().pipe(map(mapDashboardSummaryFromApi));
  }

  getRiskDistribution(): Observable<RiskDistributionItem[]> {
    return this.getSummaryDto().pipe(map(mapRiskDistributionFromApi));
  }

  getTopRiskClaims(limit = 10): Observable<TopRiskClaim[]> {
    return this.http
      .get<ClaimApiDto[]>(API_ENDPOINTS.risk.topClaims, { limit })
      .pipe(map((claims) => claims.map(mapTopRiskClaimFromApi)));
  }

  getProvidersRanking(limit = 10): Observable<ProviderRankingItem[]> {
    return this.http
      .get<ProviderRankingApiDto[]>(API_ENDPOINTS.analytics.providers, { limit })
      .pipe(map((items) => items.map(mapProviderRankingFromApi)));
  }

  getAlertRanking(limit = 10): Observable<AlertRankingItem[]> {
    return this.http
      .get<AlertRankingApiDto[]>(API_ENDPOINTS.analytics.alerts, { limit })
      .pipe(map((items) => items.map(mapAlertRankingFromApi)));
  }

  getCitiesAlerts(): Observable<CityAlertItem[]> {
    return this.claimsService.listAllClaims().pipe(
      map((claims) => {
        const groups = new Map<string, { total: number; high: number; score: number }>();
        claims.forEach((claim) => {
          const city = claim.office || 'Sin ciudad';
          const current = groups.get(city) ?? { total: 0, high: 0, score: 0 };
          current.total += 1;
          current.high += claim.score.level === 'rojo' || claim.score.level === 'critico' ? 1 : 0;
          current.score += claim.score.finalScore;
          groups.set(city, current);
        });

        return Array.from(groups.entries()).map(([city, item]) => ({
          city,
          totalClaims: item.total,
          highRiskClaims: item.high,
          averageScore: item.total ? Math.round(item.score / item.total) : 0,
        }));
      })
    );
  }

  getBranchesRisk(): Observable<BranchRiskItem[]> {
    return this.claimsService.listAllClaims().pipe(
      map((claims) => {
        const groups = new Map<string, { total: number; red: number; yellow: number; score: number }>();
        claims.forEach((claim) => {
          const branch = claim.branch || 'Sin ramo';
          const current = groups.get(branch) ?? { total: 0, red: 0, yellow: 0, score: 0 };
          current.total += 1;
          current.red += claim.score.level === 'rojo' || claim.score.level === 'critico' ? 1 : 0;
          current.yellow += claim.score.level === 'amarillo' ? 1 : 0;
          current.score += claim.score.finalScore;
          groups.set(branch, current);
        });

        return Array.from(groups.entries()).map(([branch, item]) => ({
          branch,
          totalClaims: item.total,
          redClaims: item.red,
          yellowClaims: item.yellow,
          averageScore: item.total ? Math.round(item.score / item.total) : 0,
        }));
      })
    );
  }

  getDashboardView(): Observable<DashboardViewModel> {
    return forkJoin({
      summaryDto: this.getSummaryDto(),
      topRiskClaims: this.getTopRiskClaims(),
      providersRanking: this.getProvidersRanking(),
      alertRanking: this.getAlertRanking(),
      citiesAlerts: this.getCitiesAlerts(),
      branchRisk: this.getBranchesRisk(),
    }).pipe(
      map(({ summaryDto, topRiskClaims, providersRanking, alertRanking, citiesAlerts, branchRisk }) => ({
        summary: mapDashboardSummaryFromApi(summaryDto),
        riskDistribution: mapRiskDistributionFromApi(summaryDto),
        topRiskClaims,
        providersRanking,
        alertRanking,
        citiesAlerts,
        branchRisk,
      }))
    );
  }

  private getSummaryDto(): Observable<DashboardSummaryApiDto> {
    return this.http.get<DashboardSummaryApiDto>(API_ENDPOINTS.analytics.summary);
  }
}
