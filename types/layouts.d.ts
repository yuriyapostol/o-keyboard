import type { DataTable } from "./tables.d.ts";



// ========== KEYCODE CROSS-REFERENCE ==========

export interface KeyCodeRef {
  /** Table type ("morse-code", "letter", etc) */
  type: string;

  /** Table name ("itu", "uk-legal", "en", etc) */
  tableName: string;

  /** Filled automatically inside render() */
  table?: DataTable;
}



// ========== LABEL DEFINITIONS ==========

export interface KeyLabelDefinition {
  /** "letter", "phonetic-alphabet", etc */
  type?: string;

  /** Name of DataTable to attach */
  tableName?: string;

  /** Filled automatically by library */
  table?: DataTable;

  /** Optional keyCode mapping */
  keyCode?: KeyCodeRef;

  /** Layout position index inside SVG */
  position?: number;

  /** Multiplier for font-size */
  size?: number;

  /** Text transform */
  case?: "upper" | "lower";

  /** Label layout direction */
  direction?: "row" | "column";

  /** Which label is main in group */
  isMain?: boolean;
}



// ========== INDIVIDUAL KEY IN LAYOUT ==========

export interface LayoutKey {
  /** Raw pressed key identifier ("a", "b", "1", etc) */
  key: string;

  /** Filled from keyCode table if available */
  code?: string;

  /**
   * Label layers.
   * Each index corresponds to KeyLabelDefinition.
   */
  labels?: (string[] | null)[];

  row?: number;
  column?: number;

  disabled?: boolean;
  hilighted?: boolean;

  /** Timestamp or false */
  pressed?: boolean | number;
}



// ========== INTERNAL ROW/COLUMN STRUCTURES (generated dynamically) ==========

export interface LayoutRowColumn {
  keys: LayoutKey[];
  maxKeys?: number;
}

export interface LayoutRow {
  columns: LayoutRowColumn[];
  maxKeys?: number;
}



// ========== FULL LAYOUT DEFINITION ==========

export interface KeyboardLayout {
  name: string;
  title?: string;

  /** Label layers description */
  labels: KeyLabelDefinition[];

  /**
   * Keys: can be:
   *  - LayoutKey object
   *  - string
   *  - array of strings (row)
   */
  keys: (LayoutKey | string | (string | null)[] )[];

  /** Created dynamically by renderer */
  rows?: LayoutRow[];

  /** Limits (optional) */
  maxRowKeys?: number;
  maxColumnKeys?: number;
}
