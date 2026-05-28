export interface AgentQueryRequest {
  question: string;
  context?: {
    nivel_riesgo?: string;
    limit?: number;
    [key: string]: any;
  };
}

export interface AgentQueryResponse {
  answer: string;
  data?: any[];
  disclaimer?: string;
}

export interface SuggestedQuestion {
  question: string;
}
