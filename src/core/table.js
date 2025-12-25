export class OKeyboardTable {
  constructor(props = {}) {
    if (!props.name) {
      throw new Error("OKeyboardTable: table.name is required");
    }
    if (!props.type) {
      throw new Error("OKeyboardTable: table.type is required");
    }
    this.set(props);
  }

  /**
   * Set table properties
   * @param {Object} props
   */
  set(props = {}) {
    //Object.keys(this).forEach(k => delete this[k]);
    Object.assign(this, JSON.parse(JSON.stringify(props)));
    return this;
  }

  /**
   * Get or set value in this table
   * @param {string} key
   * @param {string} [value]
   * @return {any}
   */
  value(key, value) {
    let entry = this.values.find(v => v.key === key);
    if (!entry) {
      entry = { key };
      this.values.push(entry);
    }
    if (value !== undefined) {
      entry.value = value;
    }
    return entry.value;
  }

  /**
   * Get or set data entry in this table
   * @param {string | Object | (string | Object)[]} data
   * @return {Object | Object[] | null}
   */
  data(data) {
    if (typeof data === "string") return this.values.find(v => v.key === data);
    else if (Array.isArray(data)) return data.map(d => this.data(d));
    else if (typeof data === "object" && typeof data.key === "string") {
      let entry = this.values.find(v => v.key === data.key);
      if (!entry) {
        entry = { key: data.key };
        this.values.push(entry);
      }
      Object.assign(entry, data);
      return entry;
    }
    return null;
  }


  /**
   * Parse table full name into name and type
   * @param {string} fullName
   * @return {Object} {type, name}
   */
  static parseName(fullName) {
    if (typeof fullName !== "string") return {};

    const [type, name] = fullName.split("/", 2);
    return typeof name !== "undefined"? { type, name }: { name: type };
  }
}