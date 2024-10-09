import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';

const Section = ({ id, title, icon }) => {
  const [collection, setCollection] = useState('');
  const [data, setData] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [updateData, setUpdateData] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [tableView, setTableView] = useState('default');
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        console.log('API test response:', response);
      } catch (error) {
        console.error('API test error:', error);
      }
    };
    testAPI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    console.log('Submitting form:', title);
    console.log('Collection:', collection);
    console.log('Document ID:', documentId);
    console.log('Update Data:', updateData);

    try {
      let response;
      switch (title) {
        case 'Insert Document':
          response = await axios.post(`http://localhost:5000/${collection}`, JSON.parse(data));
          setMessage(`Success: Document created with ID ${response.data.id}`);
          break;
        case 'Find Documents':
          const params = {};
          if (query) params.query = query;
          if (sort) params.sort = sort;
          if (limit) params.limit = parseInt(limit);
          response = await axios.get(`http://localhost:5000/${collection}`, { params });
          setDocuments(response.data);
          setMessage(`Found ${response.data.length} document(s)`);
          break;
        case 'Update Document':
          const updatePayload = JSON.parse(updateData);
          response = await axios.put(
            `http://localhost:5000/${collection}/${documentId}`,
            updatePayload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          setMessage('Document updated successfully');
          break;
        case 'Create Index':
          await axios.post(`http://localhost:5000/${collection}/index/${data}`);
          setMessage(`Index created on field '${data}'`);
          break;
        default:
          throw new Error('Unknown operation');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err.response) {
        setMessage(`Error: ${err.response.data.error || err.response.data.message || `Server responded with status code ${err.response.status}`}`);
      } else if (err.request) {
        setMessage('Error: No response received from server. Please check your connection.');
      } else {
        setMessage(`Error: ${err.message || 'An unexpected error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (collectionName, docId) => {
    try {
      await axios.delete(`http://localhost:5000/${collectionName}/${docId}`);
      setMessage(`Document ${docId} deleted successfully`);
      const response = await axios.get(`http://localhost:5000/${collectionName}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error deleting document:', error);
      setMessage(`Error deleting document: ${error.message}`);
    }
  };

  const renderInput = (label, value, onChange, placeholder, isRequired = true) => (
    <div>
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className={`block text-sm font-medium ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      <input
        type="text"
        id={label.toLowerCase().replace(/\s/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 ${isDarkMode ? 'bg-background-light border-background-lighter text-text-primary' : 'bg-white border-gray-300 text-gray-900'} border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );

  const renderTextArea = (label, value, onChange, placeholder, isRequired = true) => (
    <div>
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className={`block text-sm font-medium ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      <textarea
        id={label.toLowerCase().replace(/\s/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 ${isDarkMode ? 'bg-background-light border-background-lighter text-text-primary' : 'bg-white border-gray-300 text-gray-900'} border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
        placeholder={placeholder}
        required={isRequired}
        rows={4}
      />
    </div>
  );

  const renderTableViewSelector = () => (
    <div className="mb-4">
      <label htmlFor="table-view" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Table View
      </label>
      <select
        id="table-view"
        value={tableView}
        onChange={(e) => setTableView(e.target.value)}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${
          isDarkMode ? 'bg-background-light text-text-primary' : 'bg-white text-gray-900'
        }`}
      >
        <option value="default">Default</option>
        <option value="compact">Compact</option>
        <option value="expanded">Expanded</option>
      </select>
    </div>
  );

  const renderDefaultTable = () => (
    <table className={`min-w-full divide-y divide-gray-200 ${isDarkMode ? 'text-text-primary' : 'text-gray-900'}`}>
      <thead className={isDarkMode ? 'bg-background-light' : 'bg-gray-50'}>
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-background' : 'bg-white'}`}>
        {documents.map((doc) => (
          <tr key={doc._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{doc._id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <pre className="whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <button
                onClick={() => handleDelete(collection, doc._id)}
                className={`px-3 py-1 rounded-md text-white ${isDarkMode ? 'bg-error hover:bg-error-dark' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCompactTable = () => (
    <table className={`min-w-full divide-y divide-gray-200 ${isDarkMode ? 'text-text-primary' : 'text-gray-900'}`}>
      <thead className={isDarkMode ? 'bg-background-light' : 'bg-gray-50'}>
        <tr>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">ID</th>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-background' : 'bg-white'}`}>
        {documents.map((doc) => (
          <tr key={doc._id}>
            <td className="px-4 py-2 whitespace-nowrap text-sm">{doc._id}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm">
              <button
                onClick={() => handleDelete(collection, doc._id)}
                className={`px-2 py-1 rounded-md text-white text-xs ${isDarkMode ? 'bg-error hover:bg-error-dark' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderExpandedTable = () => (
    <div className={`space-y-4 ${isDarkMode ? 'text-text-primary' : 'text-gray-900'}`}>
      {documents.map((doc) => (
        <div key={doc._id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-background-light' : 'bg-white'} shadow`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">ID: {doc._id}</span>
            <button
              onClick={() => handleDelete(collection, doc._id)}
              className={`px-3 py-1 rounded-md text-white ${isDarkMode ? 'bg-error hover:bg-error-dark' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Delete
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(doc, null, 2)}</pre>
        </div>
      ))}
    </div>
  );

  const renderDocumentsTable = () => {
    if (documents.length === 0) return null;

    return (
      <div className="overflow-x-auto mt-6">
        {renderTableViewSelector()}
        {tableView === 'default' && renderDefaultTable()}
        {tableView === 'compact' && renderCompactTable()}
        {tableView === 'expanded' && renderExpandedTable()}
      </div>
    );
  };

  return (
    <motion.section
      id={id}
      className="rounded-lg overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`px-6 py-4 bg-gradient-to-r from-primary to-primary-dark flex items-center`}>
        <span className="mr-3 text-text-primary">{icon}</span>
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('Collection', collection, setCollection, 'Enter collection name')}
          
          {title === 'Find Documents' && (
            <>
              {renderTextArea('Query (JSON)', query, setQuery, '{"age": {"$gt": 25}} (optional)', false)}
              {renderTextArea('Sort (JSON)', sort, setSort, '[["name", 1], ["age", -1]] (optional)', false)}
              {renderInput('Limit', limit, setLimit, 'Enter limit (optional)', false)}
            </>
          )}

          {title === 'Update Document' && (
            <>
              {renderInput('Document ID', documentId, setDocumentId, 'Enter document ID')}
              {renderTextArea('Update Data (JSON)', updateData, setUpdateData, '{"$set": {"name": "Jane Doe"}, "$inc": {"age": 1}}')}
            </>
          )}

          {title === 'Insert Document' && (
            renderTextArea('Data (JSON)', data, setData, '{"name": "John Doe", "age": 30}')
          )}

          {title === 'Create Index' && (
            renderInput('Field', data, setData, 'Enter field name')
          )}

          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-primary ${isDarkMode ? 'bg-primary hover:bg-primary-dark' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-6 p-4 rounded-md ${
              message.startsWith('Error')
                ? isDarkMode
                  ? 'bg-error bg-opacity-20 text-error'
                  : 'bg-red-100 text-red-800'
                : isDarkMode
                ? 'bg-secondary bg-opacity-20 text-secondary'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {message}
          </div>
        )}
        {renderDocumentsTable()}
      </div>
    </motion.section>
  );
};

export default Section;