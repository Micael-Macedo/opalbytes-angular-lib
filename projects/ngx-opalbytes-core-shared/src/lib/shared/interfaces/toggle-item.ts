export type ToggleSize = "default" | "sm" | "lg";
export type ToggleVariant = "default" | "primary" | "secondary" | "outline";

export interface IToggleItem {
  value: string;
  label: string;
  disabled?: boolean;
}
