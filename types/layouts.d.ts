import type { Table } from "./tables.d.ts";

export interface KeyCode {
  type: string;
  tableName: string;
}

export interface KeyLabel {
  type?: string;
  tableName?: string;
  keyCode?: KeyCode;
  position?: number;
  size?: number;
  case?: "upper" | "lower";
  direction?: "row" | "column";
  isMain?: boolean;
}

export interface Key {
  key: string;
  code?: string;
  labels?: (string[] | null)[];

  row?: number;
  column?: number;

  disabled?: boolean;
  hilighted?: boolean;

  pressed?: boolean | number;
}

export interface LayoutRowColumn {
  keys: Key[];
  maxKeys?: number;
}

export interface LayoutRow {
  columns: LayoutRowColumn[];
  maxKeys?: number;
}

export interface Layout {
  name: string;
  title?: string;
  labels: KeyLabel[];
  keys: (Key | string | (string | null)[] )[];
  
  maxRowKeys?: number;
  maxColumnKeys?: number;
}
