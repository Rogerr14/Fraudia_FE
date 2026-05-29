import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { CatalogItem, CatalogItemApiDto, mapCatalogItemFromApi } from '../../../core/mappers/catalog.mapper';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  constructor(private http: HttpClientService) {}

  getDecisions(): Observable<CatalogItem[]> {
    return this.http
      .get<CatalogItemApiDto[]>(API_ENDPOINTS.catalogs.decisions)
      .pipe(map((items) => (items ?? []).filter((item) => item.active).map(mapCatalogItemFromApi)));
  }

  getClaimStatuses(): Observable<CatalogItem[]> {
    return this.http
      .get<CatalogItemApiDto[]>(API_ENDPOINTS.catalogs.claimStatuses)
      .pipe(map((items) => (items ?? []).filter((item) => item.active).map(mapCatalogItemFromApi)));
  }
}
