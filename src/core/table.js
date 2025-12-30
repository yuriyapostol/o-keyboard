export class OKeyboardTableRow {
  /**
   * Create table row
   * @param {Object | string} row
   */
  constructor(row = {}) {
    if (typeof row === "string") {
      row = { key: row };
    }
    if (!row.key) {
      throw new Error("OKeyboardTableRow: row.key is required");
    }

    this.set(row);
  }

  /**
   * Set row properties
   * @param {Object | string} row
   */
  set(row = {}) {
    if (typeof row === "string") {
      row = { key: row };
    }
    if (typeof row.key !== "undefined" && typeof row.value === "undefined") {
      row.value = row.key;
    }
    if (Object.keys(row).length) Object.assign(this, row);
    return this;
  }
}

export class OKeyboardTableRows extends Array {
  /**
   * Create table rows
   * @param {Array | number} [rows]
   */
  constructor(rows) {
    super();
    if (typeof rows === "number") {
      if (rows > 0) {
        throw new Error("OKeyboardTableRows: empty rows are not supported");
      }
    }
    else if (rows?.length) {
      rows.forEach(r => this.push(new OKeyboardTableRow(r)));
    }
  }

  /**
   * Push row(s) to this collection
   * @param  {...(Object | string)} rows
   */
  push(...rows) {
    rows.forEach(r => super.push(new OKeyboardTableRow(r)));
    return this.length;
  }

  /**
   * Find row by callback, key, data object, or array of these
   * @param {Function | string | Object | (string | Object)[]} query
   * @return {OKeyboardTableRow | undefined}
   */
  find(query) {
    if (typeof query === "function") {
      return super.find(query);
    }
    else if (Array.isArray(query)) {
      for (let i = 0; i < query.length; i++) {
        const r = this.find(query[i]);
        if (r) return r;
      }
    }
    else if (typeof query === "string") {
      return super.find(r => r.key === query);
    }
    else if (typeof query === "object" && typeof query.key === "string") {
      return super.find(r => r.key === query.key);
    }
    return undefined;
  }

  /**
   * Filter rows by callback, key, data object, or array of these
   * @param {Function | string | Object | (string | Object)[]} query
   * @return {OKeyboardTableRow[]}
   */
  filter(query) {
    if (typeof query === "function") {
      return super.filter(query);
    }
    else if (Array.isArray(query)) {
      let results = [];
      query.forEach(q => {
        results = results.concat(this.filter(q));
      });
      return results;
    }
    else if (typeof query === "string") {
      return super.filter(r => r.key === query);
    }
    else if (typeof query === "object" && typeof query.key === "string") {
      return super.filter(r => r.key === query.key);
    }
    return [];
  }
}

export class OKeyboardTable {
  constructor(table = {}) {
    if (!table.name) {
      throw new Error("OKeyboardTable: table.name is required");
    }
    if (!table.type) {
      throw new Error("OKeyboardTable: table.type is required");
    }

    this.values = new OKeyboardTableRows();
    this.set(table);
  }

  /**
   * Set table properties
   * @param {Object} props
   */
  set(props = {}) {
    let { values, ...rest } = JSON.parse(JSON.stringify(props));

    if (Object.keys(rest).length) Object.assign(this, rest);
    if (values) {
      this.values = new OKeyboardTableRows(values);
    }
    return this;
  }
}

export class OKeyboardTables extends Array {
  /**
   * Create table collection
   * @param {Array | number} [tables]
   */
  constructor(tables = []) {
    super();
    if (typeof tables === "number") {
      if (tables > 0) {
        throw new Error("OKeyboardTables: empty tables are not supported");
      }
    }
    else if (tables?.length) {
      tables.forEach(t => this.push(new OKeyboardTable(t)));
    }
  }

  /**
   * Push table(s) to this collection
   * @param  {...(Object | OKeyboardTable)} tables
   */
  push(...tables) {
    tables.forEach(t => {
      if (t instanceof OKeyboardTable) {
        super.push(t);
      }
      else {
        super.push(new OKeyboardTable(t));
      }
    });
    return this.length;
  }

  /**
   * Find table by callback, name, or data object
   * @param {Function | string | Object} query
   * @return {OKeyboardTable | undefined}
   */
  find(query) {
    if (typeof query === "function") {
      return super.find(query);
    }
    else if (Array.isArray(query)) {
      for (let i = 0; i < query.length; i++) {
        const t = this.find(query[i]);
        if (t) return t;
      }
    }
    else if (typeof query === "string") {
      const { type, name } = parseName(query);
      return super.find(t => (!type || t.type === type) && t.name === name);
    }
    else if (typeof query === "object" && typeof query.name === "string") {
      const { type = query.type, name } = parseName(query.name);
      return super.find(t => (!type || t.type === type) && t.name === name);
    }
    return undefined;
  }

  /**
   * Filter tables by callback, name, or data object
   * @param {Function | string | Object} query
   * @return {OKeyboardTables}
   */
  filter(query) {
    if (typeof query === "function") {
      return new this.constructor(super.filter(query));
    }
    else if (Array.isArray(query)) {
      let results = new this.constructor();
      query.forEach(q => {
        results = new this.constructor([...results, ...this.filter(q)]);
      });
      return results;
    }
    else if (typeof query === "string") {
      const { type, name } = parseName(query);
      return new this.constructor(super.filter(t => (!type || t.type === type) && t.name === name));
    }
    else if (typeof query === "object" && typeof query.name === "string") {
      const { type = query.type, name } = parseName(query.name);
      return new this.constructor(super.filter(t => (!type || t.type === type) && t.name === name));
    }
    return new this.constructor([]);
  }

  /**
   * Get merged values from all tables in this collection
   * @return {OKeyboardTableRows}
   */
  mergedValues() {
    let merged = new OKeyboardTableRows();
    this.forEach(t => {
      t.values.forEach(v => {
        if (!merged.find(v.key)) {
          merged.push(v);
        }
      });
    });
    return merged;
  } 

  /**
   * Parse table full name into name and type
   * @param {string | Object} fullName
   * @return {Object} {type, name}
   */
  static parseName(fullName) {
    return parseName(fullName);
  }
}

/**
 * Parse table full name into name and type
 * @param {string | Object} fullName
 * @return {Object} {type, name}
 */
function parseName(fullName) {
  if (typeof fullName === "object" && typeof fullName.name === "string") {
    const { type = fullName.type, name } = parseName(fullName.name);
    return typeof type !== "undefined"? { type, name }: { name: type };
  }

  if (typeof fullName !== "string") return {};

  const [type, name] = fullName.split("/", 2);
  return typeof name !== "undefined"? { type, name }: { name: type };
}