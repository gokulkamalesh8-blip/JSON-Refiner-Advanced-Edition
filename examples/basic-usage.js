const Refiner = require('../src/refiner');
const JsonUtils = require('../src/utils');

// Example input data
const messyData = {
  name: "  John Doe  ",
  age: "30",
  email: "john@example.com",
  birthDate: "1990-01-15",
  isActive: "true",
  address: {
    street: "  123 Main St  ",
    city: "New York",
    zipCode: null,
    country: "USA"
  },
  hobbies: ["  reading  ", "  swimming  ", null, "  "],
  preferences: {
    newsletter: "yes",
    notifications: "on",
    theme: null
  },
  metadata: {
    createdAt: "2023-01-01T10:30:00Z",
    updatedAt: null
  }
};

// Define a schema for validation
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    age: { type: ["string", "number"] },
    email: { type: "string", format: "email" },
    birthDate: { type: "string", format: "date" },
    isActive: { type: ["string", "boolean"] },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        country: { type: "string" }
      }
    }
  },
  required: ["name", "email"]
};

async function main() {
  console.log("Original messy data:");
  console.log(JSON.stringify(messyData, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");

  // Create refiner with options
  const refiner = new Refiner({
    removeNulls: true,
    trimStrings: true,
    convertDates: true,
    schema: schema
  });

  try {
    // Refine the data
    const refinedData = await refiner.refine(messyData);
    
    console.log("Refined data:");
    console.log(JSON.stringify(refinedData, null, 2));

    // Add custom transformation
    refiner.addCustomRule('uppercase', (data) => {
      if (typeof data === 'string') {
        return data.toUpperCase();
      }
      return data;
    });

    // Apply additional transformations
    const transformers = refiner.transformers;
    
    // Normalize numbers
    const withNormalizedNumbers = transformers.transformValues(
      refinedData,
      {
        age: (value) => parseInt(value)
      }
    );

    // Standardize booleans
    const cleaners = refiner.cleaners;
    const withStandardBooleans = cleaners.standardizeBooleans(withNormalizedNumbers);

    console.log("\n" + "=".repeat(50));
    console.log("Final processed data:");
    console.log(JSON.stringify(withStandardBooleans, null, 2));

    // Show diff between original and refined
    console.log("\n" + "=".repeat(50));
    console.log("Changes made:");
    const differences = JsonUtils.diff(messyData, withStandardBooleans);
    differences.forEach(diff => {
      console.log(`- ${diff.path}: ${diff.message}`);
    });

  } catch (error) {
    console.error("Error refining data:", error.message);
  }
}

// Run the example
main();