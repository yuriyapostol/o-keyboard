/**
 * OKeyboard - On-screen keyboard component
 * @module OKeyboard
 * @author Yuriy Apostol <yuriyapostol@gmail.com>
 * @license MIT
 */

import { OKeyboardLayout } from "./layout.js";

export class OKeyboard {
  /**
   * Create a keyboard
   * @param {Object} options - Configuration options
   * @param {HTMLElement|string} options.container - Container element or selector
   * @param {Object} options.layout - Keyboard layout definition
   * @param {Function} [options.onKeyDown] - Callback for key down events
   * @param {Function} [options.onKeyUp] - Callback for key up events
   * @param {Function} [options.onPress] - Callback for key press events
   * @throws {Error} If required options are missing or invalid
   * @returns {OKeyboard} The created OKeyboard instance
   */
  constructor(options) {
    if (!options) throw new Error("OKeyboard: options are required");
    if (!options.container) throw new Error("OKeyboard: container is required");
    this.container = (typeof options.container === 'string') ? document.querySelector(options.container) : options.container;
    if (!this.container || !(this.container instanceof HTMLElement)) {
      throw new Error("OKeyboard: container is not a valid DOM element");
    }
    
    this.layouts = [];
    if (options.layout) this.layout(options.layout);
    //if (!options.layout) throw new Error("OKeyboard: layout is required");
    //this.layout = JSON.parse(JSON.stringify(options.layout));

    this.onKeyDown = options.onKeyDown || (() => {});
    this.onKeyUp = options.onKeyUp || (() => {});
    this.onPress = options.onPress || (() => {});

    this._bound = {
      physicalKeyDown: this._physicalKeyDown.bind(this),
      physicalKeyUp: this._physicalKeyUp.bind(this),
      docMouseUp: this._documentMouseUp.bind(this),
      blur: this._windowBlur.bind(this)
    };

    this._keysPressed = [];
    this._rendered = false;

    this.render();
    this.attachDomEvents();
    this.attachPhysicalEvents();
  }

  /**
   * Get or set keyboard layout
   * @param {string|Object} layout
   * @returns {OKeyboardLayout|undefined}
   */
  layout(layout) {
    if (typeof layout === "string") {
      return this.layouts.find(l => l.name === layout);
    }

    if (typeof layout === "object") {
      if (!layout.name) {
        throw new Error("OKeyboard.layout(): layout.name is required");
      }

      let existing = this.layouts.find(l => l.name === layout.name);

      if (existing) {
        existing.set(layout);
      }
      else {
        existing = new OKeyboardLayout(layout);
        this.layouts.push(existing);
      }

      this.layout = existing;
      //this.render();
      return existing;
    }
  }


