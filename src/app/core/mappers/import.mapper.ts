import { asArray, asRecord, firstNonEmpty, toNumber } from './mapper.utils';

export interface FileImportResponseApiDto {
  id?: string | null;
  filename?: string | null;
  original_filename?: string | null;
  dataset?: string | null;
  status?: string | null;
  total_rows?: number | string | null;
  valid_rows?: number | string | null;
  invalid_rows?: number | string | null;
  processed_rows?: number | string | null;
  failed_rows?: number | string | null;
  green_count?: number | string | null;
  yellow_count?: number | string | null;
  red_count?: number | string | null;
  insureds?: number | string | null;
  policies?: number | string | null;
  vehicles?: number | string | null;
  providers?: number | string | null;
  claims?: number | string | null;
  assessments?: number | string | null;
  message?: string | null;
  result_message?: string | null;
  datasets?: Record<string, number> | null;
  created_at?: string | null;
  summary?: {
    created_claims?: number | string | null;
    created_policies?: number | string | null;
    created_insured?: number | string | null;
    created_providers?: number | string | null;
    created_documents?: number | string | null;
    created_vehicles?: number | string | null;
    errors?: number | string | null;
  } | null;
}

export interface ImportErrorApiDto {
  row?: number | string | null;
  field?: string | null;
  message?: string | null;
}

export interface ImportListResponseApiDto {
  items?: FileImportResponseApiDto[];
  imports?: FileImportResponseApiDto[];
  total?: number | string | null;
}

export interface UploadError {
  row: number;
  field: string;
  message: string;
}

export interface ImportSummary {
  id: string;
  fileName: string;
  dataset?: string | null;
  status: string;
  message: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  processedRows: number;
  failedRows: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  createdAt?: string | null;
  datasets: Record<string, number>;
  createdInsureds: number;
  createdPolicies: number;
  createdVehicles: number;
  createdProviders: number;
  createdClaims: number;
  createdDocuments: number;
  createdAssessments: number;
}

export interface UploadDatasetResponse extends ImportSummary {
  errors: UploadError[];
}

export interface ImportListResponse {
  items: ImportSummary[];
  total: number;
}

export interface BatchAssessmentSummary {
  processed: number;
  message: string;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  failedCount: number;
}

export function mapImportFromApi(dto: FileImportResponseApiDto): ImportSummary {
  const summary = dto.summary ?? {};
  const datasets = dto.datasets ?? {};
  const totalRows = toNumber(dto.total_rows) || Object.values(datasets).reduce((sum, value) => sum + Number(value ?? 0), 0);
  const validRows = toNumber(dto.valid_rows);
  const invalidRows = toNumber(dto.invalid_rows);
  const processedRows = validRows || toNumber(dto.processed_rows) || totalRows;
  const failedRows = invalidRows || toNumber(dto.failed_rows) || toNumber(summary.errors);

  return {
    id: firstNonEmpty(dto.id, dto.filename, dto.original_filename) ?? crypto.randomUUID(),
    fileName: firstNonEmpty(dto.filename, dto.original_filename) ?? 'dataset.xlsx',
    dataset: dto.dataset,
    status: dto.status ?? 'PROCESSED',
    message: dto.result_message ?? dto.message ?? 'Importación procesada correctamente.',
    totalRows,
    validRows,
    invalidRows,
    processedRows,
    failedRows,
    greenCount: toNumber(dto.green_count),
    yellowCount: toNumber(dto.yellow_count),
    redCount: toNumber(dto.red_count),
    createdAt: dto.created_at,
    datasets,
    createdInsureds: toNumber(summary.created_insured) || toNumber(dto.insureds),
    createdPolicies: toNumber(summary.created_policies) || toNumber(dto.policies),
    createdVehicles: toNumber(summary.created_vehicles) || toNumber(dto.vehicles),
    createdProviders: toNumber(summary.created_providers) || toNumber(dto.providers),
    createdClaims: toNumber(summary.created_claims) || toNumber(dto.claims),
    createdDocuments: toNumber(summary.created_documents),
    createdAssessments: toNumber(dto.assessments),
  };
}

export function mapUploadResponseFromApi(dto: FileImportResponseApiDto): UploadDatasetResponse {
  return {
    ...mapImportFromApi(dto),
    errors: [],
  };
}

export function mapImportErrorFromApi(dto: ImportErrorApiDto): UploadError {
  return {
    row: toNumber(dto.row),
    field: dto.field ?? 'general',
    message: dto.message ?? 'No se pudo procesar la fila.',
  };
}

export function mapImportListFromApi(payload: unknown): ImportListResponse {
  const record = asRecord(payload);
  const recordItems = asArray<FileImportResponseApiDto>(record?.['items']);
  const importItems = asArray<FileImportResponseApiDto>(record?.['imports']);
  const items = recordItems.length > 0 ? recordItems : importItems;

  if (items.length > 0) {
    return {
      items: items.map(mapImportFromApi),
      total: toNumber(record?.['total']) || items.length,
    };
  }

  const directItems = asArray<FileImportResponseApiDto>(payload);
  return {
    items: directItems.map(mapImportFromApi),
    total: directItems.length,
  };
}

export function mapBatchAssessmentFromApi(payload: unknown): BatchAssessmentSummary {
  const record = asRecord(payload);
  const summary = asRecord(record?.['summary']) ?? record;

  return {
    processed: toNumber(summary?.['processed']) || toNumber(summary?.['total_processed']),
    message:
      firstNonEmpty(record?.['message'] as string | undefined, summary?.['message'] as string | undefined) ??
      'Análisis completado correctamente.',
    greenCount: toNumber(summary?.['green_count']),
    yellowCount: toNumber(summary?.['yellow_count']),
    redCount: toNumber(summary?.['red_count']),
    failedCount: toNumber(summary?.['failed_count']),
  };
}
