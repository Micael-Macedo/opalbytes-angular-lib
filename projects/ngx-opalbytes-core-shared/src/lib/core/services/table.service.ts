import { Injectable, signal, computed } from "@angular/core";

export interface IColumnButton<T = unknown> {
  icon: string;
  label: string;
  onClick: (data: T) => void;
  tooltip?: string;
}

export interface IColumnConfig<T = unknown> {
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
  buttons?: IColumnButton<T>[];
}

export interface ITableConfig<T = unknown> {
  columns: string[];
  data: T[];
  columnData: Record<string, IColumnConfig<T>>;
  subTitle?: string | null;
  result?: { noData: string; defaultMessage: string };
}

@Injectable({
  providedIn: "root",
})
export class TableService {
  private _tableConfig = signal<ITableConfig<unknown> | null>(null);
  private _data = signal<unknown[]>([]);
  private _columns = signal<IColumnConfig<unknown>[]>([]);

  readonly tableConfig = computed(() => this._tableConfig());
  readonly data = computed(() => this._data());
  readonly columns = computed(() => this._columns());
  readonly visibleColumns = computed(() =>
    this._columns()
      .filter((c) => c.visible)
      .map((c) => c.key || c.element || "")
  );

  createTable<T>(
    data: T[],
    columns: IColumnConfig<T>[],
    customConfig?: Partial<ITableConfig<T>>
  ): void {
    const columnData: Record<string, IColumnConfig<T>> = {};
    columns.forEach((c) => {
      columnData[c.key || c.element || ""] = {
        ...c,
        visible: c.visible ?? true,
      };
    });

    this._tableConfig.set({
      columns: columns.map((c) => c.key || c.element || ""),
      data,
      columnData,
      result: {
        noData: "Não há dados para o filtro selecionado.",
        defaultMessage: "Nenhum resultado encontrado.",
      },
      ...customConfig,
    } as ITableConfig<unknown>);
    this._columns.set(columns as IColumnConfig<unknown>[]);
    this._data.set(data as unknown[]);
  }

  toggleColumnVisibility(columnKey: string): void {
    this._columns.update((cols) =>
      cols.map((col) =>
        col.key === columnKey || col.element === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  }

  setData<T>(data: T[]): void {
    this._data.set(data as unknown[]);
    const config = this._tableConfig();
    if (config) {
      this._tableConfig.set({ ...config, data: data as unknown[] });
    }
  }
}
