const Validators = require('./validators');
const Transformers = require('./transformers');
const Cleaners = require('./cleaners');

class Refiner {
  constructor(options = {}) {
    this.options = {
      removeNulls: false,
      trimStrings: false,
      convertDates: false,
      schema: null,
      ...options
    };
    
    this.validators = new Validators();
    this.transformers = new Transformers();
    this.cleaners = new Cleaners();
  }

  async refine(data) {
    let refinedData = JSON.parse(JSON.stringify(data)); // Deep clone

    // Step 1: Validate against schema if provided
    if (this.options.schema) {
      const validationResult = await this.validators.validateSchema(
        refinedData, 
        this.options.schema
      );
      
      if (!validationResult.valid) {
        throw new Error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
      }
    }

    // Step 2: Clean the data
    refinedData = this.cleanData(refinedData);

    // Step 3: Transform the data
    refinedData = this.transformData(refinedData);

    return refinedData;
  }

  cleanData(data) {
    let cleaned = data;

    if (this.options.removeNulls) {
      cleaned = this.cleaners.removeNullValues(cleaned);
    }

    if (this.options.trimStrings) {
      cleaned = this.cleaners.trimStrings(cleaned);
    }

    return cleaned;
  }

  transformData(data) {
    let transformed = data;

    if (this.options.convertDates) {
      transformed = this.transformers.convertDateStrings(transformed);
    }

    return transformed;
  }

  // Custom refinement rules
  addCustomRule(ruleName, ruleFunction) {
    this.transformers.addCustomTransformer(ruleName, ruleFunction);
  }
}

module.exports = Refiner;