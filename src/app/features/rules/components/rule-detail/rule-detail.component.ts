import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBadgeComponent } from '../../../../shared/components/badge/app-badge.component';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { Rule } from '../../models/rule.model';

@Component({
  selector: 'app-rule-detail',
  standalone: true,
  imports: [CommonModule, AppBadgeComponent, AppCardComponent],
  template: `
    <app-card *ngIf="rule" title="Detalle de regla" eyebrow="Condiciones">
      <div class="rule-detail">
        <div>
          <span>{{ rule.code }}</span>
          <h3>{{ rule.name }}</h3>
          <p>{{ rule.description }}</p>
          <app-badge [label]="rule.ruleType" variant="info"></app-badge>
        </div>
        <div class="condition-list">
          <article *ngFor="let condition of rule.conditions">
            <strong>{{ condition.name }}</strong>
            <p>{{ condition.resultDescription }}</p>
            <small>{{ condition.evaluatedField }} {{ condition.operator }} {{ condition.minValue ?? condition.maxValue ?? '' }}</small>
            <b>+{{ condition.points }} pts</b>
          </article>
        </div>
      </div>
    </app-card>
  `,
})
export class RuleDetailComponent {
  @Input() rule: Rule | null = null;
}
