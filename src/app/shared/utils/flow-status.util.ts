import { BadgeVariant } from '../../core/models/common.model';

export type FlowStatus =
  | 'PENDING_REVIEW'
  | 'IN_REVIEW'
  | 'PENDING_DOCUMENTS'
  | 'ESCALATED_ANTIFRAUD'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED';

export function normalizeFlowStatus(value: string | null | undefined): FlowStatus | 'UNKNOWN' {
  const normalized = (value ?? '').trim().toUpperCase();

  switch (normalized) {
    case 'PENDING_REVIEW':
    case 'IN_REVIEW':
    case 'PENDING_DOCUMENTS':
    case 'ESCALATED_ANTIFRAUD':
    case 'APPROVED':
    case 'REJECTED':
    case 'CLOSED':
      return normalized;
    default:
      return 'UNKNOWN';
  }
}

export function getFlowStatusLabel(value: string | null | undefined): string {
  const status = normalizeFlowStatus(value);
  const labels: Record<typeof status, string> = {
    PENDING_REVIEW: 'Pendiente de revisión',
    IN_REVIEW: 'En revisión',
    PENDING_DOCUMENTS: 'Pendiente de documentos',
    ESCALATED_ANTIFRAUD: 'Escalado a antifraude',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    CLOSED: 'Cerrado',
    UNKNOWN: 'Sin estado',
  };

  return labels[status];
}

export function getFlowStatusVariant(value: string | null | undefined): BadgeVariant {
  const status = normalizeFlowStatus(value);

  switch (status) {
    case 'APPROVED':
    case 'CLOSED':
      return 'success';
    case 'PENDING_DOCUMENTS':
    case 'PENDING_REVIEW':
      return 'warning';
    case 'ESCALATED_ANTIFRAUD':
    case 'REJECTED':
      return 'danger';
    case 'IN_REVIEW':
      return 'info';
    default:
      return 'neutral';
  }
}
