export interface RuleCondition {
  id_condicion: number;
  nombre_condicion: string;
  campo_evaluado: string;
  operador: string;
  valor_min?: number;
  valor_max?: number;
  puntaje: number;
  descripcion_resultado: string;
}

export interface Rule {
  id_regla: number;
  codigo_regla: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  puntaje_maximo: number;
  tipo_regla: string;
  activa: boolean;
  condiciones?: RuleCondition[];
}
