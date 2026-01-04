import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserProfileDropdown } from '@shared.components/user-profile-dropdown/user-profile-dropdown';
import { ISidebarItem } from '@shared.interfaces/sidebar-item.interface';
import { SIDEBAR_ITEMS } from '@shared.constants/sidebar.constants';
import packageJson from '../../../../../package.json';
import { PermissionDirective } from '@shared.directives/permission.directive';
import { AuthService } from '@core.services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    UserProfileDropdown,
    PermissionDirective,
  ],
  templateUrl: './sidebar.html',
  styles: [
    `
      :host {
        display: block;
      }

      nav {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      nav::-webkit-scrollbar {
        display: none;
      }
    `,
  ],
})
export class Sidebar {
  private router = inject(Router);
  private authService = inject(AuthService);
  VERSION = packageJson.version;
  sidebarItems = signal<ISidebarItem[]>(SIDEBAR_ITEMS);
  expandedItems = signal<Set<string>>(new Set());

  currentPath = signal(this.router.url);

  constructor() {
    this.router.events.subscribe(() => {
      this.currentPath.set(this.router.url);
    });
  }

  isActive = (route?: string) => {
    if (!route) return false;
    const currentPath = this.currentPath().replace(/^\//, '');
    const routePath = route.replace(/^\//, '');
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  };

  isExpanded = (label: string) => {
    return this.expandedItems().has(label);
  };

  toggleExpanded = (label: string) => {
    const expanded = new Set(this.expandedItems());
    if (expanded.has(label)) {
      expanded.delete(label);
    } else {
      expanded.add(label);
    }
    this.expandedItems.set(expanded);
  };

  navigate(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  handleLogout() {
    // Usar AuthService que já gerencia a remoção correta
    this.authService.logout();
  }
}
