import { Component, Inject, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UsuarioRolesService } from '@domain/services/usuario-roles.service';
import { GrupoRoles, Role, EditRolesPayload } from '@domain/models/usuario-roles.model';
import { FormatCpfCnpjPipe } from '@shared/pipes/format-cpf-cnpj.pipe';
import { forkJoin } from 'rxjs';

export interface PermissoesModalData {
  userId: string;
  currentUserId: string;
  userName: string;
  userDocument: string;
}

export interface RoleGroupedByDescription {
  description: string;
  roles: Role[];
}

export interface GrupoRolesGrouped {
  grupoNome: string;
  rolesGrouped: RoleGroupedByDescription[];
}

@Component({
  selector: 'app-permissoes-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCheckboxModule, FormatCpfCnpjPipe],
  templateUrl: './permissoes-modal.html',
})
export class PermissoesModal implements OnInit {
  private usuarioRolesService = inject(UsuarioRolesService);

  gruposRolesGrouped = signal<GrupoRolesGrouped[]>([]);
  allRolesMap = signal<Map<string, { role: Role; grupoNome: string }>>(new Map());
  selectedRoles = signal<Set<string>>(new Set());
  initialRoles = signal<Set<string>>(new Set());
  loading = signal(false);
  saving = signal(false);
  dashboardRolesGrouped = signal<Map<string, string[]>>(new Map());

  hasChanges = computed(() => {
    const selected = Array.from(this.selectedRoles());
    const initial = Array.from(this.initialRoles());

    if (selected.length !== initial.length) {
      return true;
    }

    const hasNewRoles = selected.some((id) => !initial.includes(id));
    const hasRemovedRoles = initial.some((id) => !selected.includes(id));

    return hasNewRoles || hasRemovedRoles;
  });

