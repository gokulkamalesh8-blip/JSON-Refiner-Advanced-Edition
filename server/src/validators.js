const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class Validators {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
  }

  validateSchema(data, schema) {
    try {
      const validate = this.ajv.compile(schema);
      const valid = validate(data);
      
      return {
        valid,
        errors: valid ? [] : validate.errors.map(err => 
          `${err.instancePath} ${err.message}`
        )
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  validateTypes(data, expectedTypes) {
    const errors = [];
    
    const checkType = (value, expectedType, path) => {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      
      if (expectedType === 'array' && !Array.isArray(value)) {
        errors.push(`${path}: Expected array, got ${actualType}`);
      } else if (expectedType !== 'array' && actualType !== expectedType) {
        errors.push(`${path}: Expected ${expectedType}, got ${actualType}`);
      }
    };

    const traverse = (obj, expected, currentPath = '') => {
      if (expected && typeof expected === 'object') {
        Object.keys(expected).forEach(key => {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          
          if (obj.hasOwnProperty(key)) {
            if (typeof expected[key] === 'string') {
              checkType(obj[key], expected[key], newPath);
            } else if (typeof expected[key] === 'object') {
              traverse(obj[key], expected[key], newPath);
            }
          }
        });
      }
    };

    traverse(data, expectedTypes);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateRequired(data, requiredFields) {
    const missingFields = [];
    
    const checkField = (obj, fieldPath) => {
      const parts = fieldPath.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current === null || current === undefined || !current.hasOwnProperty(part)) {
          missingFields.push(fieldPath);
          return;
        }
        current = current[part];
      }
    };

    requiredFields.forEach(field => checkField(data, field));

    return {
      valid: missingFields.length === 0,
      missing: missingFields
    };
  }
}

module.exports = Validators;