  /**
   * Render the keyboard layout
   * @returns {void}
   */
  render() {
    this.layout.tables.forEach(t => {
      if (!t.values) t.values = [];
      t.values.forEach(v => {
        if (typeof v === "string") v = { key: v };
        if (typeof v.value === "undefined") v.value = v.key;
      });
    });

    const labelsLength = this.layout.labels?.length || 9;
    const labelPositions = this.layout.labels?.map(l => parseInt(l?.position) || 0) || [];
    const labels = [];
    const styles = [];
    let html = "";
    let longestRowSize = 0;

    for (let i = 0, j = 0; i < labelsLength; i++) {
      while (labelPositions.includes(j)) j++;
      if (typeof labelPositions[i] !== "number") labelPositions[i] = j;
      labels[i] = this.layout.labels?.[i] || {};
      labels[i].position = labelPositions[i];
      if (!labels[i].type) labels[i].type = "undefined";
      else if (labels[i].tableName) {
        labels[i].table = this.layout.tables.find(t => t.type === labels[i].type && t.name === labels[i].tableName);
      }
      if (labels[i].keyCode && labels[i].keyCode.type && labels[i].keyCode.tableName) {
        labels[i].keyCode.table = this.layout.tables.find(t => t.type === labels[i].keyCode.type && t.name === labels[i].keyCode.tableName);
      }
      if (labels[i].size) {
        styles.push(`.key button svg .${labels[i].position ? 'key-alt-label-' + labels[i].position : 'key-label'} tspan { font-size: ${labels[i].size}em; }`);
      }
    }

    const mainLabel = labels.find(l => l.isMain) || labels.find(l => l.keyCode) || labels.find(l => l.type === "letter");
    if (mainLabel) mainLabel.isMain = true;

    const keyCodeTable = (labels.find(l => l.isMain && l.keyCode) || labels.find(l => !l.position && l.keyCode) || labels.find(l => l.keyCode))?.keyCode?.table;
    
    if (!this.layout.rows) this.layout.rows = [];

    for (let i = 0, row = 0; i < this.layout.keys.length; i++) {
      if (typeof this.layout.keys[i] === "string") {
        this.layout.keys[i] = { key: this.layout.keys[i] };
        if (row) this.layout.keys[i].row = row;
      }
      else if (Array.isArray(this.layout.keys[i])) {
        const l = this.layout.keys[i].length;
        this.layout.keys.splice(i, 1, ...(this.layout.keys[i]).map(k => { k = { key: k }; if (row) k.row = row; return k; }));
        i += l - 1;
        row++;
      }
    }
    this.layout.keys.forEach(key => {
      if (!key) key = {};
      const keyCode = keyCodeTable?.values?.find(l => typeof key.key === "string"? l.key === key.key: Array.isArray(key.key)? key.key.flat(2).includes(l.key): false);
      if (!key.code && keyCode?.value) key.code = keyCode?.value;
      if (!key.labels) key.labels = [];

      for (let i = 0; i < labelsLength; i++) {
        const tCaseFunc = labels[i].case === "upper"
          ? t => (t?.toUpperCase && t.toUpperCase()) || t
          : ( labels[i].case === "lower"
            ? t => (t?.toLowerCase && t.toLowerCase()) || t
            : t => t
            );

        if (!key.labels[i]) {
          console.log("------------- Generating label", i, key.key);
          key.labels[i] = [];
            //console.log(`keyCode ${labels[i].keyCode?.type} - ${keyCodeTable?.type}`);
          if (labels[i].keyCode?.type === keyCodeTable?.type && labels[i].keyCode?.tableName !== keyCodeTable?.name) {
            console.log(keyCodeTable)
            labels[i].keyCode.table.values.filter(l => l.value === keyCode?.value)
              .map(l => labels[i].table.values.find(m => m.key === l.key && m.value !== keyCodeTable.values.find(n => n.key === l.key)?.value))
              .forEach(l => l && key.labels[i].push(tCaseFunc(l.value)));
          }
          else if (labels[i].table?.values) {
            labels[i].table.values.filter(l => keyCode? l.key === keyCode.key: l.key === key.key)
              .forEach(l => [ l.value, ...(l.altValues || []) ].forEach(l => key.labels[i].push(tCaseFunc(l))));
          }
            console.log(JSON.stringify(key.labels[i]))
          //if (i == mainLabel.position) key.labels[i] = [tCaseFunc(key.letter)];
          /*else if (labels[i].type === "letter") key.labels[i] = labels[i].table?.values?.filter(l => l.code === key.code && l.letter !== key.letter)?.map(l => tCaseFunc(l.letter));
          else if (labels[i].type === "phoneticAlphabet") {
            let f = labels[i].phoneticData?.letters?.find(l => l.letter === key.letter);
            if (f) {
              if (f.altNames) key.labels[i] = [ f.name, ...f.altNames ];
              else key.labels[i] = [ f.name ];
            }
          }*/
        } else {
          console.log("Processing label", i, key.key, key.labels[i]);
          if (!Array.isArray(key.labels[i])) key.labels[i] = [key.labels[i]];
        }
        //key.labels[i] = key.labels[i].map(t => {
        //  return ((t && labels[i].table?.values?.filter(l => (Array.isArray(t))? t.flat(2).includes(l.key): l.key === t)) || labels[i].table?.values?.filter(l => (keyCode? l.key === keyCode.key: l.key === key.key) && l.value !== key.key))?.map(l => tCaseFunc(l.letter)).join("</tspan><tspan> </tspan><tspan>") || "";
          //else if (labels[i].type === "phoneticAlphabet") t = labels[i].phoneticData?.letters?.find(l => l.letter === (t || key.letter))?.name || t || "";
          //return t;
        //});
      }

      if (typeof key.row !== "number") {
        let defRow = 0;
        while (this.layout.keys.filter(k => typeof k.row === "number" && k.row === defRow).length >= (this.layout.rows[defRow]?.maxKeys || this.layout.maxRowKeys || 0xFFFF)) defRow++;
        key.row = defRow;
      }
      if (!this.layout.rows[key.row]) this.layout.rows[key.row] = {};
      if (!this.layout.rows[key.row].columns) this.layout.rows[key.row].columns = [];

      if (typeof key.column !== "number") {
        let defColumn = 0;
        while (this.layout.keys.filter(k => typeof k.row === "number" && k.row === key.row && typeof k.column === "number" && k.column === defColumn).length >= (this.layout.rows[key.row].columns[defColumn]?.maxKeys || this.layout.maxColumnKeys || 0xFFFF)) defColumn++;
        key.column = defColumn;
      }
      if (!this.layout.rows[key.row].columns[key.column]) this.layout.rows[key.row].columns[key.column] = {};
      if (!this.layout.rows[key.row].columns[key.column].keys) this.layout.rows[key.row].columns[key.column].keys = [];
      this.layout.rows[key.row].columns[key.column].keys.push(key);
    });

    this.layout.rows.forEach(row => {
      let rowSize = row.columns.reduce((s, c) => s + c.keys.length, 0);
      if (rowSize > longestRowSize) longestRowSize = rowSize;
      html += `<div class="keyrow">`;
      row.columns.forEach(column => {
        html += `<div class="keycolumn">`;
        column.keys.forEach(key => {
          let keyHTML = "";
          for (let i = 0; i < labelsLength; i++) {
            keyHTML += `<text class="${labels[i].position? 'key-alt-label key-alt-label-' + labels[i].position: 'key-label'}">` +
              key.labels[i]?.map((t, j) => `<tspan${labels[i].direction === "column"? ' x="0" dy="' + ((j? 1: 1 - key.labels[i].length) * 30 * 1.1 * labels[i].size).toFixed(1) + '"': (j? ' dx="' + (30 * 0.2 * labels[i].size).toFixed(1) + '"': '')}>${t}</tspan>`).join("") +
              `</text>`;
          }
          html += `<div class="key${key.hilighted? ' key-hilighted': ''}${key.disabled? ' key-disabled': ''}" data-key="${key.key}">` +
            `<button${key.disabled? ' disabled': ''}>` +
            `<svg viewBox="0 0 100 150"><rect class="key-shadow"/><rect class="key-face"/><g class="key-labels">${keyHTML}</g></svg>` +
            `</button></div>`;
        });
        html += `</div>`;
      });
      html += `</div>`;
    });

    html += `<style>${styles.join(" ")}</style>`;

    this.container.style.setProperty("--key-width", +(1 / (longestRowSize || 1)).toFixed(4));
    this.container.innerHTML = html;
    this._rendered = true;
  }

