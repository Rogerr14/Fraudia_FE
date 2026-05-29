import { RiskLevel } from '../models/common.model';
import { normalizeRiskLevel } from '../../shared/utils/risk.util';
import { firstNonEmpty, toNumber } from './mapper.utils';

export interface RiskAlertApiDto {
  id?: string | null;
  claim_id?: string | null;
  assessment_id?: string | null;
  code?: string | null;
  title?: string | null;
  rule_name?: string | null;
  category?: string | null;
  description?: string | null;
  points?: number | null;
  severity?: string | null;
  detected_value?: string | null;
  recommendation?: string | null;
  generated_at?: string | null;
}

export interface ClaimAlert {
  id?: string | null;
  code: string;
  title: string;
  ruleName?: string | null;
  category: string;
  description: string;
  points: number;
  severity: RiskLevel;
  detectedValue?: string | null;
  recommendation?: string | null;
  generatedAt?: string | null;
}

export function mapAlertFromApi(dto: RiskAlertApiDto, fallbackCategory = 'general'): ClaimAlert {
  const title = firstNonEmpty(dto.title, dto.rule_name, dto.code, dto.category) ?? 'Alerta de revisión';

  return {
    id: dto.id,
    code: dto.code ?? 'SIN-CODIGO',
    title,
    ruleName: dto.rule_name,
    category: dto.category ?? fallbackCategory,
    description: dto.description ?? 'Se detectó una señal que requiere revisión humana.',
    points: toNumber(dto.points),
    severity: normalizeRiskLevel(dto.severity),
    detectedValue: dto.detected_value,
    recommendation: dto.recommendation ?? 'Validar el caso con evidencia adicional antes de decidir.',
    generatedAt: dto.generated_at,
  };
}
