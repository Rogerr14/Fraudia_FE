import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Rule, RuleApiDto, mapRuleFromApi } from '../models/rule.model';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private http: HttpClientService) {}

  listRules(): Observable<Rule[]> {
    return this.http.get<RuleApiDto[]>(API_ENDPOINTS.rules.list).pipe(map((rules) => (rules ?? []).map(mapRuleFromApi)));
  }

  getRuleDetail(ruleId: string): Observable<Rule> {
    return this.http.get<RuleApiDto>(API_ENDPOINTS.rules.detail(ruleId)).pipe(map(mapRuleFromApi));
  }
}
