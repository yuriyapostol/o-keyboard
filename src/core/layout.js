/**
 * OKeyboard Layout Module
 * @module OKeyboardLayout
 * @description
 * This module provides classes to manage keyboard layouts.
 * @author Yuriy Apostol <yuriyapostol@gmail.com>
 * @license MIT
 */

import { OKeyboardTables } from "./table.js";

/**
 * OKeyboard Layout
 * @class OKeyboardLayout
 * @classdesc This class represents a keyboard layout, including its properties, layers and data tables.
 * @param {Object} layout - The layout object containing its structure and data.
 * @throws {Error} Throws an error if the layout base properties are not provided.
*/
export class OKeyboardLayout {
  /**
   * Create keyboard layout
   * @param {Object} layout
   */
  constructor(layout = {}) {
    if (!layout.name) {
      throw new Error("OKeyboardLayout: layout.name is required");
    }

    this.layers = new OKeyboardLayers();
    this.tables = new OKeyboardTables();

    this.layers.parentLayout = this;

    this.set(layout);
  }

  /**
   * Set layout properties
   * @param {Object} layout
   */
  set(layout = {}) {
    const { layers, layer, keys, labels, label, tables, table, ...rest } = JSON.parse(JSON.stringify(layout));

    if (Object.keys(rest).length) Object.assign(this, rest);

    if (tables) {
      this.tables.clear().push(...tables);
    }
    if (table) {
      this.tables.push(table);
    }

    if (layers) {
      this.layers.clear().push(...layers);
    }
    if (layer) {
      this.layers.push(layer);
    }

    if (labels) {
      this.labels?.clear().push(...labels);
    }
    if (label) {
      this.labels?.push(label);
    }

    if (keys) {
      this.keys?.clear().push(...keys);
    }

    return this;
  }
}

/**
 * OKeyboard Layout Layer
 * @class OKeyboardLayer
 * @classdesc This class represents a keyboard layout layer, including its properties and keys.
 * @param {Object} layer - The layer object containing its structure and data.
 * @throws {Error} Throws an error if the layer base properties are not provided.
*/
export class OKeyboardLayer {
  /**
   * Create layout layer
   * @param {Object} layer
   */
  constructor(layer = {}) {
    if (!layer.name) {
      throw new Error("OKeyboardLayer: layer.name is required");
    }
    if (!layer.keys) {
      throw new Error("OKeyboardLayer: layer.keys is required");
    }

    this.labels = new OKeyboardKeyLabels();
    this.keys = new OKeyboardKeys();

    if (layer.parentLayout) {
      this.labels.parentLayout = layer.parentLayout;
      this.keys.parentLayout = layer.parentLayout;
    }
    this.labels.parentLayer = this;
    this.keys.parentLayer = this;

    this.set(layer);
  }

  /**
   * Set layer properties
   * @param {Object} layer
   */
  set(layer = {}) {
    const { keys, labels, label, ...rest } = layer;

    if (Object.keys(rest).length) Object.assign(this, rest);

    if (labels) {
      this.labels.clear().push(...labels);
    }
    if (label) {
      this.labels.push(label);
    }

    if (keys) {
      this.keys.clear().push(...keys);
    }

    return this;
  }
}

/**
 * OKeyboard Layout Layers Collection
 * @class OKeyboardLayers
 * @classdesc This class represents a collection of keyboard layout layers.
 * @param {Array | number} [layers] - An array of layer objects or the number of layers to create.
*/
export class OKeyboardLayers extends Array {
  /**
   * Create layout layer collection
   * @param {Array | number} [layers]
   */
  constructor(layers) {
    super();
    if (typeof layers === "number") {
      this.length = layers;
    }
    else if (Array.isArray(layers)) {
      this.push(...layers);
    }
  }

  /**
   * Push layer(s) to this collection
   * @param  {...(Object | OKeyboardLayer)} layers
   */
  push(...layers) {
    layers.forEach(l => {
      if (this.parentLayout) {
        l.parentLayout = this.parentLayout;
      }

      if (!(l instanceof OKeyboardLayer)) {
        l = new OKeyboardLayer(l);
      }

      super.push(l);
    });
  }

  clear() {
    this.length = 0;
    return this;
  }
}

