export interface IFilterConfig {
  id: string;
  label: string;
  fixed: boolean;
  component: "text" | "select" | "date";
  order: number;
  options?: { value: string; label: string }[];
  maxLength?: number;
  minLength?: number;
}
