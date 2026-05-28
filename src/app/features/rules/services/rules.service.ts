import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Rule } from '../../core/models/rule.model';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private http: HttpClientService) {}

  listRules(): Observable<{ items: Rule[] }> {
    return this.http.get<{ items: Rule[] }>(API_ENDPOINTS.rules.list);
  }

  getRuleDetail(ruleId: number): Observable<Rule> {
    return this.http.get<Rule>(API_ENDPOINTS.rules.detail(ruleId));
  }
}
