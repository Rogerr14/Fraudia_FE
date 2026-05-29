export interface RuleConditionApiDto {
  id?: string | number | null;
  name?: string | null;
  description?: string | null;
  evaluated_field?: string | null;
  field?: string | null;
  operator?: string | null;
  min_value?: number | null;
  max_value?: number | null;
  points?: number | null;
  result_description?: string | null;
}

export interface RuleApiDto {
  id?: string | number | null;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  max_score?: number | null;
  rule_type?: string | null;
  active?: boolean | null;
  conditions?: RuleConditionApiDto[];
}

export interface RuleCondition {
  id: string;
  name: string;
  evaluatedField: string;
  operator: string;
  minValue?: number;
  maxValue?: number;
  points: number;
  resultDescription: string;
}

export interface Rule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  maxScore: number;
  ruleType: string;
  active: boolean;
  conditions: RuleCondition[];
}

export function mapRuleFromApi(dto: RuleApiDto): Rule {
  return {
    id: String(dto.id ?? dto.code ?? crypto.randomUUID()),
    code: dto.code ?? 'SIN-CODIGO',
    name: dto.name ?? 'Regla de revisión',
    description: dto.description ?? 'Sin descripción disponible.',
    category: dto.category ?? 'General',
    maxScore: Number(dto.max_score ?? 0),
    ruleType: dto.rule_type ?? 'Regla',
    active: dto.active ?? false,
    conditions: (dto.conditions ?? []).map((condition, index) => ({
      id: String(condition.id ?? `${dto.code ?? 'rule'}-${index + 1}`),
      name: condition.name ?? `Condición ${index + 1}`,
      evaluatedField: condition.evaluated_field ?? condition.field ?? '-',
      operator: condition.operator ?? '-',
      minValue: condition.min_value ?? undefined,
      maxValue: condition.max_value ?? undefined,
      points: Number(condition.points ?? 0),
      resultDescription: condition.result_description ?? condition.description ?? 'Condición sin descripción.',
    })),
  };
}
