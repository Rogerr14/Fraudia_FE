import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riskLevel',
  standalone: true,
})
export class RiskLevelPipe implements PipeTransform {
  transform(value: 'Verde' | 'Amarillo' | 'Rojo'): string {
    const levels = {
      Verde: 'Bajo Riesgo',
      Amarillo: 'Riesgo Medio',
      Rojo: 'Alto Riesgo',
    };
    return levels[value] || value;
  }
}
