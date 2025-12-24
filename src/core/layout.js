import { OKeyboardTable } from "./table.js";

export class OKeyboardLayout {
  constructor(props = {}) {
    if (!props.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }

    this.tables = [];
    this.set(props);
  }

  /**
   * Set layout properties
   * @param {Object} props
   */
  set(props = {}) {
    const { tables = [], ...rest } = props;

    if (Object.keys(rest).length) {
      Object.assign(this, JSON.parse(JSON.stringify(rest)));
    }

    if (props.tables) {
      this.tables = [];
      tables.forEach(t => this.table(t));
    }

    return this;
  }

  /**
   * Get or set table in this layout
   * @param {string|Object} table
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
