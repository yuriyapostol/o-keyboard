import { OKeyboardTable, OKeyboardTables } from "./table.js";

export class OKeyboardLayout {
  constructor(layout = {}) {
    if (!layout.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }

    this.labels = new OKeyboardKeyLabels();
    this.tables = new OKeyboardTables();
    this.set(layout);
  }

  /**
   * Set layout properties
   * @param {Object} layout
   */
  set(layout = {}) {
    const { labels, tables, ...rest } = JSON.parse(JSON.stringify(layout));

    if (Object.keys(rest).length) Object.assign(this, rest);

    if (tables) {
      this.tables = new OKeyboardTables(tables);
    }

    if (labels) {
      this.labels = new OKeyboardKeyLabels(labels);
      this.labels = labels;

      for (let i = 0; i < labels.length; i++) {
        if (labels[i].labelTable) {
          if (Array.isArray(labels[i].labelTable)) {
            labels[i].labelTable.forEach((t, j) => {
              t = OKeyboardTables.parseName(t);
              if (!t.type || !t.name) {
                throw new Error("OKeyboardLayout: labels[" + i + "].labelTable[" + j + "] is invalid");
              }
              t = this.tables.find(t);
              if (!t) {
                throw new Error("OKeyboardLayout: labels[" + i + "].labelTable[" + j + "] not found");
              }
              labels[i].labelTable[j] = t;
            });
            labels[i].labelTable.values = this.tables.filter(labels[i].labelTable).mergedValues();
          }
          else {
            let t = OKeyboardTables.parseName(labels[i].labelTable);
            if (!t.type || !t.name) {
              throw new Error("OKeyboardLayout: labels[" + i + "].labelTable is invalid");
            }
            t = this.tables.find(t);
            if (!t) {
              throw new Error("OKeyboardLayout: labels[" + i + "].labelTable not found");
            }
            labels[i].labelTable = t;
          }
        }

        if (labels[i].valueTable) {
          let t = OKeyboardTables.parseName(labels[i].valueTable);
          if (!t.type || !t.name) {
            throw new Error("OKeyboardLayout: labels[" + i + "].valueTable is invalid");
          }
          t = this.tables.find(t);
          if (!t) {
            throw new Error("OKeyboardLayout: labels[" + i + "].valueTable not found");
          }
          labels[i].valueTable = t;
        }
      }
    }

    return this;
  }
}

export class OKeyboardKeyLabel {
  /**
   * Create key label
   * @param {Object | string | undefined | (Object | string | undefined)[]} label
   */
  constructor(label = {}) {
    this.set(label);
  }

  /**
   * Set key label properties
   * @param {Object | string | undefined | (Object | string | undefined)[]} label
   */
  set(label = {}) {
    if (typeof label === "undefined" || label === null || typeof label === "string" || Array.isArray(label)) {
      label = { value: label };
    }
    if (typeof label.value === "undefined" || label.value === null) label.value = void 0;
    else if (Array.isArray(label.value)) {
      label.value = label.value.map(l => {
        if (typeof l === "string") return l;
        else if (l === null || typeof l === "undefined") return void 0;
        throw new Error("OKeyboardKeyLabel: if label.value is an array, its items must be strings or undefined (null)");
      });
    }
    else {
      throw new Error("OKeyboardKeyLabel: label.value must be a string, undefined (null), or an array of these");
    }
    if (typeof label.position !== "number" && typeof label.position !== "undefined") {
      throw new Error("OKeyboardKeyLabel: label.position must be a number or undefined");
    }
    if (Object.keys(label).length) Object.assign(this, label);
    return this;
  }
}

export class OKeyboardKeyLabels extends Array {
  /**
   * Create key label collection
   * @param {Array | number} [labels]
   */
  constructor(labels) {
    super();
    if (typeof labels === "number") {
      this.length = labels;
    }
    else if (Array.isArray(labels)) {
      this.push(...labels);
    }
    /*else {
      throw new Error("OKeyboardKeyLabels: labels must be an array");
    }*/
  }

  /**
   * Push label(s) to this collection
   * @param  {...(Object | OKeyboardKeyLabel)} labels
   */
  push(...labels) {
    // Determine positions already taken
    const positions = [];
    labels.forEach((l, i) => positions[i] = typeof l === "object" && l.position);
    let position = 0;

    labels.forEach((l, i) => {
      // Convert to OKeyboardKeyLabel if needed
      if (!(l instanceof OKeyboardKeyLabel)) {
        l = new OKeyboardKeyLabel(l);
      }

      // Find next available position
      while (positions.includes(position)) position++;
      if (typeof positions[i] !== "number") positions[i] = position;
      l.position = positions[i];

      super.push(l);
    });
  }
}