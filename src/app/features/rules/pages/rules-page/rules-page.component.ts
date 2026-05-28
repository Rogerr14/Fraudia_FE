import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Rule } from '../../models/rule.model';
import { RulesService } from '../../services/rules.service';
import { RuleDetailComponent } from '../../components/rule-detail/rule-detail.component';
import { RulesTableComponent } from '../../components/rules-table/rules-table.component';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, LoadingSpinnerComponent, RuleDetailComponent, RulesTableComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="page-kicker">Motor de reglas</p>
          <h1>Reglas de evaluación</h1>
          <span>Condiciones, categorías y puntajes usados por el motor de riesgo.</span>
        </div>
      </header>

      <app-loading-spinner *ngIf="loading()" message="Cargando reglas..."></app-loading-spinner>
      <app-rules-table *ngIf="!loading() && rules().length > 0" [rules]="rules()" (ruleSelected)="selectedRule.set($event)"></app-rules-table>
      <app-rule-detail [rule]="selectedRule()"></app-rule-detail>
      <app-empty-state *ngIf="!loading() && rules().length === 0" title="No hay información disponible"></app-empty-state>
    </section>
  `,
})
export class RulesPageComponent implements OnInit {
  loading = signal(true);
  rules = signal<Rule[]>([]);
  selectedRule = signal<Rule | null>(null);

  constructor(private rulesService: RulesService) {}

  ngOnInit(): void {
    this.rulesService.listRules().subscribe({
      next: (rules) => {
        this.rules.set(rules);
        this.selectedRule.set(rules[0] ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
