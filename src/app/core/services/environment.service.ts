import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  getApiBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  getAppEnv(): string {
    return environment.appEnv;
  }

  isDevelopment(): boolean {
    return environment.appEnv === 'development';
  }

  isProduction(): boolean {
    return environment.production;
  }

  enableMockData(): boolean {
    return environment.enableMockData;
  }
}
