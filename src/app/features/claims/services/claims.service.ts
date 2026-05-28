import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Claim, ClaimDetail, ClaimScore, ClaimAlert, PaginatedResponse } from '../../core/models/claim.model';
import { ReviewHistoryItem, ReviewRequest } from '../../core/models/report.model';
import { PaginationParams } from '../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ClaimsService {
  constructor(private http: HttpClientService) {}

  listClaims(params?: any): Observable<PaginatedResponse<Claim>> {
    return this.http.get<PaginatedResponse<Claim>>(API_ENDPOINTS.claims.list, params);
  }

  getClaimDetail(claimId: string): Observable<ClaimDetail> {
    return this.http.get<ClaimDetail>(API_ENDPOINTS.claims.detail(claimId));
  }

  createClaim(claim: any): Observable<{ message: string; id_siniestro: string }> {
    return this.http.post<{ message: string; id_siniestro: string }>(API_ENDPOINTS.claims.create, claim);
  }

  updateClaim(claimId: string, data: any): Observable<{ message: string; id_siniestro: string }> {
    return this.http.put<{ message: string; id_siniestro: string }>(API_ENDPOINTS.claims.update(claimId), data);
  }

  evaluateClaim(claimId: string, options?: any): Observable<{ score: ClaimScore; alertas: ClaimAlert[] }> {
    return this.http.post<{ score: ClaimScore; alertas: ClaimAlert[] }>(
      API_ENDPOINTS.claims.evaluate(claimId),
      options || { include_ai_model: true, include_nlp: true }
    );
  }

  getClaimScore(claimId: string): Observable<ClaimScore> {
    return this.http.get<ClaimScore>(API_ENDPOINTS.claims.score(claimId));
  }

  getClaimAlerts(claimId: string): Observable<{ total_alertas: number; items: ClaimAlert[] }> {
    return this.http.get<{ total_alertas: number; items: ClaimAlert[] }>(API_ENDPOINTS.claims.alerts(claimId));
  }

  reviewClaim(claimId: string, review: ReviewRequest): Observable<{ message: string; estado_revision: string }> {
    return this.http.post<{ message: string; estado_revision: string }>(API_ENDPOINTS.claims.review(claimId), review);
  }

  getReviewHistory(claimId: string): Observable<{ items: ReviewHistoryItem[] }> {
    return this.http.get<{ items: ReviewHistoryItem[] }>(API_ENDPOINTS.claims.reviewHistory(claimId));
  }
}
