import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import JsonInput from './components/JsonInput';
import JsonOutput from './components/JsonOutput';
import Controls from './components/Controls';
import SchemaInput from './components/SchemaInput';
import ValidationResults from './components/ValidationResults';
import { FiSettings, FiUpload, FiDownload, FiRefreshCw } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [inputData, setInputData] = useState(null);
  const [outputData, setOutputData] = useState(null);
  const [schema, setSchema] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    removeNulls: false,
    trimStrings: false,
    convertDates: false,
    removeEmptyObjects: false,
    normalizeNumbers: false,
    standardizeBooleans: false,
    prettyPrint: true
  });
  const [activeTab, setActiveTab] = useState('input');

  const handleRefine = async () => {
    if (!inputData) {
      toast.error('Please input JSON data first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/refine`, {
        data: inputData,
        options,
        schema: schema
      });
      
      setOutputData(response.data.data);
      toast.success('JSON refined successfully!');
      setActiveTab('output');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error refining JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!inputData || !schema) {
      toast.error('Both JSON data and schema are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/validate`, {
        data: inputData,
        schema: schema
      });
      
      setValidationResults(response.data);
      toast.success(response.data.valid ? 'Validation passed!' : 'Validation failed');
    } catch (error) {
      toast.error('Error validating JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!inputData || !outputData) {
      toast.error('Both input and output data required for comparison');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/compare`, {
        data1: inputData,
        data2: outputData
      });
      
      const diffCount = response.data.differences.length;
      if (diffCount === 0) {
        toast.success('No differences found');
      } else {
        toast.info(`Found ${diffCount} differences`);
      }
      
      console.log('Differences:', response.data.differences);
    } catch (error) {
      toast.error('Error comparing JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputData) return;
    
    const dataStr = JSON.stringify(outputData, null, options.prettyPrint ? 2 : 0);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'refined-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleClear = () => {
    setInputData(null);
    setOutputData(null);
    setSchema(null);
    setValidationResults(null);
    toast.success('All data cleared');
  };

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      <header className="header">
        <h1>🔧 JSON Refiner</h1>
        <p>Clean, validate, and transform your JSON data with ease</p>
      </header>

      <div className="container">
        <div className="sidebar">
          <Controls 
            options={options}
            setOptions={setOptions}
            onRefine={handleRefine}
            onValidate={handleValidate}
            onCompare={handleCompare}
            onDownload={handleDownload}
            onClear={handleClear}
            loading={loading}
          />
        </div>

        <div className="main-content">
          <div className="tabs">
            <button 
              className={activeTab === 'input' ? 'active' : ''}
              onClick={() => setActiveTab('input')}
            >
              Input JSON
            </button>
            <button 
              className={activeTab === 'schema' ? 'active' : ''}
              onClick={() => setActiveTab('schema')}
            >
              Schema
            </button>
            <button 
              className={activeTab === 'output' ? 'active' : ''}
              onClick={() => setActiveTab('output')}
            >
              Output
            </button>
            {validationResults && (
              <button 
                className={activeTab === 'validation' ? 'active' : ''}
                onClick={() => setActiveTab('validation')}
              >
                Validation
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'input' && (
              <JsonInput 
                value={inputData}
                onChange={setInputData}
              />
            )}
            
            {activeTab === 'schema' && (
              <SchemaInput 
                value={schema}
                onChange={setSchema}
              />
            )}
            
            {activeTab === 'output' && (
              <JsonOutput 
                data={outputData}
                prettyPrint={options.prettyPrint}
              />
            )}
            
            {activeTab === 'validation' && validationResults && (
              <ValidationResults results={validationResults} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;