export class RiskUtil {
  static getRiskColor(level: 'Verde' | 'Amarillo' | 'Rojo'): string {
    const colors = {
      Verde: '#10b981',
      Amarillo: '#f59e0b',
      Rojo: '#ef4444',
    };
    return colors[level];
  }

  static getRiskLabel(level: 'Verde' | 'Amarillo' | 'Rojo'): string {
    const labels = {
      Verde: 'Bajo Riesgo',
      Amarillo: 'Riesgo Medio',
      Rojo: 'Alto Riesgo',
    };
    return labels[level];
  }

  static getScoreLevelFromScore(score: number): 'Verde' | 'Amarillo' | 'Rojo' {
    if (score >= 0 && score <= 33) return 'Verde';
    if (score > 33 && score <= 66) return 'Amarillo';
    return 'Rojo';
  }

  static getStatusBadgeClass(level: 'Verde' | 'Amarillo' | 'Rojo'): string {
    const classes = {
      Verde: 'bg-green-100 text-green-800',
      Amarillo: 'bg-amber-100 text-amber-800',
      Rojo: 'bg-red-100 text-red-800',
    };
    return classes[level];
  }
}
