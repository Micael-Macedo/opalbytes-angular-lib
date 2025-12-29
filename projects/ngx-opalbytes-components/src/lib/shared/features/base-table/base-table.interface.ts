
export interface IColumnButton {
  icon: string;
  label: string;
  onClick: (data: any) => void;
  tooltip?: string;
}

export interface IColumnConfig {
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
  buttons?: IColumnButton[];
}

export interface ITableConfig {
  columns: string[];
  subTitle?: string | null;
  result?: {
    noData: string;
    defaultMessage: string;
  };
  data: any[];
  columnData: Record<string, IColumnConfig>;
  paginated?: boolean;
}
