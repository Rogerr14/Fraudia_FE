import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBadgeComponent } from '../badge/app-badge.component';
import { getFlowStatusLabel, getFlowStatusVariant } from '../../utils/flow-status.util';

@Component({
  selector: 'app-flow-status-badge',
  standalone: true,
  imports: [CommonModule, AppBadgeComponent],
  template: ` <app-badge [label]="label" [variant]="variant"></app-badge> `,
})
export class FlowStatusBadgeComponent {
  @Input() status: string | null | undefined = null;

  get label(): string {
    return getFlowStatusLabel(this.status);
  }

  get variant() {
    return getFlowStatusVariant(this.status);
  }
}
