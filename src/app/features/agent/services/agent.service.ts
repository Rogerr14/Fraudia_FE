import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { AgentQueryRequest, AgentQueryResponse, SuggestedQuestion } from '../../core/models/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private http: HttpClientService) {}

  query(request: AgentQueryRequest): Observable<AgentQueryResponse> {
    return this.http.post<AgentQueryResponse>(API_ENDPOINTS.agent.query, request);
  }

  explainClaim(claimId: string, options?: any): Observable<AgentQueryResponse> {
    return this.http.post<AgentQueryResponse>(API_ENDPOINTS.agent.explain(claimId), options || { detail_level: 'business' });
  }

  getSuggestedQuestions(): Observable<{ items: SuggestedQuestion[] }> {
    return this.http.get<{ items: SuggestedQuestion[] }>(API_ENDPOINTS.agent.suggestedQuestions);
  }
}