  /**
   * Attach DOM event handlers to keys
   * @returns {void}
   */
  attachDomEvents() {
    if (!this._rendered) return;
    this.container.querySelectorAll(".key").forEach(element => {
      const button = element.querySelector("button"),
        keyName = element.getAttribute("data-key"),
        key = this.layout.keys.find(l => l.key === keyName);

      const onMouseDown = (event) => {
        if (!key || key.disabled) return;
        key.pressed = +(Date.now());
        element.querySelector("button").focus();
        element.classList.add("key-pressed");
        this._keysPressed.push({ key, element, event });
        try { this.onKeyDown(key, event); } catch (e) { console.error(e); }
      };

      const onMouseUp = (event) => {
        element.classList.remove("key-pressed");
        if (key) key.pressed = false;
        const i = this._keysPressed.findIndex(k => k.key.key === keyName);
        if (i >= 0) this._keysPressed.splice(i, 1);
        try { this.onKeyUp(key, event); } catch (e) { console.error(e); }
      };

      // store handlers for detach later
      if (!element.__okb_handlers) element.__okb_handlers = {};
      element.__okb_handlers.mousedown = onMouseDown;
      element.__okb_handlers.mouseup = onMouseUp;

      button.addEventListener("mousedown", onMouseDown);
      button.addEventListener("mouseup", onMouseUp);
    });
  }

