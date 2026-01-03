/**
 * OKeyboard Table Module
 * @module OKeyboardTable
 * @description
 * This module provides classes to manage keyboard data tables.
 * It includes classes for individual table rows, collections of rows, individual tables, and collections of tables.
 * @author Yuriy Apostol <yuriyapostol@gmail.com>
 * @license MIT
 */

/**
 * OKeyboard Table Row
 * @class OKeyboardTableRow
 * @classdesc Represents a single row in an OKeyboard table.
 * @param {Object | string} row - The row data or key string.
 * @throws {Error} If row.key is not provided
 * @memberof module:OKeyboardTable
 * @example
 * const row = new OKeyboardTableRow({ key: "a", value: "a", altValues: ["á", "à"] });
 * console.log(row); // { key: "a", value: "a", altValues: ["á", "à"] }
 * @example
 * const row = new OKeyboardTableRow("a");
 * console.log(row); // { key: "a", value: "a" }
 */
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

/**
 * OKeyboard Table Rows Collection
 * @class OKeyboardTableRows
 * @classdesc Represents a collection of OKeyboard table rows. It extends the native Array class to provide additional functionality for managing table rows.
 * @param {(OKeyboardTableRow | Object | string)[] | number} [rows] - An array of row data or a number to set the initial length.
 * @memberof module:OKeyboardTable
 * @example
 * const rows = new OKeyboardTableRows(["a", "b"]);
 * console.log(rows); // [ { key: "a", value: "a" }, { key: "b", value: "b" } ]
 * @example
 * const rows = new OKeyboardTableRows([
 *   { key: "a", value: ".-" },
 *   { key: "b", value: "-..." }
 * ]);
 * rows.find("a").value = ".-."; // modify row value
 * console.log(rows);
 * // [
 * //   { key: "a", value: ".-." },
 * //   { key: "b", value: "-..." }
 * // ]
 */
export class OKeyboardTableRows extends Array {
  /**
   * Create table rows
   * @param {(OKeyboardTableRow | Object | string)[] | number} [rows]
   */
  constructor(rows) {
    super();
    if (typeof rows === "number") {
      this.length = rows;
    }
    else if (Array.isArray(rows)) {
      this.push(...rows);
    }
  }

  /**
   * Push row(s) to this collection
   * @param  {...(OKeyboardTableRow | Object | string)} rows
   */
  push(...rows) {
    rows.forEach(r => {
      if (r instanceof OKeyboardTableRow) {
        super.push(r);
      }
      else {
        super.push(new OKeyboardTableRow(r));
      }
    });
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

  clear () {
    this.length = 0;
    return this;
  }
}

/**
 * OKeyboard Table
 * @class OKeyboardTable
 * @classdesc Represents an OKeyboard table containing multiple rows of data.
 * @param {Object} table - The table data.
 * @throws {Error} If table.name or table.type is not provided
 * @memberof module:OKeyboardTable
 * @example
 * const table = new OKeyboardTable({
 *   name: "itu",
 *   type: "morse-code",
 *   values: [
 *     { key: "a", value: ".-" },
 *     { key: "b", value: "-..." }
 *   ]
 * });
 * table.values.push({ key: "c", value: "-.-." });
 * console.log(table);
 * // {
 * //   name: "itu",
 * //   type: "morse-code",
 * //   values: [
 * //     { key: "a", value: ".-" },
 * //     { key: "b", value: "-..." },
 * //     { key: "c", value: "-.-." }
 * //   ]
 * // }
 */
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
   * @param {Object} table
   */
  set(table = {}) {
    let { values, ...rest } = JSON.parse(JSON.stringify(table));

    if (Object.keys(rest).length) Object.assign(this, rest);
    if (values) {
      this.values = new OKeyboardTableRows(values);
    }
    return this;
  }
}

