export interface DashboardSummary {
  total_siniestros: number;
  evaluados: number;
  pendientes: number;
  riesgo_verde: number;
  riesgo_amarillo: number;
  riesgo_rojo: number;
  score_promedio: number;
  monto_total_reclamado: number;
  monto_en_riesgo_rojo: number;
}

export interface RiskDistributionItem {
  nivel_riesgo: 'Verde' | 'Amarillo' | 'Rojo';
  cantidad: number;
  porcentaje: number;
}

export interface TopRiskClaim {
  id_siniestro: string;
  ramo: string;
  cobertura: string;
  score_final: number;
  nivel_riesgo: 'Verde' | 'Amarillo' | 'Rojo';
  monto_reclamado: number;
  principales_alertas: string[];
}

export interface ProviderRankingItem {
  id_proveedor: string;
  tipo: string;
  ciudad: string;
  total_siniestros: number;
  total_alertas: number;
  casos_rojos: number;
  monto_total_reclamado: number;
}

export interface CityAlert {
  ciudad: string;
  total_siniestros: number;
  total_alertas: number;
  casos_rojos: number;
  score_promedio: number;
}

export interface BranchRisk {
  ramo: string;
  total_siniestros: number;
  casos_rojos: number;
  casos_amarillos: number;
  score_promedio: number;
}
