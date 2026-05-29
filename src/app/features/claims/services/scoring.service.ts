import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import { BatchAssessmentResult, mapBatchAssessmentFromApi } from '../../uploads/models/upload.model';
import { ClaimScore } from '../models/claim.model';
import { ClaimAssessmentRequest, ClaimsService } from './claims.service';

export interface BatchAssessmentRequest extends ClaimAssessmentRequest {}

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  constructor(
    private claimsService: ClaimsService,
    private http: HttpClientService,
  ) {}

  evaluateClaim(claimId: string): Observable<ClaimScore> {
    return this.claimsService.evaluateClaim(claimId);
  }

  evaluateBatch(request: Partial<BatchAssessmentRequest> = {}): Observable<BatchAssessmentResult> {
    return this.http
      .post<unknown>(API_ENDPOINTS.risk.assessAll, {
        include_ai_model: request.includeAiModel ?? true,
        include_nlp: request.includeNlp ?? true,
        force_recalculate: request.forceRecalculate ?? true,
      })
      .pipe(map((response) => mapBatchAssessmentFromApi(response)));
  }

  assessImportedDataset(importId: string, request: Partial<BatchAssessmentRequest> = {}): Observable<BatchAssessmentResult> {
    return this.http
      .post<unknown>(API_ENDPOINTS.uploads.assess(importId), {
        include_ai_model: request.includeAiModel ?? true,
        include_nlp: request.includeNlp ?? true,
        force_recalculate: request.forceRecalculate ?? true,
      })
      .pipe(map((response) => mapBatchAssessmentFromApi(response)));
  }
}
