import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import { ClaimsService } from '../../claims/services/claims.service';
import { Claim, ClaimApiDto } from '../../claims/models/claim.model';
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

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private viewCache$: Observable<DashboardViewModel> | null = null;
  private analyticsCache$: Observable<Pick<DashboardViewModel, 'citiesAlerts' | 'branchRisk'>> | null = null;

  constructor(
    private http: HttpClientService,
    private claimsService: ClaimsService,
  ) {}

  /**
   * Carga rápida: summary, top claims, providers, alerts.
   * NO llama a listAllClaims — citiesAlerts y branchRisk llegan vacíos.
   * Usa getAnalyticsData() de forma lazy cuando el usuario abre el tab Análisis.
   */
  getDashboardView(): Observable<DashboardViewModel> {
    if (!this.viewCache$) {
      this.viewCache$ = forkJoin({
        summaryDto: this.getSummaryDto(),
        topRiskClaims: this.getTopRiskClaims(),
        providersRanking: this.getProvidersRanking(),
        alertRanking: this.getAlertRanking(),
      }).pipe(
        map(({ summaryDto, topRiskClaims, providersRanking, alertRanking }) => ({
          summary: mapDashboardSummaryFromApi(summaryDto),
          riskDistribution: mapRiskDistributionFromApi(summaryDto),
          topRiskClaims,
          providersRanking,
          alertRanking,
          citiesAlerts: [],
          branchRisk: [],
        })),
        shareReplay(1),
      );
    }
    return this.viewCache$;
  }

  /**
   * Carga lazy de datos analíticos (branchRisk, citiesAlerts).
   * Solo se llama cuando el usuario abre el tab "Análisis & Gráficas".
   * Resultado cacheado: la segunda visita no hace petición.
   */
  getAnalyticsData(): Observable<Pick<DashboardViewModel, 'citiesAlerts' | 'branchRisk'>> {
    if (!this.analyticsCache$) {
      this.analyticsCache$ = this.claimsService.listAllClaims().pipe(
        map((claims) => ({
          citiesAlerts: this.buildCitiesAlerts(claims),
          branchRisk: this.buildBranchRisk(claims),
        })),
        shareReplay(1),
      );
    }
    return this.analyticsCache$;
  }

  /** Invalida ambos cachés para forzar re-fetch en la próxima visita. */
  invalidateCache(): void {
    this.viewCache$ = null;
    this.analyticsCache$ = null;
  }

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

  private buildCitiesAlerts(claims: Claim[]): CityAlertItem[] {
    const groups = new Map<string, { total: number; high: number; score: number }>();
    for (const claim of claims) {
      const city = claim.office || 'Sin ciudad';
      const cur = groups.get(city) ?? { total: 0, high: 0, score: 0 };
      cur.total += 1;
      cur.high += claim.score.level === 'rojo' || claim.score.level === 'critico' ? 1 : 0;
      cur.score += claim.score.finalScore;
      groups.set(city, cur);
    }
    return Array.from(groups.entries()).map(([city, item]) => ({
      city,
      totalClaims: item.total,
      highRiskClaims: item.high,
      averageScore: item.total ? Math.round(item.score / item.total) : 0,
    }));
  }

  private buildBranchRisk(claims: Claim[]): BranchRiskItem[] {
    const groups = new Map<string, { total: number; red: number; yellow: number; score: number }>();
    for (const claim of claims) {
      const branch = claim.branch || 'Sin ramo';
      const cur = groups.get(branch) ?? { total: 0, red: 0, yellow: 0, score: 0 };
      cur.total += 1;
      cur.red += claim.score.level === 'rojo' || claim.score.level === 'critico' ? 1 : 0;
      cur.yellow += claim.score.level === 'amarillo' ? 1 : 0;
      cur.score += claim.score.finalScore;
      groups.set(branch, cur);
    }
    return Array.from(groups.entries()).map(([branch, item]) => ({
      branch,
      totalClaims: item.total,
      redClaims: item.red,
      yellowClaims: item.yellow,
      averageScore: item.total ? Math.round(item.score / item.total) : 0,
    }));
  }

  private getSummaryDto(): Observable<DashboardSummaryApiDto> {
    return this.http.get<DashboardSummaryApiDto>(API_ENDPOINTS.analytics.summary);
  }
}
