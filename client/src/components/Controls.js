import React from 'react';
import { 
  FiPlay, 
  FiCheckCircle, 
  FiCopy, 
  FiDownload, 
  FiTrash2,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';

const Controls = ({ 
  options, 
  setOptions, 
  onRefine, 
  onValidate, 
  onCompare, 
  onDownload, 
  onClear,
  loading 
}) => {
  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className="controls">
      <h3>Refinement Options</h3>
      
      <div className="options-list">
        <label className="option">
          <span>Remove null values</span>
          <button 
            className={`toggle ${options.removeNulls ? 'active' : ''}`}
            onClick={() => handleOptionChange('removeNulls')}
          >
            {options.removeNulls ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Trim strings</span>
          <button 
            className={`toggle ${options.trimStrings ? 'active' : ''}`}
            onClick={() => handleOptionChange('trimStrings')}
          >
            {options.trimStrings ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Convert dates</span>
          <button 
            className={`toggle ${options.convertDates ? 'active' : ''}`}
            onClick={() => handleOptionChange('convertDates')}
          >
            {options.convertDates ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Remove empty objects</span>
          <button 
            className={`toggle ${options.removeEmptyObjects ? 'active' : ''}`}
            onClick={() => handleOptionChange('removeEmptyObjects')}
          >
            {options.removeEmptyObjects ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Normalize numbers</span>
          <button 
            className={`toggle ${options.normalizeNumbers ? 'active' : ''}`}
            onClick={() => handleOptionChange('normalizeNumbers')}
          >
            {options.normalizeNumbers ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Standardize booleans</span>
          <button 
            className={`toggle ${options.standardizeBooleans ? 'active' : ''}`}
            onClick={() => handleOptionChange('standardizeBooleans')}
          >
            {options.standardizeBooleans ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>

        <label className="option">
          <span>Pretty print output</span>
          <button 
            className={`toggle ${options.prettyPrint ? 'active' : ''}`}
            onClick={() => handleOptionChange('prettyPrint')}
          >
            {options.prettyPrint ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </label>
      </div>

      <div className="actions">
        <button 
          className="btn btn-primary" 
          onClick={onRefine}
          disabled={loading}
        >
          <FiPlay /> {loading ? 'Processing...' : 'Refine JSON'}
        </button>

        <button 
            className="btn btn-secondary"
            onClick={onValidate}
            disabled={loading}
          >
            <FiCheckCircle /> Validate
          </button>

          <button 
            className="btn btn-secondary"
            onClick={onCompare}
            disabled={loading}
          >
            <FiCopy /> Compare
          </button>

          <button 
            className="btn btn-success"
            onClick={onDownload}
            disabled={loading}
          >
            <FiDownload /> Download
          </button>

          <button 
            className="btn btn-danger"
            onClick={onClear}
          >
            <FiTrash2 /> Clear
          </button>
        </div>
      </div>
    );
  };

export default Controls;