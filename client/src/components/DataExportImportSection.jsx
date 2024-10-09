import React, { useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';

const DataExportImportSection = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/api/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('/api/import', formData);
      alert('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data');
    }
  };

  const buttonClass = isDarkMode
    ? 'bg-primary text-text-primary hover:bg-primary-dark'
    : 'bg-blue-500 text-white hover:bg-blue-600';

  return (
    <div className="space-y-4">
      <div>
        <button 
          onClick={() => handleExport('csv')}
          className={`px-4 py-2 rounded transition-colors duration-200 mr-2 ${buttonClass}`}
        >
          Export CSV
        </button>
        <button 
          onClick={() => handleExport('json')}
          className={`px-4 py-2 rounded transition-colors duration-200 ${buttonClass}`}
        >
          Export JSON
        </button>
      </div>
      <div>
        <input 
          type="file" 
          onChange={handleImport}
          className={`block w-full ${
            isDarkMode ? 'text-text-secondary' : 'text-gray-700'
          }
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            ${isDarkMode
              ? 'file:bg-primary file:text-text-primary file:hover:bg-primary-dark'
              : 'file:bg-blue-500 file:text-white file:hover:bg-blue-600'
            }
          `}
        />
      </div>
    </div>
  );
};

export default DataExportImportSection;