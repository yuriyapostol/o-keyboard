export interface TableRecord {
  key: string;
  value?: string;
  altValues?: string[];
}


export interface Table {
  name: string;
  type: string;
  title?: string;
  language?: string;
  values: TableRecord[];
}
