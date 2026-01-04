import { Component, inject, computed, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TokenService } from '@core/services/token.service';
import { AuthService } from '@core/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { Variables } from '@shared/enums/variaveis.enum';
import { UserTokenData } from '@domain/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile-dropdown',
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './user-profile-dropdown.html',
  styles: [
    `
      ::ng-deep .mat-mdc-menu-panel {
        box-shadow:
          4px 4px 12px rgba(0, 0, 0, 0.15),
          2px 2px 6px rgba(0, 0, 0, 0.1) !important;
      }
    `,
  ],
})
export class UserProfileDropdown {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  private router = inject(Router);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);

  // Observar mudanças no storage do usuário
  private userStorageData = toSignal(this.storageService.observe<UserTokenData>(Variables.USER), {
    initialValue: this.storageService.getItem<UserTokenData>(Variables.USER),
  });

  currentUser: Signal<{
    name: string;
    email: string;
    role: string;
    initials: string;
  }> = computed(() => {
    const decodedToken = this.tokenService.getDecodedToken();
    const storedUserData = this.userStorageData();

    // Priorizar dados do storage se disponíveis, caso contrário usar o token
    let name = '';
    let email = '';

    if (storedUserData?.name) {
      name = storedUserData.name;
    } else if (decodedToken) {
      name =
        decodedToken.name ||
        decodedToken.given_name ||
        decodedToken.preferred_username ||
        'Usuário';
    }

    if (storedUserData?.email) {
      email = storedUserData.email;
    } else if (decodedToken) {
      email = decodedToken.email || '';
    }

    if (!decodedToken && !storedUserData) {
      return {
        name: 'Usuário',
        email: '',
        role: 'Não autenticado',
        initials: 'U',
      };
    }

    // Extrair role - tentar de diferentes fontes
    let role = 'Usuário';

    // Tentar pegar do resource_access (RCroppingDesktop ou RCroppingAPI)
    if (decodedToken?.resource_access) {
      const resourceAccess = decodedToken.resource_access as any;

      // Tentar RCroppingDesktop primeiro
      if (resourceAccess.RCroppingDesktop?.roles?.length > 0) {
        role = resourceAccess.RCroppingDesktop.roles[0];
      }
      // Se não encontrar, tentar RCroppingAPI
      else if (resourceAccess.RCroppingAPI?.roles?.length > 0) {
        role = resourceAccess.RCroppingAPI.roles[0];
      }
      // Tentar client_web (conforme interface)
      else if (resourceAccess.client_web?.roles?.length > 0) {
        role = resourceAccess.client_web.roles[0];
      }
    }

    // Se ainda não encontrou, tentar realm_access
    if (
      role === 'Usuário' &&
      decodedToken?.realm_access?.roles &&
      decodedToken.realm_access.roles.length > 0
    ) {
      // Filtrar roles padrão do Keycloak
      const filteredRoles = decodedToken.realm_access.roles.filter(
        (r) => !['offline_access', 'uma_authorization', 'default-roles-r-cropping'].includes(r),
      );
      if (filteredRoles.length > 0) {
        role = filteredRoles[0];
      }
    }

    // Gerar iniciais do nome
    const initials = this.getInitials(name || 'Usuário');

    // Formatar role para exibição mais amigável
    const formattedRole = this.formatRole(role);

    return {
      name: (name || 'Usuário').toUpperCase(),
      email: email || '',
      role: formattedRole,
      initials: initials,
    };
  });

  /**
   * Formata o role para exibição mais amigável
   */
  private formatRole(role: string): string {
    if (!role || role === 'Usuário') return 'Cliente Premium';

    // Remover underscores e capitalizar palavras
    const formatted = role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

    // Se for muito longo, truncar
    if (formatted.length > 25) {
      return formatted.substring(0, 22) + '...';
    }

    return formatted;
  }

  /**
   * Gera as iniciais do nome do usuário
   */
  private getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }

  viewProfile() {
    this.router.navigate(['/profile']);
  }

  openSettings() {
    this.router.navigate(['/config']);
  }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }

  handleLogout() {
    this.authService.logout();
  }

  openProfileMenu() {
    this.menuTrigger?.openMenu();
  }
}
