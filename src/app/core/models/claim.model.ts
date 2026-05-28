export interface Policy {
  id_poliza: string;
  fecha_inicio: string;
  fecha_fin: string;
  suma_asegurada: number;
  estado_poliza: string;
}

export interface Insured {
  id_asegurado: string;
  segmento: string;
  ciudad: string;
  reclamos_ultimos_12_meses: number;
}

export interface Vehicle {
  id_vehiculo: string;
  marca: string;
  modelo: string;
  anio: number;
}

export interface Provider {
  id_proveedor: string;
  tipo?: string;
  nombre?: string;
  ciudad?: string;
  en_lista_restrictiva?: boolean;
}

export interface DocumentItem {
  id_documento: string;
  tipo_documento: string;
  entregado: boolean;
  legible: boolean;
  inconsistencia_detectada: boolean;
}

export interface ClaimScore {
  score_reglas: number;
  score_modelo_ia: number;
  score_nlp: number;
  score_final: number;
  nivel_riesgo: 'Verde' | 'Amarillo' | 'Rojo';
  recomendacion?: string;
  explicacion?: string;
  fecha_calculo?: string;
}

export interface ClaimAlert {
  codigo_regla: string;
  nombre_regla: string;
  puntaje: number;
  nivel_alerta?: string;
  valor_detectado: string;
  descripcion: string;
}

export interface Claim {
  id_siniestro: string;
  ramo: string;
  cobertura: string;
  fecha_ocurrencia: string;
  fecha_reporte: string;
  monto_reclamado: number;
  estado: string;
  proveedor: Provider;
  score: ClaimScore;
}

export interface ClaimDetail extends Claim {
  monto_estimado: number;
  monto_pagado: number;
  sucursal: string;
  descripcion: string;
  poliza: Policy;
  asegurado: Insured;
  vehiculo: Vehicle;
  documentos: DocumentItem[];
}

export interface ReviewHistoryItem {
  id_revision: string;
  fecha_revision: string;
  revisado_por: string;
  estado_revision: string;
  comentario: string;
  decision?: 'Aceptar' | 'Rechazar' | 'Revisar';
}
