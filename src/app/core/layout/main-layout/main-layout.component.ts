import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, MobileNavComponent],
  template: `
    <div class="flex h-screen bg-slate-100">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:block w-64 bg-slate-900 text-white overflow-y-auto fixed h-full">
        <app-sidebar></app-sidebar>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col md:ml-64">
        <!-- Topbar -->
        <app-topbar (toggleSidebar)="toggleMobileSidebar()"></app-topbar>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <div class="p-4 md:p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Mobile Sidebar -->
      <div *ngIf="showMobileSidebar" class="fixed inset-0 z-40 md:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50" (click)="toggleMobileSidebar()"></div>
        <aside class="absolute left-0 top-0 h-full w-64 bg-slate-900 text-white overflow-y-auto">
          <app-sidebar (navigate)="toggleMobileSidebar()"></app-sidebar>
        </aside>
      </div>

      <!-- Mobile Bottom Navigation -->
      <div class="fixed bottom-0 left-0 right-0 md:hidden z-30">
        <app-mobile-nav></app-mobile-nav>
      </div>
    </div>
  `,
})
export class MainLayoutComponent implements OnInit {
  showMobileSidebar = signal(false);
  appRoutes = APP_ROUTES;

  ngOnInit(): void {}

  toggleMobileSidebar(): void {
    this.showMobileSidebar.update((v) => !v);
  }
}
