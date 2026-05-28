import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../shared/components/card/app-card.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ProviderRankingItem } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-providers-ranking',
  standalone: true,
  imports: [CommonModule, AppCardComponent, CurrencyFormatPipe],
  template: `
    <app-card title="Ranking de Proveedores con Alertas">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2 px-2">Proveedor</th>
              <th class="text-right py-2 px-2">Siniestros</th>
              <th class="text-right py-2 px-2">Alertas</th>
              <th class="text-right py-2 px-2">Casos Rojos</th>
              <th class="text-right py-2 px-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let provider of items"
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td class="py-3 px-2">
                <div>
                  <p class="font-medium text-slate-900">{{ provider.id_proveedor }}</p>
                  <p class="text-xs text-slate-600">{{ provider.tipo }} - {{ provider.ciudad }}</p>
                </div>
              </td>
              <td class="text-right py-3 px-2 text-slate-900 font-medium">{{ provider.total_siniestros }}</td>
              <td class="text-right py-3 px-2 text-amber-600 font-medium">{{ provider.total_alertas }}</td>
              <td class="text-right py-3 px-2 text-red-600 font-medium">{{ provider.casos_rojos }}</td>
              <td class="text-right py-3 px-2 text-slate-900 font-medium">
                {{ provider.monto_total_reclamado | currencyFormat }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-card>
  `,
})
export class ProvidersRankingComponent {
  @Input() items: ProviderRankingItem[] = [];
}
