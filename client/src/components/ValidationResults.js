import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ValidationResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="validation-results">
      <div className={`validation-header ${results.valid ? 'valid' : 'invalid'}`}>
        {results.valid ? (
          <>
            <FiCheckCircle /> Validation Passed
          </>
        ) : (
          <>
            <FiXCircle /> Validation Failed
          </>
        )}
      </div>

      {!results.valid && results.errors && (
        <div className="error-list">
          <h4>Errors:</h4>
          <ul>
            {results.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {results.valid && (
        <div className="success-message">
          <p>Your JSON data conforms to the provided schema.</p>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;