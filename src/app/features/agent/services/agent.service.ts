import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import {
  AgentQueryApiResponse,
  AgentQueryRequest,
  AgentQueryResponse,
  SuggestedQuestion,
  mapAgentRequestToApi,
  mapAgentResponseFromApi,
} from '../models/agent.model';

// export const AGENT_USER_ID = '30802e66-afa3-4be1-9ef6-aa15baea763a';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private http: HttpClientService) {}

  query(request: AgentQueryRequest): Observable<AgentQueryResponse> {
    return this.http
      .post<AgentQueryApiResponse>(
        API_ENDPOINTS.agent.query,
        mapAgentRequestToApi({
          ...request,
          // userId: AGENT_USER_ID,
          useLlm: true,
        })
      )
      .pipe(map(mapAgentResponseFromApi));
  }

  explainClaim(claimId: string): Observable<AgentQueryResponse> {
    return this.query({
      claimId,
      question: `Explica las principales señales de riesgo del siniestro ${claimId}.`,
      useLlm: true,
    });
  }

  getSuggestedQuestions(): Observable<SuggestedQuestion[]> {
    return of([
      {
        id: 'critical-cases',
        question: '¿Cuáles son los siniestros con mayor prioridad de revisión?',
      },
      {
        id: 'provider-patterns',
        question: '¿Qué proveedores concentran más señales de riesgo?',
      },
      {
        id: 'rule-explanation',
        question: 'Explícame qué reglas generan más alertas rojas.',
      },
      {
        id: 'executive-summary',
        question: 'Genera un resumen ejecutivo para el supervisor de siniestros.',
      },
    ]).pipe(delay(80));
  }
}
