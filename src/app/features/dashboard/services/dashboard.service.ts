import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import { ClaimListItemApiDto } from '../../claims/models/claim.model';
import {
  AlertDashboardSummaryApiDto,
  AlertRankingApiDto,
  AlertRankingItem,
  BranchCountItemApiDto,
  BranchRiskItem,
  CityAlertItem,
  CityCountItemApiDto,
  DashboardSummary,
  DashboardSummaryApiDto,
  ProviderDashboardSummaryApiDto,
  ProviderRankingApiDto,
  ProviderRankingItem,
  ReviewStatusItem,
  ReviewStatusItemApiDto,
  RiskDistributionItem,
  TopRiskClaim,
  mapAlertRankingFromApi,
  mapBranchCountFromApi,
  mapCityCountFromApi,
  mapDashboardSummaryFromApi,
  mapProviderRankingFromApi,
  mapReviewStatusFromApi,
  mapRiskDistributionFromApi,
  mapTopRiskClaimFromApi,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private summaryDto$: Observable<DashboardSummaryApiDto> | null = null;

  constructor(private http: HttpClientService) {}

  getSummary(): Observable<DashboardSummary> {
    return this.getSummaryDto().pipe(map(mapDashboardSummaryFromApi));
  }

  getRiskDistribution(): Observable<RiskDistributionItem[]> {
    return this.getSummaryDto().pipe(map(mapRiskDistributionFromApi));
  }

  getTopRiskClaims(limit = 10): Observable<TopRiskClaim[]> {
    return this.http
      .get<ClaimListItemApiDto[]>(API_ENDPOINTS.risk.topClaims, { limit })
      .pipe(map((claims) => (claims ?? []).map(mapTopRiskClaimFromApi)));
  }

  getProvidersRanking(limit = 10): Observable<ProviderRankingItem[]> {
    return this.http
      .get<ProviderDashboardSummaryApiDto | ProviderRankingApiDto[]>(API_ENDPOINTS.analytics.providers, { limit })
      .pipe(
        map((response) => {
          const items = Array.isArray(response) ? response : response.items ?? [];
          return items.map(mapProviderRankingFromApi);
        }),
      );
  }

  getAlertRanking(limit = 10): Observable<AlertRankingItem[]> {
    return this.http
      .get<AlertDashboardSummaryApiDto | AlertRankingApiDto[]>(API_ENDPOINTS.analytics.alerts, { limit })
      .pipe(
        map((response) => {
          const items = Array.isArray(response) ? response : response.items ?? [];
          return items.map(mapAlertRankingFromApi);
        }),
      );
  }

  getReviewStatus(): Observable<ReviewStatusItem[]> {
    return this.http
      .get<ReviewStatusItemApiDto[]>(API_ENDPOINTS.analytics.reviewStatus)
      .pipe(map((items) => (items ?? []).map(mapReviewStatusFromApi)));
  }

  getBranches(): Observable<BranchRiskItem[]> {
    return this.http
      .get<BranchCountItemApiDto[]>(API_ENDPOINTS.analytics.branches)
      .pipe(map((items) => (items ?? []).map(mapBranchCountFromApi)));
  }

  getCities(): Observable<CityAlertItem[]> {
    return this.http
      .get<CityCountItemApiDto[]>(API_ENDPOINTS.analytics.cities)
      .pipe(map((items) => (items ?? []).map(mapCityCountFromApi)));
  }

  private getSummaryDto(): Observable<DashboardSummaryApiDto> {
    if (!this.summaryDto$) {
      this.summaryDto$ = this.http.get<DashboardSummaryApiDto>(API_ENDPOINTS.analytics.summary).pipe(shareReplay(1));
    }

    return this.summaryDto$;
  }
}
