export type ModalType =
  | "validation"
  | "finger"
  | "facial"
  | "clinic"
  | "graph"
  | "restriction"
  | "default";

export interface IModal {
  status: boolean;
  data?: any;
  type: ModalType;
  modal?: string;
}

export type ModalTypeClass = "default" | "custom";
export type ModalTypeSize =
  | "w-100"
  | "w-90"
  | "w-80"
  | "w-75"
  | "w-70"
  | "w-60"
  | "w-50"
  | "w-40"
  | "w-30"
  | "w-20"
  | "w-10";