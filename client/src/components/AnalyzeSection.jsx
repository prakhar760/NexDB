import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';
import { ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const AnalyzeSection = () => {
  const [collection, setCollection] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/${collection}/analyze`);
      setAnalysisResult(response.data.analysis);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      setError('An error occurred while analyzing the data.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <motion.section
      className="rounded-lg overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`px-6 py-4 bg-gradient-to-r from-primary to-primary-dark flex items-center`}>
        <ChartBarIcon className="w-6 h-6 mr-3 text-text-primary" />
        <h3 className="text-xl font-semibold text-text-primary">Analyze Data</h3>
      </div>
      <div className="px-6 py-6">
        <div className="mb-4">
          <label htmlFor="collection" className={`block text-sm font-medium ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'} mb-1`}>
            Collection
          </label>
          <input
            type="text"
            id="collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className={`w-full px-3 py-2 ${isDarkMode ? 'bg-background-light border-background-lighter text-text-primary' : 'bg-white border-gray-300 text-gray-900'} border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
            placeholder="Enter collection name"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !collection}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-primary ${
            isDarkMode ? 'bg-primary hover:bg-primary-dark' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            (isLoading || !collection) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && (
          <div className={`mt-4 p-3 rounded-md ${isDarkMode ? 'bg-error bg-opacity-20 text-error' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}
        {analysisResult && (
          <div className={`mt-6 p-4 rounded-md ${isDarkMode ? 'bg-background-light' : 'bg-gray-100'}`}>
            <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-text-primary' : 'text-gray-900'}`}>Analysis Result</h4>
            <pre className={`whitespace-pre-wrap text-sm ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'}`}>
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        )}
        {recommendation && (
          <div className={`mt-6 p-4 rounded-md ${isDarkMode ? 'bg-background-light' : 'bg-gray-100'}`}>
            <h4 className={`text-lg font-semibold mb-2 flex items-center ${isDarkMode ? 'text-text-primary' : 'text-gray-900'}`}>
              <LightBulbIcon className="w-5 h-5 mr-2" />
              AI Recommendation
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'}`}>{recommendation}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default AnalyzeSection;