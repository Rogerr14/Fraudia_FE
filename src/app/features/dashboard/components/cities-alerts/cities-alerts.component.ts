import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../shared/components/card/app-card.component';
import { CityAlert } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-cities-alerts',
  standalone: true,
  imports: [CommonModule, AppCardComponent],
  template: `
    <app-card title="Alertas por Ciudad">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2 px-2">Ciudad</th>
              <th class="text-right py-2 px-2">Siniestros</th>
              <th class="text-right py-2 px-2">Alertas</th>
              <th class="text-right py-2 px-2">Casos Rojos</th>
              <th class="text-right py-2 px-2">Score Promedio</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let city of items"
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td class="py-3 px-2 font-medium text-slate-900">{{ city.ciudad }}</td>
              <td class="text-right py-3 px-2 text-slate-900">{{ city.total_siniestros }}</td>
              <td class="text-right py-3 px-2 text-amber-600 font-medium">{{ city.total_alertas }}</td>
              <td class="text-right py-3 px-2 text-red-600 font-medium">{{ city.casos_rojos }}</td>
              <td class="text-right py-3 px-2 text-slate-900">
                {{ city.score_promedio | number: '1.1-1' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-card>
  `,
})
export class CitiesAlertsComponent {
  @Input() items: CityAlert[] = [];
}
