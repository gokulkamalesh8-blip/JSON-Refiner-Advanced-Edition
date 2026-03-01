const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Refiner = require('./src/refiner');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Initialize refiner
const refiner = new Refiner();

// Routes
app.post('/api/refine', async (req, res) => {
  try {
    const { data, options = {}, schema = null } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Configure refiner with options
    const refinerInstance = new Refiner({
      removeNulls: options.removeNulls || false,
      trimStrings: options.trimStrings || false,
      convertDates: options.convertDates || false,
      removeEmptyObjects: options.removeEmptyObjects || false,
      normalizeNumbers: options.normalizeNumbers || false,
      standardizeBooleans: options.standardizeBooleans || false,
      schema: schema
    });

    const refinedData = await refinerInstance.refine(data);
    
    res.json({ 
      success: true, 
      data: refinedData,
      original: data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/validate', async (req, res) => {
  try {
    const { data, schema } = req.body;
    
    if (!data || !schema) {
      return res.status(400).json({ error: 'Data and schema required' });
    }

    const validator = new (require('./src/validators'))();
    const result = await validator.validateSchema(data, schema);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/compare', async (req, res) => {
  try {
    const { data1, data2 } = req.body;
    
    if (!data1 || !data2) {
      return res.status(400).json({ error: 'Two data objects required' });
    }

    const utils = require('./src/utils');
    const differences = utils.diff(data1, data2);
    
    res.json({ differences });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/transform', async (req, res) => {
  try {
    const { data, transformations } = req.body;
    
    if (!data || !transformations) {
      return res.status(400).json({ error: 'Data and transformations required' });
    }

    const transformer = new (require('./src/transformers'))();
    const result = transformer.transformValues(data, transformations);
    
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});