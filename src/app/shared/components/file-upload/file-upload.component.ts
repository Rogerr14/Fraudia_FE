import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload">
      <button
        type="button"
        class="file-upload__dropzone"
        [class.is-dragging]="isDragging"
        (click)="fileInput.click()"
        (drop)="onDrop($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
      >
        <input
          #fileInput
          type="file"
          [accept]="acceptedFormats"
          (change)="onFileInputChange($event)"
        />
        <span class="file-upload__signal" aria-hidden="true"></span>
        <strong>{{ isDragging ? 'Suelta el archivo' : 'Arrastra o selecciona un archivo' }}</strong>
        <small>Formatos permitidos: CSV, XLSX o JSON</small>
      </button>

      <div *ngIf="selectedFile" class="file-upload__selected">
        <div>
          <strong>{{ selectedFile.name }}</strong>
          <span>{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        <button type="button" (click)="clearFile()" aria-label="Quitar archivo">×</button>
      </div>

      <p *ngIf="errorMessage" class="form-error">{{ errorMessage }}</p>
    </div>
  `,
})
export class FileUploadComponent {
  @Input() acceptedFormats = '.csv,.xlsx,.xls,.xlsm,.json';
  @Input() maxFileSize = 10 * 1024 * 1024;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileCleared = new EventEmitter<void>();

  selectedFile: File | null = null;
  isDragging = false;
  errorMessage = '';

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) {
      this.handleFile(file);
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
    const file = event.dataTransfer?.files.item(0);
    if (file) {
      this.handleFile(file);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';
    this.fileCleared.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 KB';
    }

    const units = ['Bytes', 'KB', 'MB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = bytes / Math.pow(1024, unitIndex);
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  private handleFile(file: File): void {
    this.errorMessage = '';

    if (file.size > this.maxFileSize) {
      this.errorMessage = `El archivo supera el tamaño máximo de ${this.formatFileSize(this.maxFileSize)}.`;
      return;
    }

    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    const allowedExtensions = this.acceptedFormats.split(',').map((item) => item.trim().toLowerCase());
    if (!allowedExtensions.includes(extension)) {
      this.errorMessage = 'Formato no válido. Usa un archivo CSV, XLSX o JSON.';
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
  }
}
