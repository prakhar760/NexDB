import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';

const NLQuerySection = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  const handleNLQuery = async () => {
    try {
      const response = await axios.post('/api/nl-query', { query });
      setResult(response.data);
    } catch (error) {
      console.error('Error processing NL query:', error);
      setResult({ error: 'Failed to process query' });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about your data..."
        className={`w-full p-2 border rounded ${isDarkMode ? 'bg-background text-text-primary' : 'bg-white text-gray-800'}`}
      />
      <button 
        onClick={handleNLQuery}
        className={`px-4 py-2 ${isDarkMode ? 'bg-primary text-text-primary' : 'bg-blue-500 text-white'} rounded hover:opacity-80 transition-opacity duration-200`}
      >
        Query
      </button>
      {result && (
        <pre className={`${isDarkMode ? 'bg-surface text-text-primary' : 'bg-gray-100 text-gray-800'} p-4 rounded overflow-auto`}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default NLQuerySection;