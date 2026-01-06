export type Permission = "ALUNO" | "TUTOR" | "ADM";

export const PermissionsRoles = {
  ALUNO: "ALUNO",
  TUTOR: "TUTOR",
  ADM: "ADM",
} as const;

export interface ISidebarItem {
  route: string;
  label: string;
  icon: string;
  permissions: Permission[];
}