/**
 * OKeyboard Tables Collection
 * @class OKeyboardTables
 * @classdesc Represents a collection of OKeyboard tables. It extends the native Array class to provide additional functionality for managing tables.
 * @param {(OKeyboardTable | Object)[] | number} [tables] - An array of table data or a number to set the initial length.
 * @memberof module:OKeyboardTable
 * @example
 * // create tables collection
 * const tables = new OKeyboardTables([
 *   {
 *     name: "itu",
 *     type: "morse-code",
 *     values: [
 *       { key: "a", value: ".-" },
 *       { key: "b", value: "-..." }
 *     ]
 *   },
 *   {
 *     name: "custom",
 *     type: "example",
 *     values: [
 *       { key: "x", value: "1" },
 *       { key: "y", value: "2" }
 *     ]
 *   }
 * ]);
 * 
 * // find table by name and get its row keys
 * const keys = tables.find("morse-code/itu")?.values.map(row => row.key);
 * // [ "a", "b" ]
 * 
 * // filter merged values from all tables
 * const values = tables.tableValues().filter(["a", "c"]);
 * // [ { key: "a", value: ".-" } ]
 */
export class OKeyboardTables extends Array {
  /**
   * Create table collection
   * @param {(OKeyboardTable | Object)[] | number} [tables]
   */
  constructor(tables) {
    super();
    if (typeof tables === "number") {
      this.length = tables;
    }
    else if (Array.isArray(tables)) {
      this.push(...tables);
    }
  }

  /**
   * Push table(s) to this collection
   * @param  {...(OKeyboardTable | Object)} tables
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
   * Find table by callback, name, data object, or array of these
   * @param {Function | (string | Object)[] | string | Object} query
   * @return {OKeyboardTable | undefined}
   * @example
   * const table = tables.find("morse-code/itu"); // Find by full name
   * const table = tables.find("itu"); // Find by name only
   * const table = tables.find({ name: "itu", type: "morse-code" }); // Find by data object 
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
      const { type, name } = tableName(query);
      return super.find(t => (!type || t.type === type) && t.name === name);
    }
    else if (typeof query === "object" && typeof query.name === "string") {
      const { type = query.type, name } = tableName(query.name);
      return super.find(t => (!type || t.type === type) && t.name === name);
    }
    return undefined;
  }

  /**
   * Filter tables by callback, name, data object, or array of these
   * @param {Function | (string | Object)[] | string | Object} query
   * @return {OKeyboardTables}
   * @example
   * const tables = tables.filter("morse-code/itu"); // Filter by full name
   * const tables = tables.filter("itu"); // Filter by name only
   * const tables = tables.filter({ type: "morse-code" }); // Filter by type in data object
   * const tables = tables.filter(["morse-code/itu", "morse-code/custom"]); // Filter by array of names
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
      const { type, name } = tableName(query);
      return new this.constructor(super.filter(t => (!type || t.type === type) && t.name === name));
    }
    else if (typeof query === "object" && typeof query.name === "string") {
      const { type = query.type, name } = tableName(query.name);
      return new this.constructor(super.filter(t => (!type || t.type === type) && t.name === name));
    }
    return new this.constructor([]);
  }

  clear () {
    this.length = 0;
    return this;
  }

  /**
   * Get merged values from all tables in this collection
   * @return {OKeyboardTableRows}
   */
  tableValues() {
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
   * Get table name and type from its full name or data object
   * @param {string | Object} fullName
   * @return {Object} {type, name}
   */
  static tableName(fullName) {
    return tableName(fullName);
  }
}

/**
 * Get table name and type from its full name or data object
 * @param {string | Object} fullName
 * @return {Object} {type, name}
 */
function tableName(fullName) {
  if (typeof fullName === "object" && typeof fullName.name === "string") {
    const { type = fullName.type, name } = tableName(fullName.name);
    return typeof type !== "undefined"? { type, name }: { name: type };
  }

  if (typeof fullName !== "string") return {};

  const [type, name] = fullName.split("/", 2);
  return typeof name !== "undefined"? { type, name }: { name: type };
}