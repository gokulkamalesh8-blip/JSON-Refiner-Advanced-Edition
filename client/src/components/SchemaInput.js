import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const SchemaInput = ({ value, onChange }) => {
  const [textInput, setTextInput] = useState(
    value ? JSON.stringify(value, null, 2) : ''
  );
  const [error, setError] = useState('');

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
        setError('Invalid JSON Schema format');
      }
    }
  };

  const handlePasteExample = () => {
    const example = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        email: { type: "string", format: "email" },
        address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" }
          }
        }
      },
      required: ["name", "email"]
    };
    onChange(example);
    setTextInput(JSON.stringify(example, null, 2));
    setError('');
  };

  return (
    <div className="schema-input">
      <div className="schema-header">
        <h3>JSON Schema (Optional)</h3>
        <div className="schema-actions">
          <button onClick={handlePasteExample}>
            Load Example Schema
          </button>
          <div className="info-tooltip">
            <FiInfo />
            <span className="tooltip-text">
              JSON Schema is used to validate your data structure
            </span>
          </div>
        </div>
      </div>

      <textarea
        value={textInput}
        onChange={handleTextChange}
        placeholder="Paste your JSON Schema here..."
        spellCheck={false}
      />

      {error && <div className="error-message">{error}</div>}

      {value && !error && (
        <div className="schema-preview">
          <h4>Schema Summary</h4>
          <p>Type: {value.type || 'Not specified'}</p>
          {value.required && (
            <p>Required fields: {value.required.join(', ')}</p>
          )}
          {value.properties && (
            <p>Defined properties: {Object.keys(value.properties).length}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaInput;