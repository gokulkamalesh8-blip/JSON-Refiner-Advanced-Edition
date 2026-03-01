const _ = require('lodash');

class Transformers {
  constructor() {
    this.customTransformers = new Map();
  }

  convertDateStrings(data, dateFields = null) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

    const transform = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string' && dateRegex.test(value)) {
            // Check if this field should be converted to date
            if (!dateFields || dateFields.includes(key)) {
              result[key] = new Date(value);
            } else {
              result[key] = value;
            }
          } else if (typeof value === 'object' && value !== null) {
            result[key] = transform(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      }

      return obj;
    };

    return transform(data);
  }

  renameFields(data, fieldMappings) {
    const transform = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          const newKey = fieldMappings[key] || key;
          
          if (typeof value === 'object' && value !== null) {
            result[newKey] = transform(value);
          } else {
            result[newKey] = value;
          }
        }
        return result;
      }

      return obj;
    };

    return transform(data);
  }

  filterFields(data, fieldsToKeep) {
    const transform = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (fieldsToKeep.includes(key)) {
            if (typeof value === 'object' && value !== null) {
              result[key] = transform(value);
            } else {
              result[key] = value;
            }
          }
        }
        return result;
      }

      return obj;
    };

    return transform(data);
  }

  transformValues(data, transformations) {
    const transform = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => transform(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (transformations[key] && typeof transformations[key] === 'function') {
            result[key] = transformations[key](value);
          } else if (typeof value === 'object' && value !== null) {
            result[key] = transform(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      }

      return obj;
    };

    return transform(data);
  }

  addCustomTransformer(name, transformer) {
    this.customTransformers.set(name, transformer);
  }

  applyCustomTransformer(data, name, ...args) {
    const transformer = this.customTransformers.get(name);
    if (!transformer) {
      throw new Error(`Custom transformer '${name}' not found`);
    }
    return transformer(data, ...args);
  }
}

module.exports = Transformers;