  /**
   * Attach physical keyboard event handlers
   * @returns {void}
   */
  attachPhysicalEvents() {
    document.addEventListener("keydown", this._bound.physicalKeyDown);
    document.addEventListener("keyup", this._bound.physicalKeyUp);
    document.addEventListener("mouseup", this._bound.docMouseUp);
    window.addEventListener("blur", this._bound.blur);
  }

  _physicalKeyDown(event) {
    const keyName = (event.key || "").toLowerCase();
    const key = this.layout.keys.find(k => k.key === keyName);
    if (!key || key.pressed || key.disabled) return;
    key.pressed = +(Date.now());
    const element = this.container.querySelector(`.key[data-key="${key.key}"]`);
    if (element) {
      element.classList.add("key-pressed");
      element.querySelector(`button`).focus();
    }
    this._keysPressed.push({ key, element, event });
    try { this.onPress(key, event); } catch (err) { console.error(err); }
    try { this.onKeyDown(key, event); } catch (err) { console.error(err); }
  }

  _physicalKeyUp(event) {
    const keyName = (event.key || "").toLowerCase();
    const key = this.layout.keys.find(k => k.key === keyName);
    if (!key) return;
    const element = this.container.querySelector(`.key[data-key="${key.key}"]`);
    if (element) element.classList.remove("key-pressed");
    key.pressed = false;
    try { this.onKeyUp(key, event); } catch (err) { console.error(err); }
    const i = this._keysPressed.findIndex(k => k.key.key === keyName);
    if (i >= 0) this._keysPressed.splice(i, 1);
  }

  _documentMouseUp() {
    this._keysPressed.forEach(k => {
      if (k.element) k.element.classList.remove("key-pressed");
      k.key.pressed = false;
    });
    this._keysPressed = [];
  }

  _windowBlur() {
    this._documentMouseUp();
  }

  /**
   * Destroy the keyboard instance and detach all event handlers
   * @returns {void}
   */
  destroy() { 
    // detach DOM handlers
    this.container.querySelectorAll(".key").forEach(element => {
      const button = element.querySelector("button");
      if (element.__okb_handlers) {
        if (element.__okb_handlers.mousedown) button.removeEventListener("mousedown", element.__okb_handlers.mousedown);
        if (element.__okb_handlers.mouseup) button.removeEventListener("mouseup", element.__okb_handlers.mouseup);
        delete element.__okb_handlers;
      }
    });

    // detach global handlers
    document.removeEventListener("keydown", this._bound.physicalKeyDown);
    document.removeEventListener("keyup", this._bound.physicalKeyUp);
    document.removeEventListener("mouseup", this._bound.docMouseUp);
    window.removeEventListener("blur", this._bound.blur);

    // clear container
    this.container.innerHTML = "";
    this._rendered = false;
    this._keysPressed = [];
  }
}