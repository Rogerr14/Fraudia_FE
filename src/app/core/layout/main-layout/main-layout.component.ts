import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, MobileNavComponent],
  template: `
    <div class="app-shell">
      <aside class="app-sidebar-shell">
        <app-sidebar></app-sidebar>
      </aside>

      <div class="app-content-shell">
        <app-topbar (toggleSidebar)="toggleMobileSidebar()"></app-topbar>
        <main class="app-main">
          <router-outlet></router-outlet>
        </main>
      </div>

      <div *ngIf="showMobileSidebar()" class="mobile-drawer">
        <button class="mobile-drawer__backdrop" type="button" aria-label="Cerrar menú" (click)="toggleMobileSidebar()"></button>
        <aside class="mobile-drawer__panel">
          <app-sidebar (navigate)="toggleMobileSidebar()"></app-sidebar>
        </aside>
      </div>

      <div class="mobile-nav-shell">
        <app-mobile-nav></app-mobile-nav>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  showMobileSidebar = signal(false);

  toggleMobileSidebar(): void {
    this.showMobileSidebar.update((isOpen) => !isOpen);
  }
}
