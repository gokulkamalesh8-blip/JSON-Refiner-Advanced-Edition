import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { FiUpload, FiEdit2 } from 'react-icons/fi';

const JsonInput = ({ value, onChange }) => {
  const [inputMode, setInputMode] = useState('edit');
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        onChange(json);
        setTextInput(JSON.stringify(json, null, 2));
        setError('');
      } catch (err) {
        setError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    try {
      const json = JSON.parse(e.target.value);
      onChange(json);
      setError('');
    } catch (err) {
      if (e.target.value.trim() === '') {
        onChange(null);
        setError('');
      } else {
        setError('Invalid JSON format');
      }
    }
  };

  const handlePasteExample = () => {
    const example = {
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
      hobbies: ["  reading  ", "  swimming  ", null],
      preferences: {
        newsletter: "yes",
        theme: null
      }
    };
    onChange(example);
    setTextInput(JSON.stringify(example, null, 2));
    setError('');
  };

  return (
    <div className="json-input">
      <div className="input-header">
        <div className="input-modes">
          <button 
            className={inputMode === 'edit' ? 'active' : ''}
            onClick={() => setInputMode('edit')}
          >
            <FiEdit2 /> Edit
          </button>
          <button 
            className={inputMode === 'view' ? 'active' : ''}
            onClick={() => setInputMode('view')}
          >
            <FiUpload /> View
          </button>
        </div>
        <div className="input-actions">
          <button onClick={handlePasteExample}>
            Load Example
          </button>
          <label className="upload-btn">
            <FiUpload /> Upload JSON
            <input 
              type="file" 
              accept=".json,application/json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="input-content">
        {inputMode === 'edit' ? (
          <textarea
            value={textInput}
            onChange={handleTextChange}
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
        ) : (
          <div className="json-viewer">
            {value ? (
              <ReactJson 
                src={value} 
                theme="monokai"
                enableClipboard={true}
                displayDataTypes={false}
                displayObjectSize={false}
              />
            ) : (
              <p className="placeholder">No JSON data loaded</p>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {value && !error && (
        <div className="stats">
          <span>Size: {JSON.stringify(value).length} bytes</span>
          <span>Type: {Array.isArray(value) ? 'Array' : 'Object'}</span>
          <span>Keys: {Object.keys(value).length}</span>
        </div>
      )}
    </div>
  );
};

export default JsonInput;