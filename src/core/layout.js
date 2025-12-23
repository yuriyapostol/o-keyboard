export class OKeyboardLayout {
  constructor(props = {}) {
    if (!props.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }
    this.set(props);
  }

  set(props = {}) {
    Object.keys(this).forEach(k => delete this[k]);
    Object.assign(this, JSON.parse(JSON.stringify(props)));
    return this;
  }
}
