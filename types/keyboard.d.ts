import type { Layout, Key } from "./layouts.d.ts";
import type { Table } from "./tables.d.ts";


export interface OKeyboardOptions {
  container: HTMLElement | string;
  layout: Layout;

  /** DOM or physical key pressed */
  onKeyDown?: (key: Key, event: Event) => void;
  onKeyUp?: (key: Key, event: Event) => void;

  /**
   * Raw keyboard event:
   *   - event.key triggers this directly
   *   - used for real-keyboard typing
   */
  onPress?: (key: Key, event: Event) => void;
}


export interface OKeyboardInstance {
  container: HTMLElement;
  layout: Layout;

  keysPressed: {
    key: Key;
    element: HTMLElement | null;
    event: Event;
  }[];

  destroy(): void;
}


export declare class OKeyboard implements OKeyboardInstance {
  constructor(options: OKeyboardOptions);

  container: HTMLElement;
  layout: Layout;
  
  keysPressed: {
    key: Key;
    element: HTMLElement | null;
    event: Event;
  }[];

  destroy(): void;
}
