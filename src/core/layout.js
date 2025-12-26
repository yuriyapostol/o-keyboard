import { OKeyboardTable } from "./table.js";

export class OKeyboardLayout {
  constructor(props = {}) {
    if (!props.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }

    this.labels = [];
    this.tables = [];
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
      this.tables = [];
      tables.forEach(t => this.table(t));
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

        if (!labels[i].valueTable) labels[i].valueTable = null;
        else if (typeof labels[i].valueTable === "string") labels[i].valueTable = OKeyboardTable.parseName(labels[i].valueTable);
        else if (typeof labels[i].valueTable === "object") {
          const { type = labels[i].valueTable.type, name } = OKeyboardTable.parseName(labels[i].valueTable.name);
          labels[i].valueTable = { type, name };
        }
        if (labels[i].valueTable) {
          if (!labels[i].valueTable.type || !labels[i].valueTable.name) {
            throw new Error("OKeyboardLayout: labels[" + i + "].valueTable is invalid");
          }
          if (! this.table(labels[i].valueTable)) {
            throw new Error("OKeyboardLayout: labels[" + i + "].valueTable not found");
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
  table(table) {
    if (typeof table === "string") {
      const { type, name } = OKeyboardTable.parseName(table);
      return this.tables.find(t => (!type || t.type === type) && t.name === name);
    }

    if (typeof table === "object") {
      let { type = table.type, name } = OKeyboardTable.parseName(table.name);

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
  }
}
