export interface ReviewRequest {
  decision: string;
  comentario: string;
  reviewed_by: string;
  estado_revision: string;
}

export interface ReviewHistoryItem {
  decision: string;
  comentario: string;
  reviewed_by: string;
  created_at: string;
}

export interface CriticalCase {
  id_siniestro: string;
  score_final: number;
  nivel_riesgo: 'Verde' | 'Amarillo' | 'Rojo';
  monto_reclamado: number;
  principales_motivos: string[];
  recomendacion: string;
}

export interface ExecutiveSummary {
  titulo: string;
  periodo: {
    desde: string;
    hasta: string;
  };
  metricas: {
    total_siniestros: number;
    casos_rojos: number;
    casos_amarillos: number;
    monto_en_riesgo: number;
  };
  resumen: string;
  recomendaciones: string[];
}
