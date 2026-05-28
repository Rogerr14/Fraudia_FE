import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  template?: any;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto rounded-lg border border-slate-200">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th
              *ngFor="let column of columns"
              class="px-6 py-3 text-left font-semibold text-slate-900"
              [style.width]="column.width"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let row of data"
            class="border-b border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <td *ngFor="let column of columns" class="px-6 py-4 text-slate-700">
              {{ row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AppTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
}
