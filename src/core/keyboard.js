export class OKeyboard {
  /**
   * options:
   *  - container: DOM element where keyboard will be rendered (required)
   *  - layout: layout object (required)
   *  - tables: tables array (required for letter lookups)
   *  - phoneticAlphabets: phonetic alphabets array (optional)
   *  - onKeyDown: function(key) called on mouse down or physical key down
   *  - onKeyUp: function(key) called on mouse up or physical key up
   *  - onPress: function(key) called when a physical keyboard key is pressed
   */
  constructor(options = {}) {
    if (!options.container) throw new Error("OKeyboard: container is required");
    this.container = (typeof options.container === 'string') ? document.querySelector(options.container) : options.container;
    if (!this.container || !(this.container instanceof HTMLElement)) {
      throw new Error("OKeyboard: container is not a valid DOM element");
    }
    
    if (!options.layout) throw new Error("OKeyboard: layout is required");
    this.layout = JSON.parse(JSON.stringify(options.layout));
    
    this.tables = options.tables || [];
    this.phoneticAlphabets = options.phoneticAlphabets || [];

    this.onKeyDown = options.onKeyDown || (() => {});
    this.onKeyUp = options.onKeyUp || (() => {});
    this.onPress = options.onPress || (() => {});

    this._bound = {
      physicalKeyDown: this._physicalKeyDown.bind(this),
      physicalKeyUp: this._physicalKeyUp.bind(this),
      docMouseUp: this._documentMouseUp.bind(this),
      blur: this._windowBlur.bind(this)
    };

    this.keysPressed = [];
    this._rendered = false;

    this.render();
    this.attachDomEvents();
    this.attachPhysicalEvents();
  }

  // ----- render and helpers -----
  render() {
    const layout = this.layout;
    const labelsLength = layout.labels?.length || 9;
    const labelPositions = layout.labels?.map(l => parseInt(l?.position)) || [];
    const labels = [];
    const styles = [];
    let html = "";
    let longestRowSize = 0;

    for (let i = 0, j = 0; i < labelsLength; i++) {
      while (labelPositions.includes(j)) j++;
      if (typeof labelPositions[i] !== "number") labelPositions[i] = j;
      labels[i] = { ...(layout.labels?.[i] || {}) };
      labels[i].position = labelPositions[i];
      if (!labels[i].type) labels[i].type = "undefined";
      if (labels[i].type === "letter" && labels[i].table) {
        labels[i].tableData = this.tables.find(t => t.id === labels[i].table);
      }
      if (labels[i].type === "phoneticAlphabet" && labels[i].name) {
        labels[i].phoneticData = this.phoneticAlphabets.find(t => t.name === labels[i].name);
      }
      if (labels[i].size) {
        styles.push(`.key button svg .${labels[i].position ? 'key-alt-label-' + labels[i].position : 'key-label'} tspan { font-size: ${labels[i].size}em; }`);
      }
    }

    const letterLabelIndex = labels.findIndex(l => l.type === "letter");
    if (!layout.rows) layout.rows = [];

    for (let i = 0, row = 0; i < layout.keys.length; i++) {
      if (typeof layout.keys[i] === "string") {
        layout.keys[i] = { letter: layout.keys[i] };
        if (row) layout.keys[i].row = row;
      }
      else if (Array.isArray(layout.keys[i])) {
        const l = layout.keys[i].length;
        layout.keys.splice(i, 1, ...(layout.keys[i]).map(k => { k = { letter: k }; if (row) k.row = row; return k; }));
        i += l - 1;
        row++;
      }
    }
    layout.keys.forEach(key => {
      if (!key) key = {};
      const keyLetter = labels[letterLabelIndex]?.tableData?.letters?.find(l => l.letter === key.letter);
      if (!key.code) key.code = keyLetter?.code;
      if (!key.labels) key.labels = [];

      for (let i = 0; i < labelsLength; i++) {
        const tCaseFunc = labels[i].case === "upper"
          ? t => t.toUpperCase()
          : ( labels[i].case === "lower"
            ? t => t.toLowerCase()
            : t => t
            );

        if (!key.labels[i]) {
          key.labels[i] = [];
          if (i === letterLabelIndex) key.labels[i] = [tCaseFunc(key.letter)];
          else if (labels[i].type === "letter") key.labels[i] = labels[i].tableData?.letters?.filter(l => l.code === key.code && l.letter !== key.letter)?.map(l => tCaseFunc(l.letter));
          else if (labels[i].type === "phoneticAlphabet") {
            let f = labels[i].phoneticData?.letters?.find(l => l.letter === key.letter);
            if (f) {
              if (f.altNames) key.labels[i] = [ f.name, ...f.altNames ];
              else key.labels[i] = [ f.name ];
            }
          }
        } else {
          if (!Array.isArray(key.labels[i])) key.labels[i] = [key.labels[i]];
        }
        key.labels[i] = key.labels[i].map(t => {
          if (labels[i].type === "letter") t = ((t && labels[i].tableData?.letters?.filter(l => (Array.isArray(t))? t.flat(2).includes(l.letter): l.letter === t)) || labels[i].tableData?.letters?.filter(l => l.code === key.code && l.letter !== key.letter))?.map(l => tCaseFunc(l.letter)).join("</tspan><tspan> </tspan><tspan>") || "";
          else if (labels[i].type === "phoneticAlphabet") t = labels[i].phoneticData?.letters?.find(l => l.letter === (t || key.letter))?.name || t || "";
          return t;
        });
      }

      if (typeof key.row !== "number") {
        let defRow = 0;
        while (layout.keys.filter(k => typeof k.row === "number" && k.row === defRow).length >= (layout.rows[defRow]?.maxKeys || layout.maxRowKeys || 0xFFFF)) defRow++;
        key.row = defRow;
      }
      if (!layout.rows[key.row]) layout.rows[key.row] = {};
      if (!layout.rows[key.row].columns) layout.rows[key.row].columns = [];

      if (typeof key.column !== "number") {
        let defColumn = 0;
        while (layout.keys.filter(k => typeof k.row === "number" && k.row === key.row && typeof k.column === "number" && k.column === defColumn).length >= (layout.rows[key.row].columns[defColumn]?.maxKeys || layout.maxColumnKeys || 0xFFFF)) defColumn++;
        key.column = defColumn;
      }
      if (!layout.rows[key.row].columns[key.column]) layout.rows[key.row].columns[key.column] = {};
      if (!layout.rows[key.row].columns[key.column].keys) layout.rows[key.row].columns[key.column].keys = [];
      layout.rows[key.row].columns[key.column].keys.push(key);
    });

    layout.rows.forEach(row => {
      let rowSize = row.columns.reduce((s, c) => s + c.keys.length, 0);
      if (rowSize > longestRowSize) longestRowSize = rowSize;
      html += `<div class="keyrow">`;
      row.columns.forEach(column => {
        html += `<div class="keycolumn">`;
        column.keys.forEach(key => {
          let keyHTML = "";
          for (let i = 0; i < labelsLength; i++) {
            keyHTML += `<text class="${labels[i].position? 'key-alt-label key-alt-label-' + labels[i].position: 'key-label'}">` +
              key.labels[i].map((t, j) => `<tspan${labels[i].direction === "column"? ' x="0" dy="' + ((j? 1: 1 - key.labels[i].length) * 30 * 1.1 * labels[i].size).toFixed(1) + '"': (j? ' dx="' + (30 * 0.2 * labels[i].size).toFixed(1) + '"': '')}>${t}</tspan>`).join("") +
              `</text>`;
          }
          html += `<div class="key${key.hilighted? ' key-hilighted': ''}${key.disabled? ' key-disabled': ''}" data-key="${key.letter}">` +
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

  // ----- DOM events for on-screen keys -----
  attachDomEvents() {
    if (!this._rendered) return;
    this.container.querySelectorAll(".key").forEach(element => {
      const button = element.querySelector("button"),
        letter = element.getAttribute("data-key"),
        key = this.layout.keys.find(l => l.letter === letter);

      const onMouseDown = (event) => {
        if (key.disabled) return;
        key.pressed = +(Date.now());
        element.querySelector("button").focus();
        element.classList.add("key-pressed");
        this.keysPressed.push({ key, element, event });
        try { this.onKeyDown(key, event); } catch (e) { console.error(e); }
      };

      const onMouseUp = (event) => {
        element.classList.remove("key-pressed");
        key.pressed = false;
        const i = this.keysPressed.findIndex(k => k.key.letter === key.letter);
        if (i >= 0) this.keysPressed.splice(i, 1);
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

  // ----- physical keyboard events -----
  attachPhysicalEvents() {
    document.addEventListener("keydown", this._bound.physicalKeyDown);
    document.addEventListener("keyup", this._bound.physicalKeyUp);
    document.addEventListener("mouseup", this._bound.docMouseUp);
    window.addEventListener("blur", this._bound.blur);
  }

  _physicalKeyDown(event) {
    const letter = (event.key || "").toLowerCase();
    const key = this.layout.keys.find(k => k.letter === letter);
    if (!key || key.pressed || key.disabled) return;
    key.pressed = +(Date.now());
    const element = this.container.querySelector(`.key[data-key="${key.letter}"]`);
    if (element) {
      element.classList.add("key-pressed");
      element.querySelector(`button`).focus();
    }
    this.keysPressed.push({ key, element, event });
    try { this.onPress(key, event); } catch (err) { console.error(err); }
    try { this.onKeyDown(key, event); } catch (err) { console.error(err); }
  }

  _physicalKeyUp(event) {
    const letter = (event.key || "").toLowerCase();
    const key = this.layout.keys.find(k => k.letter === letter);
    if (!key) return;
    const element = this.container.querySelector(`.key[data-key="${key.letter}"]`);
    if (element) element.classList.remove("key-pressed");
    key.pressed = false;
    try { this.onKeyUp(key, event); } catch (err) { console.error(err); }
    const i = this.keysPressed.findIndex(k => k.key.letter === letter);
    if (i >= 0) this.keysPressed.splice(i, 1);
  }

  _documentMouseUp() {
    this.keysPressed.forEach(k => {
      if (k.element) k.element.classList.remove("key-pressed");
      k.key.pressed = false;
    });
    this.keysPressed = [];
  }

  _windowBlur() {
    this._documentMouseUp();
  }

  // ----- external control API -----
  highlightKey(letter, highligh = true) {
    const element = this.container.querySelector(`.key[data-key="${letter}"]`);
    if (!element) return;
    const key = this.layout.keys.find(k => k.letter === letter);
    if (!key) return;
    key.disabled = !enable;
    if (highligh) element.classList.add("key-hilighted");
    else element.classList.remove("key-hilighted");
  }

  enableKey(letter, enable = true) {
    const element = this.container.querySelector(`.key[data-key="${letter}"]`);
    if (!element) return;
    const key = this.layout.keys.find(k => k.letter === letter);
    if (!key) return;
    key.disabled = !enable;
    if (enable) element.classList.remove("key-disabled"), element.querySelector("button").removeAttribute("disabled");
    else element.classList.add("key-disabled"), element.querySelector("button").setAttribute("disabled", "disabled");
  }

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
    this.keysPressed = [];
  }
}
