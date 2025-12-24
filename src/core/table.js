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
   * Parse table full name into name and type
   * @param {string} fullName
   */
  static parseName(fullName) {
    if (typeof fullName !== "string") return {};

    const [type, name] = fullName.split("/", 2);
    return typeof name !== "undefined"? { type, name }: { name: type };
  }
}