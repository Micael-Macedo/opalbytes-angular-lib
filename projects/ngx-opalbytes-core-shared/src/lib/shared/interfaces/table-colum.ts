export interface ITableColumn<T extends Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  hidden?: boolean;
  cellTemplate?: (row: T) => string | number;
}
