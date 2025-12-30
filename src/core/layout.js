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

        if (labels[i].codeTable) {
          let t = OKeyboardTables.parseName(labels[i].codeTable);
          if (!t.type || !t.name) {
            throw new Error("OKeyboardLayout: labels[" + i + "].codeTable is invalid");
          }
          t = this.tables.find(t);
          if (!t) {
            throw new Error("OKeyboardLayout: labels[" + i + "].codeTable not found");
          }
          labels[i].codeTable = t;
        }
      }
    }

    return this;
  }
}
