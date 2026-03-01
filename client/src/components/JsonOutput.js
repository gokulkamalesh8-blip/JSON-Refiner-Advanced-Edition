import React from 'react';
import ReactJson from 'react-json-view';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const JsonOutput = ({ data, prettyPrint }) => {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="json-output empty">
        <p>No output data yet. Click "Refine JSON" to process your data.</p>
      </div>
    );
  }

  const handleCopy = () => {
    const jsonStr = JSON.stringify(data, null, prettyPrint ? 2 : 0);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="json-output">
      <div className="output-header">
        <h3>Refined JSON</h3>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <FiCheck /> : <FiCopy />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="output-content">
        <ReactJson 
          src={data} 
          theme="monokai"
          enableClipboard={true}
          displayDataTypes={false}
          displayObjectSize={false}
          collapsed={false}
        />
      </div>

      <div className="output-stats">
        <span>Size: {JSON.stringify(data).length} bytes</span>
        <span>Type: {Array.isArray(data) ? 'Array' : 'Object'}</span>
        <span>Keys: {Object.keys(data).length}</span>
      </div>
    </div>
  );
};

export default JsonOutput;