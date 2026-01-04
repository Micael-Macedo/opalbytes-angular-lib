import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { IJwtPayload } from '@shared.interfaces/jwt-interface';
import { TokenService } from '@core.services/token.service';
import { jwtDecode } from 'jwt-decode';

@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective implements OnChanges {
  @Input({ required: true }) appPermission!: string[];

  private tokenService = inject(TokenService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appPermission'] || !this.viewContainer.length) {
      this.updateView();
    }
  }

  private updateView(): void {
    // Se não há permissões requeridas, exibe o item (sem restrição)
    if (!this.appPermission || this.appPermission.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    const token = this.tokenService.getToken();
    let hasPermission = false;

    if (token) {
      try {
        const payload = jwtDecode<IJwtPayload>(token);

        // Coletar todas as roles de todos os recursos de forma genérica
        const allRoles: string[] = [];

        if (payload.resource_access) {
          // Itera sobre todos os recursos sem hardcode
          Object.values(payload.resource_access).forEach((resource) => {
            if (resource?.roles) {
              allRoles.push(...resource.roles);
            }
          });
        }

        // Também inclui roles do realm_access
        if (payload.realm_access?.roles) {
          allRoles.push(...payload.realm_access.roles);
        }

        // Verificar se alguma das permissões requeridas está presente nas roles
        hasPermission = this.appPermission.some((permission) => allRoles.includes(permission));
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        hasPermission = false;
      }
    }

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
