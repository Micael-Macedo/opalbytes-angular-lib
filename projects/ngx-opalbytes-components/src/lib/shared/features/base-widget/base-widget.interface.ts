export interface ICaoWidgetOptions<TData = unknown> {
  inputs?: Partial<Record<string, unknown>>;
  data?: TData;
  onSave?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}
