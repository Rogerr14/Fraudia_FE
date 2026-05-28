import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import {
  DashboardSummary,
  RiskDistributionItem,
  TopRiskClaim,
  ProviderRankingItem,
  CityAlert,
  BranchRisk,
} from '../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClientService) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(API_ENDPOINTS.dashboard.summary);
  }

  getRiskDistribution(): Observable<{ items: RiskDistributionItem[] }> {
    return this.http.get<{ items: RiskDistributionItem[] }>(API_ENDPOINTS.dashboard.riskDistribution);
  }

  getTopRiskClaims(limit: number = 10): Observable<{ items: TopRiskClaim[] }> {
    return this.http.get<{ items: TopRiskClaim[] }>(API_ENDPOINTS.dashboard.topRiskClaims, { limit });
  }

  getProvidersRanking(): Observable<{ items: ProviderRankingItem[] }> {
    return this.http.get<{ items: ProviderRankingItem[] }>(API_ENDPOINTS.dashboard.providersRanking);
  }

  getCitiesAlerts(): Observable<{ items: CityAlert[] }> {
    return this.http.get<{ items: CityAlert[] }>(API_ENDPOINTS.dashboard.citiesAlerts);
  }

  getBranchesRisk(): Observable<{ items: BranchRisk[] }> {
    return this.http.get<{ items: BranchRisk[] }>(API_ENDPOINTS.dashboard.branchesRisk);
  }
}
