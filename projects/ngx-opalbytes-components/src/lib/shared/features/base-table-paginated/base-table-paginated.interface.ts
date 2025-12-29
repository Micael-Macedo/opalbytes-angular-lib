
export interface IColumnPaginatedButton {
  icon: string;
  label: string;
  onClick: (data: any) => void;
  tooltip?: string;
}

export interface IColumnPaginatedConfig {
  type:
    | "STRING"
    | "BOOLEAN"
    | "SINGLE_BUTTON"
    | "DATE"
    | "NUMBER"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "actions";
  element?: string;
  key?: string;
  header: string;
  visible: boolean;
  sortable?: boolean;
  isDefaultSort?: boolean;
  defaultSortDirection?: "asc" | "desc";
  pipe?: any;
  buttons?: IColumnPaginatedButton[];
}

export interface ITablePaginatedConfig {
  columns: string[];
  subTitle?: string | null;
  result?: {
    noData: string;
    defaultMessage: string;
  };
  data: any[];
  columnData: Record<string, IColumnPaginatedConfig>;
  paginated?: boolean;
}