  constructor(
    public dialogRef: MatDialogRef<PermissoesModal>,
    @Inject(MAT_DIALOG_DATA) public data: PermissoesModalData,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadRoles();
    }, 0);
  }

  loadRoles(): void {
    this.loading.set(true);

    forkJoin({
      allRoles: this.usuarioRolesService.rolesAvailable(),
      userRoles: this.usuarioRolesService.getRolesByUserId(this.data.userId),
    }).subscribe({
      next: ({ allRoles, userRoles }) => {
        const dashboardGroups = this.groupDashboardRoles(allRoles);
        this.dashboardRolesGrouped.set(dashboardGroups);

        const gruposGrouped = this.groupRolesByDescription(allRoles, dashboardGroups);
        this.gruposRolesGrouped.set(gruposGrouped);

        const rolesMap = new Map<string, { role: Role; grupoNome: string }>();
        allRoles.forEach((grupo) => {
          grupo.roles.forEach((role) => {
            rolesMap.set(role.id, { role, grupoNome: grupo.grupoNome });
          });
        });
        this.allRolesMap.set(rolesMap);

        const userRoleIds = new Set<string>();
        userRoles.forEach((grupo) => {
          grupo.roles.forEach((role) => {
            userRoleIds.add(role.id);
          });
        });

        this.selectedRoles.set(new Set(userRoleIds));
        this.initialRoles.set(new Set(userRoleIds));

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private groupDashboardRoles(grupos: GrupoRoles[]): Map<string, string[]> {
    const dashboardGroups = new Map<string, string[]>();
    const dashboardRolesByName = new Map<string, { role: Role; clientName: string }[]>();

    grupos.forEach((grupo) => {
      grupo.roles.forEach((role) => {
        if (role.description?.toLowerCase() === 'dashboard') {
          const roleName = role.name;
          if (!dashboardRolesByName.has(roleName)) {
            dashboardRolesByName.set(roleName, []);
          }
          dashboardRolesByName.get(roleName)!.push({ role, clientName: grupo.grupoNome });
        }
      });
    });

    dashboardRolesByName.forEach((roleInfos) => {
      if (roleInfos.length > 1) {
        const roleIds = roleInfos.map((ri) => ri.role.id);
        dashboardGroups.set(roleInfos[0].role.id, roleIds);
      }
    });

    return dashboardGroups;
  }

  private groupRolesByDescription(
    grupos: GrupoRoles[],
    dashboardGroups: Map<string, string[]>,
  ): GrupoRolesGrouped[] {
    const globalProcessedDashboardGroups = new Set<string>();
    const dashboardRoleMain = new Map<string, { role: Role; grupoNome: string }>();

    for (const [keyRoleId] of dashboardGroups.entries()) {
      for (const grupo of grupos) {
        const mainRole = grupo.roles.find((r) => r.id === keyRoleId);
        if (mainRole) {
          dashboardRoleMain.set(keyRoleId, { role: mainRole, grupoNome: grupo.grupoNome });
          break;
        }
      }
    }

    return grupos.map((grupo) => {
      const rolesByDescription = new Map<string, Role[]>();

      for (const role of grupo.roles) {
        let isGrouped = false;
        let groupKey = role.id;

        for (const [keyRoleId, roleIds] of dashboardGroups.entries()) {
          if (roleIds.includes(role.id)) {
            isGrouped = true;
            groupKey = keyRoleId;
            break;
          }
        }

        if (isGrouped) {
          if (globalProcessedDashboardGroups.has(groupKey)) {
            continue;
          }
          const mainRoleInfo = dashboardRoleMain.get(groupKey);
          if (mainRoleInfo && mainRoleInfo.role.id === role.id) {
            globalProcessedDashboardGroups.add(groupKey);
            const description = role.description || 'Sem descrição';
            if (!rolesByDescription.has(description)) {
              rolesByDescription.set(description, []);
            }
            rolesByDescription.get(description)!.push(role);
          }
          continue;
        }

        const description = role.description || 'Sem descrição';
        if (!rolesByDescription.has(description)) {
          rolesByDescription.set(description, []);
        }

        rolesByDescription.get(description)!.push(role);
      }

      const rolesGrouped: RoleGroupedByDescription[] = Array.from(rolesByDescription.entries()).map(
        ([description, roles]) => ({
          description,
          roles: this.sortRoles(roles),
        }),
      );

      return {
        grupoNome: grupo.grupoNome,
        rolesGrouped,
      };
    });
  }

  private sortRoles(roles: Role[]): Role[] {
    const verbOrder: Record<string, number> = {
      create: 1,
      read: 2,
      consultar: 2,
      update: 3,
      edit: 3,
      delete: 4,
      excluir: 4,
      manage: 5,
      upload: 6,
      download: 7,
      search: 8,
      view: 9,
      export: 10,
      import: 11,
      skip: 12,
      send: 13,
    };

    return [...roles].sort((a, b) => {
      const verbA = a.name.split('_')[0].toLowerCase();
      const verbB = b.name.split('_')[0].toLowerCase();

      const orderA = verbOrder[verbA] ?? 999;
      const orderB = verbOrder[verbB] ?? 999;

      return orderA - orderB;
    });
  }

  toggleRole(roleId: string): void {
    const selected = new Set(this.selectedRoles());
    const dashboardGroups = this.dashboardRolesGrouped();

    let roleIdsToToggle = [roleId];
    dashboardGroups.forEach((groupedRoleIds, keyRoleId) => {
      if (keyRoleId === roleId || groupedRoleIds.includes(roleId)) {
        roleIdsToToggle = groupedRoleIds;
      }
    });

    roleIdsToToggle.forEach((id) => {
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
    });
    this.selectedRoles.set(selected);
  }

  isRoleSelected(roleId: string): boolean {
    const selected = this.selectedRoles();
    const dashboardGroups = this.dashboardRolesGrouped();

    let roleIdsToCheck = [roleId];
    dashboardGroups.forEach((groupedRoleIds, keyRoleId) => {
      if (keyRoleId === roleId || groupedRoleIds.includes(roleId)) {
        roleIdsToCheck = groupedRoleIds;
      }
    });

    return roleIdsToCheck.every((id) => selected.has(id));
  }

  translateRoleName(roleName: string): string {
    const verb = roleName.split('_')[0];

    const verbTranslations: Record<string, string> = {
      create: 'Criar',
      read: 'Consultar',
      update: 'Editar',
      delete: 'Excluir',
      manage: 'Gerenciar',
      upload: 'Enviar',
      download: 'Baixar',
      search: 'Pesquisar',
      view: 'Visualizar',
      export: 'Exportar',
      import: 'Importar',
      skip: 'Pular',
      send: 'Enviar',
    };

    if (verbTranslations[verb.toLowerCase()]) {
      return verbTranslations[verb.toLowerCase()];
    }

    return roleName;
  }

  onSave(): void {
    this.saving.set(true);

    const selectedRoleIds = Array.from(this.selectedRoles());
    const initialRoleIds = Array.from(this.initialRoles());
    const rolesMap = this.allRolesMap();

    const rolesToAdd = selectedRoleIds.filter((id) => !initialRoleIds.includes(id));

    const rolesToRemove = initialRoleIds.filter((id) => !selectedRoleIds.includes(id));

    const rolesToAddByGroup = new Map<string, string[]>();
    rolesToAdd.forEach((roleId) => {
      const roleInfo = rolesMap.get(roleId);
      if (roleInfo) {
        const grupoNome = roleInfo.grupoNome;
        if (!rolesToAddByGroup.has(grupoNome)) {
          rolesToAddByGroup.set(grupoNome, []);
        }
        rolesToAddByGroup.get(grupoNome)!.push(roleId);
      }
    });

    const rolesToRemoveByGroup = new Map<string, string[]>();
    rolesToRemove.forEach((roleId) => {
      const roleInfo = rolesMap.get(roleId);
      if (roleInfo) {
        const grupoNome = roleInfo.grupoNome;
        if (!rolesToRemoveByGroup.has(grupoNome)) {
          rolesToRemoveByGroup.set(grupoNome, []);
        }
        rolesToRemoveByGroup.get(grupoNome)!.push(roleId);
      }
    });

    const operations: { payload: EditRolesPayload; type: 'add' | 'remove' }[] = [];

    rolesToAddByGroup.forEach((roleIds, grupoNome) => {
      operations.push({
        payload: {
          roleIds: roleIds,
          operation: 'Adicionar',
          clientName: grupoNome,
        },
        type: 'add',
      });
    });

    rolesToRemoveByGroup.forEach((roleIds, grupoNome) => {
      operations.push({
        payload: {
          roleIds: roleIds,
          operation: 'Remover',
          clientName: grupoNome,
        },
        type: 'remove',
      });
    });

    if (operations.length === 0) {
      this.saving.set(false);
      this.dialogRef.close(false);
      return;
    }

    this.executeOperations(operations, 0);
  }

  private executeOperations(
    operations: { payload: EditRolesPayload; type: 'add' | 'remove' }[],
    index: number,
  ): void {
    if (index >= operations.length) {
      this.saving.set(false);
      this.initialRoles.set(new Set(this.selectedRoles()));

      this.dialogRef.close(true);
      return;
    }

    const operation = operations[index];
    this.usuarioRolesService.editRoles(this.data.userId, operation.payload).subscribe({
      next: () => {
        this.executeOperations(operations, index + 1);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
