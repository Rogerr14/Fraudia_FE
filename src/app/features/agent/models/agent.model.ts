export interface AgentContext {
  riskLevel?: string | null;
  claimId?: string | null;
  limit?: number;
}

export interface AgentQueryRequest {
  question: string;
  claimId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  useLlm?: boolean | null;
  context?: AgentContext;
}

export interface AgentQueryApiRequest {
  question: string;
  claim_id?: string | null;
  session_id?: string | null;
  user_id?: string | null;
  use_llm?: boolean | null;
  context?: {
    risk_level?: string | null;
    claim_id?: string | null;
    limit?: number;
  };
}

export interface AgentResponseApiDto {
  answer: string;
  session_id?: string | null;
  claim_id?: string | null;
  sources?: string[];
  used_llm?: boolean;
  disclaimer?: string;
}

export interface AgentQueryResponse {
  answer: string;
  sessionId?: string | null;
  claimId?: string | null;
  sources: string[];
  usedLlm: boolean;
  disclaimer: string;
}

export interface SuggestedQuestionApiDto {
  id?: string | null;
  question?: string | null;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
}

export interface ChatSessionApiDto {
  id?: string | null;
  title?: string | null;
  claim_id?: string | null;
  user_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ChatSession {
  id: string;
  title: string;
  claimId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ChatMessageApiDto {
  id?: string | null;
  role?: string | null;
  content?: string | null;
  answer?: string | null;
  question?: string | null;
  created_at?: string | null;
  sources?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  sources?: string[];
}

export function mapAgentRequestToApi(request: AgentQueryRequest): AgentQueryApiRequest {
  return {
    question: request.question,
    claim_id: request.claimId,
    session_id: request.sessionId,
    user_id: request.userId,
    use_llm: request.useLlm,
    context: request.context
      ? {
          risk_level: request.context.riskLevel,
          claim_id: request.context.claimId,
          limit: request.context.limit,
        }
      : undefined,
  };
}

export function mapAgentResponseFromApi(dto: AgentResponseApiDto): AgentQueryResponse {
  return {
    answer: dto.answer,
    sessionId: dto.session_id,
    claimId: dto.claim_id,
    sources: dto.sources ?? [],
    usedLlm: dto.used_llm ?? false,
    disclaimer:
      dto.disclaimer ??
      'La respuesta es una alerta o recomendación para revisión humana y no una acusación de fraude.',
  };
}

export function mapSuggestedQuestionFromApi(dto: SuggestedQuestionApiDto, index: number): SuggestedQuestion {
  return {
    id: dto.id ?? `question-${index + 1}`,
    question: dto.question ?? 'Pregunta sugerida',
  };
}

export function mapChatSessionFromApi(dto: ChatSessionApiDto): ChatSession {
  return {
    id: dto.id ?? crypto.randomUUID(),
    title: dto.title ?? 'Sesión sin título',
    claimId: dto.claim_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapChatMessageFromApi(dto: ChatMessageApiDto, index: number): ChatMessage {
  const role = dto.role === 'user' ? 'user' : 'assistant';
  const content = dto.content ?? dto.answer ?? dto.question ?? '';

  return {
    id: dto.id ?? `message-${index + 1}`,
    role,
    content,
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    sources: dto.sources ?? [],
  };
}
