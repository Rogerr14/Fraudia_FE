import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../card/app-card.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, AppCardComponent],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      (click)="close()"
    >
      <app-card
        [title]="title"
        class="max-w-md w-full mx-4"
        (click)="$event.stopPropagation()"
      >
        <div class="space-y-4">
          <ng-content></ng-content>
          <div class="flex gap-2 justify-end pt-4 border-t border-slate-200">
            <button
              class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              (click)="close()"
            >
              {{ cancelLabel }}
            </button>
            <button
              *ngIf="showConfirm"
              class="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              (click)="confirm()"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [``],
})
export class AppModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Diálogo';
  @Input() showConfirm: boolean = true;
  @Input() confirmLabel: string = 'Aceptar';
  @Input() cancelLabel: string = 'Cancelar';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  confirm(): void {
    this.onConfirm.emit();
    this.close();
  }

  close(): void {
    this.onClose.emit();
  }
}
