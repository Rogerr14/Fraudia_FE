import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

interface EvaluateBatchRequest {
  id_siniestros: string[];
  include_ai_model?: boolean;
  include_nlp?: boolean;
}

interface EvaluateBatchResponse {
  message: string;
  summary: {
    total: number;
    processed: number;
    failed: number;
    green: number;
    yellow: number;
    red: number;
  };
  results: Array<{
    id_siniestro: string;
    score_final: number;
    nivel_riesgo: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  constructor(private http: HttpClientService) {}

  evaluateBatch(request: EvaluateBatchRequest): Observable<EvaluateBatchResponse> {
    return this.http.post<EvaluateBatchResponse>(API_ENDPOINTS.scoring.evaluateBatch, request);
  }
}
