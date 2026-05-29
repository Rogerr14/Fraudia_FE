import { RiskLevel } from '../models/common.model';
import { getRiskLevelFromScore, normalizeRiskLevel } from '../../shared/utils/risk.util';
import { ClaimAlert, RiskAlertApiDto, mapAlertFromApi } from './alert.mapper';
import { asArray, asRecord, toBoolean, toNumber } from './mapper.utils';

export interface RiskAssessmentApiDto {
  score_rules?: string | null;
  score_ai_model?: string | null;
  score_nlp?: string | null;
  score?: string | null;
  level?: string | null;
  suggested_action?: string | null;
  explanation?: string | null;
  recommendation?: string | null;
  ethical_disclaimer?: string | null;
  model_version?: string | null;
  reviewed_by_analyst?: boolean;
  calculated_at?: string | null;
  alerts?: RiskAlertApiDto[];
}

export interface ClaimScore {
  finalScore: number;
  rulesScore: number;
  aiScore: number;
  nlpScore: number;
  level: RiskLevel;
  suggestedAction: string;
  recommendation: string;
  explanation: string;
  ethicalDisclaimer: string;
  reviewedByAnalyst: boolean;
  calculatedAt?: string | null;
  modelVersion?: string | null;
  alerts: ClaimAlert[];
}

export function mapAssessmentFromApi(payload: unknown, fallbackRiskLevel?: string | null): ClaimScore {
  const dto = unwrapAssessmentPayload(payload);
  const finalScore = toNumber(dto?.score);
  const normalizedLevel = normalizeRiskLevel(dto?.level ?? fallbackRiskLevel ?? getRiskLevelFromScore(finalScore));
  const rulesScore = toNumber(dto?.score_rules);
  const aiScore = toNumber(dto?.score_ai_model);
  const nlpScore = toNumber(dto?.score_nlp);

  return {
    finalScore,
    rulesScore: rulesScore || finalScore,
    aiScore: aiScore || finalScore,
    nlpScore: nlpScore || finalScore,
    level: normalizedLevel,
    suggestedAction: dto?.suggested_action ?? 'Priorizar el caso según revisión humana.',
    recommendation:
      dto?.recommendation ?? 'La IA sugiere una alerta de revisión. Valida la evidencia antes de decidir.',
    explanation: dto?.explanation ?? 'Aún no existe una evaluación disponible para este siniestro.',
    ethicalDisclaimer:
      dto?.ethical_disclaimer ??
      'La evaluación es una alerta o recomendación para revisión humana y no constituye una acusación de fraude.',
    reviewedByAnalyst: toBoolean(dto?.reviewed_by_analyst),
    calculatedAt: dto?.calculated_at,
    modelVersion: dto?.model_version,
    alerts: asArray<RiskAlertApiDto>(dto?.alerts).map((alert) => mapAlertFromApi(alert, 'riesgo')),
  };
}

function unwrapAssessmentPayload(payload: unknown): RiskAssessmentApiDto | null {
  const direct = asRecord(payload);
  if (!direct) {
    return null;
  }

  const nestedAssessment = asRecord(direct['assessment']);
  if (nestedAssessment) {
    return nestedAssessment as RiskAssessmentApiDto;
  }

  const nestedRiskAssessment = asRecord(direct['risk_assessment']);
  if (nestedRiskAssessment) {
    return nestedRiskAssessment as RiskAssessmentApiDto;
  }

  return direct as RiskAssessmentApiDto;
}
