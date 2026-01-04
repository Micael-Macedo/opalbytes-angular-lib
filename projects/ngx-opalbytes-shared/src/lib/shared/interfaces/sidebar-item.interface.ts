export interface ISidebarItem {
  route?: string;
  label: string;
  icon?: string;
  permissions: string[];
  children?: ISidebarItem[];
}
