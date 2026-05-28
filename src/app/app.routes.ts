import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { UploadDatasetPageComponent } from './features/uploads/pages/upload-dataset-page/upload-dataset-page.component';
import { ClaimsListPageComponent } from './features/claims/pages/claims-list-page/claims-list-page.component';
import { ClaimDetailPageComponent } from './features/claims/pages/claim-detail-page/claim-detail-page.component';
import { RulesPageComponent } from './features/rules/pages/rules-page/rules-page.component';
import { AgentChatPageComponent } from './features/agent/pages/agent-chat-page/agent-chat-page.component';
import { ReportsPageComponent } from './features/reports/pages/reports-page/reports-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'uploads',
        component: UploadDatasetPageComponent,
      },
      {
        path: 'claims',
        component: ClaimsListPageComponent,
      },
      {
        path: 'claims/:id',
        component: ClaimDetailPageComponent,
      },
      {
        path: 'rules',
        component: RulesPageComponent,
      },
      {
        path: 'agent',
        component: AgentChatPageComponent,
      },
      {
        path: 'reports',
        component: ReportsPageComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
