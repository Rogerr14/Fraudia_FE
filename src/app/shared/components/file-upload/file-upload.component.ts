import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <div
        class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50"
        (click)="fileInput.click()"
        (drop)="onDrop($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        [class.border-blue-400]="isDragging"
        [class.bg-blue-50]="isDragging"
      >
        <input
          #fileInput
          type="file"
          (change)="onFileSelected($event)"
          [accept]="acceptedFormats"
          class="hidden"
        />

        <div class="space-y-2">
          <p class="text-2xl">📁</p>
          <p class="text-slate-900 font-medium">{{ isDragging ? 'Suelta el archivo' : 'Arrastra aquí o haz clic' }}</p>
          <p class="text-sm text-slate-600">Formatos soportados: {{ acceptedFormats }}</p>
        </div>
      </div>

      <div *ngIf="selectedFile" class="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-900">{{ selectedFile.name }}</p>
          <p class="text-xs text-slate-600">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        <button
          type="button"
          class="text-slate-600 hover:text-slate-900"
          (click)="clearFile()"
        >
          ✕
        </button>
      </div>

      <p *ngIf="error" class="text-sm text-red-600">{{ error }}</p>
    </div>
  `,
})
export class FileUploadComponent implements OnInit {
  @Input() acceptedFormats: string = '.csv,.xlsx,.json';
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileCleared = new EventEmitter<void>();

  selectedFile: File | null = null;
  isDragging: boolean = false;
  error: string = '';

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    this.error = '';

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.error = `El archivo es muy grande. Máximo: ${this.formatFileSize(this.maxFileSize)}`;
      return;
    }

    // Validate file format
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.acceptedFormats.includes(extension)) {
      this.error = `Formato no válido. Acepta: ${this.acceptedFormats}`;
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
  }

  clearFile(): void {
    this.selectedFile = null;
    this.error = '';
    this.fileCleared.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
