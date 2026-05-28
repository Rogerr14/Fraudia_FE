import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { UploadDatasetResponse, UploadStatus } from '../../core/models/upload.model';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClientService) {}

  uploadDataset(file: File, datasetType: string = 'full'): Observable<UploadDatasetResponse> {
    return this.http.uploadFile<UploadDatasetResponse>(API_ENDPOINTS.uploads.dataset, file, { dataset_type: datasetType });
  }

  getUploadStatus(batchId: string): Observable<UploadStatus> {
    return this.http.get<UploadStatus>(API_ENDPOINTS.uploads.status(batchId));
  }
}
