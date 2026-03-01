class Cleaners {
  removeNullValues(data) {
    const clean = (obj) => {
      if (Array.isArray(obj)) {
        return obj
          .map(item => clean(item))
          .filter(item => item !== null && item !== undefined);
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              const cleaned = clean(value);
              if (Object.keys(cleaned).length > 0 || Array.isArray(cleaned)) {
                result[key] = cleaned;
              }
            } else {
              result[key] = value;
            }
          }
        }
        return result;
      }

      return obj;
    };

    return clean(data);
  }

  trimStrings(data) {
    const trim = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => trim(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            result[key] = value.trim();
          } else if (typeof value === 'object' && value !== null) {
            result[key] = trim(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      }

      if (typeof obj === 'string') {
        return obj.trim();
      }

      return obj;
    };

    return trim(data);
  }

  removeEmptyObjects(data) {
    const clean = (obj) => {
      if (Array.isArray(obj)) {
        return obj
          .map(item => clean(item))
          .filter(item => {
            if (item && typeof item === 'object') {
              return Object.keys(item).length > 0;
            }
            return true;
          });
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          const cleaned = typeof value === 'object' ? clean(value) : value;
          
          if (cleaned && typeof cleaned === 'object') {
            if (Object.keys(cleaned).length > 0) {
              result[key] = cleaned;
            }
          } else {
            result[key] = cleaned;
          }
        }
        return result;
      }

      return obj;
    };

    return clean(data);
  }

  normalizeNumbers(data) {
    const normalize = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => normalize(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
            // Convert string numbers to actual numbers
            result[key] = Number(value);
          } else if (typeof value === 'object' && value !== null) {
            result[key] = normalize(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      }

      return obj;
    };

    return normalize(data);
  }

  standardizeBooleans(data, truthyValues = ['true', 'yes', '1', 'on']) {
    const standardize = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => standardize(item));
      }

      if (obj && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            if (truthyValues.includes(lowerValue)) {
              result[key] = true;
            } else if (lowerValue === 'false' || lowerValue === 'no' || lowerValue === '0' || lowerValue === 'off') {
              result[key] = false;
            } else {
              result[key] = value;
            }
          } else if (typeof value === 'object' && value !== null) {
            result[key] = standardize(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      }

      return obj;
    };

    return standardize(data);
  }
}

module.exports = Cleaners;