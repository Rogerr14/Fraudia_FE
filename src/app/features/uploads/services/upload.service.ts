import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import {
  FileImportResponseApiDto,
  ImportErrorApiDto,
  ImportListResponse,
  UploadDatasetResponse,
  UploadError,
  mapImportErrorFromApi,
  mapImportListFromApi,
  mapUploadResponseFromApi,
} from '../models/upload.model';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClientService) {}

  uploadDataset(file: File, dataset?: string): Observable<UploadDatasetResponse> {
    return this.http
      .uploadFile<FileImportResponseApiDto>(API_ENDPOINTS.uploads.dataset, file, {
        dataset: dataset === 'auto' ? undefined : dataset,
      })
      .pipe(
        map((response) => {
          const mapped = mapUploadResponseFromApi(response);
          return {
            ...mapped,
            fileName: mapped.fileName === 'dataset.xlsx' ? file.name : mapped.fileName,
          };
        }),
      );
  }

  listImports(): Observable<ImportListResponse> {
    return this.http.get<unknown>(API_ENDPOINTS.uploads.list).pipe(map((response) => mapImportListFromApi(response)));
  }

  getImportErrors(importId: string): Observable<UploadError[]> {
    return this.http
      .get<ImportErrorApiDto[]>(API_ENDPOINTS.uploads.errors(importId))
      .pipe(map((errors) => (errors ?? []).map(mapImportErrorFromApi)));
  }
}