/**
 * OKeyboard Key
 * @class OKeyboardKey
 * @classdesc This class represents a keyboard key, including its properties and labels.
 * @param {Object} key - The key object.
 * @throws {Error} Throws an error if the key base properties are not provided.
*/
export class OKeyboardKey {
  /**
   * Create layout key
   * @param {Object} key
   */
  constructor(key = {}) {
    if (!key.key) {
      throw new Error("OKeyboardKey: key.key is required");
    }
    this.labels = new OKeyboardKeyLabels();
    if (key.parentLayout) {
      this.labels.parentLayout = key.parentLayout;
    }
    if (key.parentLayer) {
      this.labels.parentLayer = key.parentLayer;
    }
    this.labels.parentKey = this;
    this.set(key);
  }

  /**
   * Set key properties
   * @param {Object} key
   */
  set(key = {}) {
    if (Object.keys(key).length) Object.assign(this, key);
    return this;
  }
}

/**
 * OKeyboard Keys Collection
 * @class OKeyboardKeys
 * @classdesc This class represents a collection of keyboard keys.
 * @param {Array | number} [keys] - An array of key objects or the number of keys to create.
*/
export class OKeyboardKeys extends Array {
  /**
   * Create key collection
   * @param {Array | number} [keys]
   */
  constructor(keys) {
    super();
    if (typeof keys === "number") {
      this.length = keys;
    }
    else if (Array.isArray(keys)) {
      this.push(...keys);
    }
  }

  /**
   * Push key(s) to this collection
   * @param  {...(Object | OKeyboardKey)} keys
   */
  push(...keys) {
    keys.forEach(k => {
      // Convert to OKeyboardKey if needed
      if (!(k instanceof OKeyboardKey)) {
        k = new OKeyboardKey(k);
      }
      super.push(k);
    });
  }

  clear() {
    this.length = 0;
    return this;
  }
}

/**
 * OKeyboard Key Label
 * @class OKeyboardKeyLabel
 * @classdesc This class represents a keyboard key label.
 * @param {Object | string | undefined | (Object | string | undefined)[]} label - The label object or string.
*/
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
    if (Array.isArray(label.value)) {
      label.value = label.value.map(l => {
        if (typeof l === "string") return l;
        else if (l === null || typeof l === "undefined") return void 0;
        throw new Error("OKeyboardKeyLabel: if label.value is an array, its items must be strings or undefined (null)");
      });
    }
    else if (typeof label.value === "undefined" || label.value === null) label.value = void 0;
    else if (typeof label.value !== "string") {
      throw new Error("OKeyboardKeyLabel: label.value must be a string, undefined (null), or an array of these");
    }

    if (typeof label.position !== "number" && typeof label.position !== "undefined") {
      throw new Error("OKeyboardKeyLabel: label.position must be a number or undefined");
    }

    if (label.labelTable) {
      if (Array.isArray(label.labelTable)) {
        label.labelTable.forEach((t, j) => {
          t = OKeyboardTables.tableName(t);
          if (!t.type || !t.name) {
            throw new Error("OKeyboardLayout: label.labelTable[" + j + "] is invalid");
          }
          t = (this.parentLayout || label.parentLayout)?.tables?.find(t);
          if (!t) {
            throw new Error("OKeyboardLayout: label.labelTable[" + j + "] not found");
          }
          label.labelTable[j] = t;
        });
        label.labelTable.values = (this.parentLayout || label.parentLayout)?.tables?.filter(label.labelTable).tableValues();
      }
      else {
        let t = OKeyboardTables.tableName(label.labelTable);
        if (!t.type || !t.name) {
          throw new Error("OKeyboardLayout: label.labelTable is invalid");
        }
        t = (this.parentLayout || label.parentLayout)?.tables?.find(t);
        if (!t) {
          throw new Error("OKeyboardLayout: label.labelTable not found");
        }
        label.labelTable = t;
      }
    }

    if (label.valueTable) {
      let t = OKeyboardTables.tableName(label.valueTable);
      if (!t.type || !t.name) {
        throw new Error("OKeyboardLayout: label.valueTable is invalid");
      }
      t = (this.parentLayout || label.parentLayout)?.tables?.find(t);
      if (!t) {
        throw new Error("OKeyboardLayout: label.valueTable not found");
      }
      label.valueTable = t;
    }

    if (Object.keys(label).length) Object.assign(this, label);
    return this;
  }
}

/**
 * OKeyboard Key Labels Collection
 * @class OKeyboardKeyLabels
 * @classdesc This class represents a collection of keyboard key labels.
 * @param {Array | number} [labels] - An array of label objects or the number of labels to create.
*/ 
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
      if (this.parentLayout) {
        l.parentLayout = this.parentLayout;
      }
      if (this.parentLayer) {
        l.parentLayer = this.parentLayer;
      }
      if (this.parentKey) {
        l.parentKey = this.parentKey;
      }

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

  clear() {
    this.length = 0;
    return this;
  }
}