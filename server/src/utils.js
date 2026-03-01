const fs = require('fs').promises;
const path = require('path');

class JsonUtils {
  static async readJsonFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error reading JSON file: ${error.message}`);
    }
  }

  static async writeJsonFile(filePath, data, pretty = true) {
    try {
      const jsonString = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      await fs.writeFile(filePath, jsonString);
    } catch (error) {
      throw new Error(`Error writing JSON file: ${error.message}`);
    }
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, this.flattenObject(obj[key], `${pre}${key}`));
      } else {
        acc[`${pre}${key}`] = obj[key];
      }
      return acc;
    }, {});
  }

  static unflattenObject(obj) {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const parts = key.split('.');
      let current = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      current[parts[parts.length - 1]] = value;
    }
    
    return result;
  }

  static diff(obj1, obj2) {
    const differences = [];
    
    const compare = (a, b, path = '') => {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        return;
      }

      if (typeof a !== typeof b) {
        differences.push({
          path,
          message: `Type mismatch: ${typeof a} vs ${typeof b}`,
          value1: a,
          value2: b
        });
        return;
      }

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          differences.push({
            path,
            message: `Array length mismatch: ${a.length} vs ${b.length}`,
            value1: a,
            value2: b
          });
        } else {
          for (let i = 0; i < a.length; i++) {
            compare(a[i], b[i], `${path}[${i}]`);
          }
        }
        return;
      }

      if (typeof a === 'object' && a !== null && b !== null) {
        const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
        
        for (const key of allKeys) {
          const newPath = path ? `${path}.${key}` : key;
          
          if (!a.hasOwnProperty(key)) {
            differences.push({
              path: newPath,
              message: 'Key missing in first object',
              value1: undefined,
              value2: b[key]
            });
          } else if (!b.hasOwnProperty(key)) {
            differences.push({
              path: newPath,
              message: 'Key missing in second object',
              value1: a[key],
              value2: undefined
            });
          } else {
            compare(a[key], b[key], newPath);
          }
        }
        return;
      }

      if (a !== b) {
        differences.push({
          path,
          message: 'Value mismatch',
          value1: a,
          value2: b
        });
      }
    };

    compare(obj1, obj2);
    return differences;
  }
}

module.exports = JsonUtils;