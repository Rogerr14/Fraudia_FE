import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../button/app-button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  styles: [
    `
      :host {
        position: static;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 110;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(4, 44, 83, 0.48);
        backdrop-filter: blur(4px);
      }

      .modal-panel {
        width: min(560px, calc(100vw - 32px));
        max-height: calc(100vh - 40px);
        overflow: auto;
        border: 1px solid rgba(209, 213, 219, 0.95);
        border-radius: 12px;
        background: #ffffff;
        box-shadow: 0 24px 60px rgba(4, 44, 83, 0.28);
        color: #2c2c2a;
      }

      .modal-panel__header,
      .modal-panel__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px;
      }

      .modal-panel__header {
        border-bottom: 1px solid #d1d5db;
      }

      .modal-panel__header h2 {
        margin: 0;
        font-size: 1.2rem;
        line-height: 1.2;
      }

      .modal-panel__header button {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: transparent;
        color: #6b7280;
        cursor: pointer;
        font-size: 1.3rem;
        line-height: 1;
      }

      .modal-panel__body {
        padding: 18px;
      }

      .modal-panel__footer {
        justify-content: flex-end;
        border-top: 1px solid #d1d5db;
      }

      @media (max-width: 640px) {
        .modal-backdrop {
          align-items: flex-end;
          padding: 12px;
        }

        .modal-panel {
          width: 100%;
          max-height: min(88vh, 720px);
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    `,
  ],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop" (click)="close.emit()">
      <section class="modal-panel" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <header class="modal-panel__header">
          <h2>{{ title }}</h2>
          <button type="button" (click)="close.emit()" aria-label="Cerrar">×</button>
        </header>
        <div class="modal-panel__body">
          <ng-content></ng-content>
        </div>
        <footer class="modal-panel__footer">
          <app-button [label]="cancelLabel" variant="ghost" (pressed)="close.emit()"></app-button>
          <app-button *ngIf="showConfirm" [label]="confirmLabel" (pressed)="confirm.emit()"></app-button>
        </footer>
      </section>
    </div>
  `,
})
export class AppModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Diálogo';
  @Input() showConfirm = true;
  @Input() confirmLabel = 'Aceptar';
  @Input() cancelLabel = 'Cancelar';
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
