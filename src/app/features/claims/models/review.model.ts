export interface ClaimReviewApiDto {
  id?: string | null;
  claim_id?: string | null;
  decision?: string | null;
  estado_resultante?: string | null;
  comentario?: string | null;
  user_id?: string | null;
  user_name?: string | null;
  created_at?: string | null;
}

export interface ReviewRequest {
  decision: string;
  estadoResultante: string;
  comentario?: string | null;
  userId?: string | null;
}

export interface ReviewHistoryItem {
  id: string;
  claimId: string;
  decision: string;
  estadoResultante: string;
  comentario?: string | null;
  reviewerName?: string | null;
  createdAt?: string | null;
}

export interface ClaimReviewResponse {
  review?: ReviewHistoryItem | null;
  message?: string | null;
}

export function mapReviewHistoryFromApi(dto: ClaimReviewApiDto): ReviewHistoryItem {
  return {
    id: dto.id ?? `${dto.claim_id ?? 'claim'}-${dto.created_at ?? Date.now()}`,
    claimId: dto.claim_id ?? '',
    decision: dto.decision ?? '',
    estadoResultante: dto.estado_resultante ?? '',
    comentario: dto.comentario,
    reviewerName: dto.user_name ?? dto.user_id,
    createdAt: dto.created_at,
  };
}
