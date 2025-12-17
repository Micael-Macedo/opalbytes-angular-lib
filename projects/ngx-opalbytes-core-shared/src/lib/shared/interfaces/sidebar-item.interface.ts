import { Permission } from "../constants/permissions.constants";

export interface ISidebarItem {
  route: string;
  label: string;
  icon: string;
  permissions: Permission[];
}
