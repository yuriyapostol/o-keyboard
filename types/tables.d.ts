// ========== TABLE VALUE ==========

export interface TableValue {
  key: string;
  value?: string;
  altValues?: string[];
  letter?: string;
  code?: string | number;
}



// ========== FULL TABLE DEFINITION ==========

export interface DataTable {
  /** System name: "en", "itu", "uk-legal", ... */
  name: string;

  /** Table type: "letter", "morse-code", "phonetic-alphabet", etc */
  type: string;

  /** Human-readable title */
  title?: string;

  /** Language code (optional, mostly for letter tables) */
  language?: string;

  /** Actual payload */
  values: TableValue[];
}
