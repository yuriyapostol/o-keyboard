import { OKeyboardTable, OKeyboardTables } from "./table.js";

export class OKeyboardLayout {
  constructor(props = {}) {
    if (!props.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }

    this.labels = [];
    this.tables = new OKeyboardTables();
    this.set(props);
  }

  /**
   * Set layout properties
   * @param {Object} props
   */
  set(props = {}) {
    const { labels, tables, ...rest } = JSON.parse(JSON.stringify(props));

    if (Object.keys(rest).length) Object.assign(this, rest);

    if (tables) {
      this.tables = new OKeyboardTables(tables);
    }

    if (labels) {
      if (!Array.isArray(labels)) {
        throw new Error("OKeyboardLayout: labels must be an array");
      }
      this.labels = labels;

      const labelsLength = labels.length || 9;
      const labelPositions = labels.map(l => parseInt(l?.position) || 0) || [];

      for (let i = 0, j = 0; i < labelsLength; i++) {
        if (!labels[i]) labels[i] = {};
        
        while (labelPositions.includes(j)) j++;
        if (typeof labelPositions[i] !== "number") labelPositions[i] = j;
        labels[i].position = labelPositions[i];

        if (labels[i].valueTable) {
          if (Array.isArray(labels[i].valueTable)) {
            labels[i].valueTable.forEach((t, j) => {
              t = OKeyboardTables.parseName(t);
              if (!t.type || !t.name) {
                throw new Error("OKeyboardLayout: labels[" + i + "].valueTable[" + j + "] is invalid");
              }
              t = this.tables.find(t);
              if (!t) {
                throw new Error("OKeyboardLayout: labels[" + i + "].valueTable[" + j + "] not found");
              }
              labels[i].valueTable[j] = t;
            });
            labels[i].valueTable.values = this.tables.filter(labels[i].valueTable).mergedValues();
          }
          else {
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

        if (typeof labels[i].codeTable === "string") labels[i].codeTable = OKeyboardTable.parseName(labels[i].codeTable);
        else if (typeof labels[i].codeTable === "object") {
          const { type = labels[i].codeTable.type, name } = OKeyboardTable.parseName(labels[i].codeTable.name);
          labels[i].codeTable = { type, name };
        }
        if (labels[i].codeTable) {
          if (!labels[i].codeTable.type || !labels[i].codeTable.name) {
            throw new Error("OKeyboardLayout: labels[" + i + "].codeTable is invalid");
          }
          if (! this.table(labels[i].codeTable)) {
            throw new Error("OKeyboardLayout: labels[" + i + "].codeTable not found");
          }
        }
      }
    }

    return this;
  }

  /**
   * Get or set table in this layout
   * @param {string | Object} table
   * @return {OKeyboardTable}
   */
  /*table(table) {
    if (typeof table === "string") {
      const { type, name } = OKeyboardTables.parseName(table);
      return this.tables.find(t => (!type || t.type === type) && t.name === name);
    }

    if (typeof table === "object") {
      let { type = table.type, name } = OKeyboardTables.parseName(table.name);

      if (!name) {
        throw new Error("OKeyboardLayout.table(): table.name is required");
      }
      if (!type) {
        throw new Error("OKeyboardLayout.table(): table.type is required");
      }

      let existing = this.tables.find(t => t.type === type && t.name === name);

      if (existing) {
        existing.set({ ...table, type, name });
        return existing;
      }

      const created = new OKeyboardTable({ ...table, type, name });
      this.tables.push(created);
      return created;
    }
  }*/
}
