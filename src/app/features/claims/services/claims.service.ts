import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { mapAssessmentFromApi } from '../../../core/mappers/assessment.mapper';
import { mapClaimAlertsPayload } from '../../../core/mappers/claim.mapper';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { QueryParams } from '../../../core/models/api-response.model';
import { HttpClientService } from '../../../core/services/http-client.service';
import {
  Claim,
  ClaimAlert,
  ClaimDetail,
  ClaimDetailApiDto,
  ClaimFilters,
  ClaimListResponseApiDto,
  ClaimScore,
  mapClaimDetailFromApi,
  mapClaimListResponseFromApi,
} from '../models/claim.model';
import {
  ClaimReviewApiDto,
  ClaimReviewResponse,
  ReviewHistoryItem,
  ReviewRequest,
  mapReviewHistoryFromApi,
} from '../models/review.model';

export interface ClaimAssessmentRequest {
  includeAiModel: boolean;
  includeNlp: boolean;
  forceRecalculate: boolean;
  useEmbeddings?: boolean;
}

const DEFAULT_ASSESSMENT_REQUEST: ClaimAssessmentRequest = {
  includeAiModel: true,
  includeNlp: true,
  forceRecalculate: true,
  useEmbeddings: false,
};

@Injectable({
  providedIn: 'root',
})
export class ClaimsService {
  constructor(private http: HttpClientService) {}

  listClaims(filters: ClaimFilters): Observable<PaginatedResult<Claim>> {
    const page = Math.max(filters.page, 1);
    const limit = Math.max(filters.limit, 1);

    return this.http.get<ClaimListResponseApiDto>(API_ENDPOINTS.claims.list, this.buildClaimListParams(filters)).pipe(
      map((response) => {
        const mapped = mapClaimListResponseFromApi(response, page, limit);
        const totalPages = Math.max(1, Math.ceil(mapped.total / limit));

        return {
          items: mapped.items,
          total: mapped.total,
          limit,
          offset: (page - 1) * limit,
          page: mapped.page || page,
          totalPages,
        };
      }),
    );
  }

  listAllClaims(limit = 200): Observable<Claim[]> {
    return this.listClaims({ page: 1, limit }).pipe(map((result) => result.items));
  }

  getClaimDetail(claimId: string): Observable<ClaimDetail> {
    return this.http.get<ClaimDetailApiDto>(API_ENDPOINTS.claims.detail(claimId)).pipe(map(mapClaimDetailFromApi));
  }

  getClaimAssessment(claimId: string): Observable<ClaimScore> {
    return this.http
      .get<unknown>(API_ENDPOINTS.claims.assessment(claimId))
      .pipe(map((response) => mapAssessmentFromApi(response)));
  }

  evaluateClaim(claimId: string, request: Partial<ClaimAssessmentRequest> = {}): Observable<ClaimScore> {
    const payload = { ...DEFAULT_ASSESSMENT_REQUEST, ...request };

    return this.http
      .post<unknown>(
        API_ENDPOINTS.claims.assess(claimId),
        {
          include_ai_model: payload.includeAiModel,
          include_nlp: payload.includeNlp,
          force_recalculate: payload.forceRecalculate,
        },
        {
          use_embeddings: payload.useEmbeddings ?? false,
        },
      )
      .pipe(map((response) => mapAssessmentFromApi(response)));
  }

  getClaimAlerts(claimId: string): Observable<ClaimAlert[]> {
    return this.http
      .get<unknown>(API_ENDPOINTS.claims.alerts(claimId))
      .pipe(map((response) => mapClaimAlertsPayload(response)));
  }

  submitReview(claimId: string, review: ReviewRequest): Observable<ClaimReviewResponse> {
    return this.http.post<unknown>(API_ENDPOINTS.claims.review(claimId), {
      decision: review.decision,
      estado_resultante: review.estadoResultante,
      comentario: review.comentario ?? null,
      user_id: review.userId ?? null,
    }).pipe(
      map((response) => {
        const reviewRecord = response && typeof response === 'object' ? (response as Record<string, unknown>)['review'] : null;

        return {
          review:
            reviewRecord && typeof reviewRecord === 'object'
              ? mapReviewHistoryFromApi(reviewRecord as ClaimReviewApiDto)
              : null,
          message:
            response && typeof response === 'object' && typeof (response as Record<string, unknown>)['message'] === 'string'
              ? ((response as Record<string, unknown>)['message'] as string)
              : null,
        };
      }),
    );
  }

  getReviewHistory(claimId: string): Observable<ReviewHistoryItem[]> {
    return this.http
      .get<ClaimReviewApiDto[]>(API_ENDPOINTS.claims.reviewHistory(claimId))
      .pipe(map((history) => (history ?? []).map(mapReviewHistoryFromApi)));
  }

  private buildClaimListParams(filters: ClaimFilters): QueryParams {
    return {
      page: Math.max(filters.page, 1),
      limit: Math.max(filters.limit, 1),
      risk_level: filters.riskLevel,
      flow_status: filters.flowStatus,
      branch: filters.branch,
      coverage: filters.coverage,
      city: filters.city,
      provider_id: filters.providerId,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder,
    };
  }
}
