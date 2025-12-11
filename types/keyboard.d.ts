import type { KeyboardLayout, LayoutKey } from "./layouts.d.ts";
import type { DataTable } from "./tables.d.ts";



// ========== KEYBOARD OPTIONS ==========

export interface OKeyboardOptions {
  container: HTMLElement | string;

  /** Layout to render */
  layout: KeyboardLayout;

  /** Tables: letters, morse, phonetic, etc */
  tables: DataTable[];

  /** DOM or physical key pressed */
  onKeyDown?: (key: LayoutKey, event: Event) => void;
  onKeyUp?: (key: LayoutKey, event: Event) => void;

  /**
   * Raw keyboard event:
   *   - event.key triggers this directly
   *   - used for real-keyboard typing
   */
  onPress?: (key: LayoutKey, event: Event) => void;
}



// ========== INSTANCE SHAPE ==========

export interface OKeyboardInstance {
  container: HTMLElement;
  layout: KeyboardLayout;
  tables: DataTable[];

  keysPressed: {
    key: LayoutKey;
    element: HTMLElement | null;
    event: Event;
  }[];

  highlightKey(letter: string, highlight?: boolean): void;
  enableKey(letter: string, enable?: boolean): void;
  destroy(): void;
}



// ========== CLASS DECLARATION (no implementation) ==========

export declare class OKeyboard implements OKeyboardInstance {
  constructor(options: OKeyboardOptions);

  container: HTMLElement;
  layout: KeyboardLayout;
  tables: DataTable[];
  keysPressed: {
    key: LayoutKey;
    element: HTMLElement | null;
    event: Event;
  }[];

  highlightKey(letter: string, highlight?: boolean): void;
  enableKey(letter: string, enable?: boolean): void;
  destroy(): void;
}
