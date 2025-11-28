export interface KeyDef {
  letter?: string;
  labels?: any[];
  code?: string;
  row?: number;
  column?: number;
  disabled?: boolean;
  hilighted?: boolean;
}

export interface Layout {
  id: string;
  title?: string;
  labels?: any[];
  keys: KeyDef[]|any;
  rows?: any;
}

export interface TableItem {
  letter: string;
  code: string;
}

export interface Table {
  id: string;
  title?: string;
  letters: TableItem[];
}

export interface PhoneticLetter {
  letter: string;
  name: string;
  altNames?: string[];
}

export interface PhoneticAlphabet {
  language: string;
  name: string;
  letters: PhoneticLetter[];
}

export interface Language {
  id: string;
  title?: string;
  table?: string;
}

export class OKeyboard {
  constructor(options: {
    container: HTMLElement;
    layout: Layout;
    tables?: Table[];
    phoneticAlphabets?: PhoneticAlphabet[];
    onKeyDown?: (key: KeyDef) => void;
    onKeyUp?: (key: KeyDef) => void;
    onPress?: (key: KeyDef) => void;
  });
  highlightKey(letter: string, add?: boolean): void;
  enableKey(letter: string, enable?: boolean): void;
  destroy(): void;
}

export const layouts: Layout[];
export const tables: Table[];
export const phoneticAlphabets: PhoneticAlphabet[];
export const languages: Language[];
