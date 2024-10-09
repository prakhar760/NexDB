import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';

const AIInsightsSection = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/ai-insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setInsights([{ error: 'Failed to generate insights' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={generateInsights}
        disabled={isLoading}
        className={`px-4 py-2 ${
          isDarkMode
            ? 'bg-primary text-text-primary'
            : 'bg-blue-500 text-white'
        } rounded hover:opacity-80 transition-opacity duration-200 disabled:opacity-50`}
      >
        {isLoading ? 'Generating...' : 'Generate AI Insights'}
      </button>
      {insights && (
        <ul className={`list-disc pl-5 ${isDarkMode ? 'text-text-primary' : 'text-gray-800'}`}>
          {insights.map((insight, index) => (
            <li key={index} className="mb-2">{insight}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIInsightsSection;