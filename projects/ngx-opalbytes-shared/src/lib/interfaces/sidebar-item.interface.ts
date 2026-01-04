import { Permission } from "../../../../../portal-publico/src/app/domain/constants/permissions.constants";

export interface ISidebarItem {
  route: string;
  label: string;
  icon: string;
  permissions: Permission[];
}
