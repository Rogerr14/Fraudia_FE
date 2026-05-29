import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import {
  AgentQueryRequest,
  AgentQueryResponse,
  AgentResponseApiDto,
  ChatMessage,
  ChatMessageApiDto,
  ChatSession,
  ChatSessionApiDto,
  SuggestedQuestion,
  SuggestedQuestionApiDto,
  mapAgentRequestToApi,
  mapAgentResponseFromApi,
  mapChatMessageFromApi,
  mapChatSessionFromApi,
  mapSuggestedQuestionFromApi,
} from '../models/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private suggestedQuestions$: Observable<SuggestedQuestion[]> | null = null;

  constructor(private http: HttpClientService) {}

  query(request: AgentQueryRequest): Observable<AgentQueryResponse> {
    return this.http
      .post<AgentResponseApiDto>(API_ENDPOINTS.agent.query, mapAgentRequestToApi({ ...request, useLlm: request.useLlm ?? true }))
      .pipe(map(mapAgentResponseFromApi));
  }

  createSession(title?: string | null, claimId?: string | null, userId?: string | null): Observable<ChatSession> {
    return this.http
      .post<ChatSessionApiDto>(API_ENDPOINTS.agent.sessions, {
        title: title ?? null,
        claim_id: claimId ?? null,
        user_id: userId ?? null,
      })
      .pipe(map(mapChatSessionFromApi));
  }

  getSessions(): Observable<ChatSession[]> {
    return this.http
      .get<ChatSessionApiDto[]>(API_ENDPOINTS.agent.sessions)
      .pipe(map((sessions) => (sessions ?? []).map(mapChatSessionFromApi)));
  }

  getSessionMessages(sessionId: string): Observable<ChatMessage[]> {
    return this.http
      .get<ChatMessageApiDto[]>(API_ENDPOINTS.agent.sessionMessages(sessionId))
      .pipe(map((messages) => (messages ?? []).map(mapChatMessageFromApi)));
  }

  getSuggestedQuestions(): Observable<SuggestedQuestion[]> {
    if (!this.suggestedQuestions$) {
      this.suggestedQuestions$ = this.http
        .get<SuggestedQuestionApiDto[]>(API_ENDPOINTS.agent.suggestedQuestions)
        .pipe(map((questions) => (questions ?? []).map(mapSuggestedQuestionFromApi)), shareReplay(1));
    }

    return this.suggestedQuestions$;
  }

  explainClaim(claimId: string): Observable<AgentQueryResponse> {
    return this.http
      .post<AgentResponseApiDto>(API_ENDPOINTS.agent.explainClaim(claimId), {})
      .pipe(map(mapAgentResponseFromApi));
  }
}
