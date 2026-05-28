export interface UploadSummary {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  created_siniestros: number;
  created_polizas: number;
  created_asegurados: number;
  created_proveedores: number;
  created_documentos: number;
}

export interface UploadError {
  row: number;
  field: string;
  message: string;
}

export interface UploadDatasetResponse {
  message: string;
  batch_id: string;
  summary: UploadSummary;
  errors: UploadError[];
}

export interface UploadStatus {
  batch_id: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  started_at: string;
  finished_at?: string;
}
