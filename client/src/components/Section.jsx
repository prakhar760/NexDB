import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';
import ParticleAnimation from './ParticleAnimation';

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

  useEffect(() => {
    console.log('Rendering Update Document section');
    console.log('Collection:', collection);
    console.log('Document ID:', documentId);
    console.log('Update Data:', updateData);
  }, [collection, documentId, updateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
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
          console.log('Attempting to insert document');
          response = await axios.post(`http://localhost:5000/${collection}`, JSON.parse(data));
          console.log('Insert response:', response);
          setMessage(`Success: Document created with ID ${response.data.id}`);
          break;
        case 'Find Documents':
          console.log('Attempting to find documents');
          const params = {};
          if (query) params.query = query;
          if (sort) params.sort = sort;
          if (limit) params.limit = parseInt(limit);
          response = await axios.get(`http://localhost:5000/${collection}`, { params });
          console.log('Find response:', response);
          setDocuments(response.data);
          setMessage(`Found ${response.data.length} document(s)`);
          break;
        case 'Update Document':
          console.log('Attempting to update document');
          const updatePayload = JSON.parse(updateData);
          console.log('Update payload:', updatePayload);
          response = await axios.put(
            `http://localhost:5000/${collection}/${documentId}`,
            updatePayload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Update response:', response);
          setMessage('Document updated successfully');
          break;
        case 'Create Index':
          console.log('Attempting to create index');
          await axios.post(`http://localhost:5000/${collection}/index/${data}`);
          console.log('Index created');
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
      console.log(`Attempting to delete document ${docId} from collection ${collectionName}`);
      await axios.delete(`http://localhost:5000/${collectionName}/${docId}`);
      console.log('Document deleted successfully');
      setMessage(`Document ${docId} deleted successfully`);
      // Refresh the documents list
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
      <motion.input
        type="text"
        id={label.toLowerCase().replace(/\s/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 ${isDarkMode ? 'bg-background-light border-background-lighter text-text-primary' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
        placeholder={placeholder}
        required={isRequired}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      />
    </div>
  );

  const renderTextArea = (label, value, onChange, placeholder, isRequired = true) => (
    <div>
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className={`block text-sm font-medium ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      <motion.textarea
        id={label.toLowerCase().replace(/\s/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="4"
        className={`w-full px-3 py-2 ${isDarkMode ? 'bg-background-light border-background-lighter text-text-primary' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
        placeholder={placeholder}
        required={isRequired}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      ></motion.textarea>
    </div>
  );

  const renderDocumentsTable = () => {
    if (title !== 'Find Documents' || documents.length === 0) return null;

    return (
      <div className="mt-4 overflow-x-auto">
        <table className={`w-full ${isDarkMode ? 'text-text-primary' : 'text-gray-800'}`}>
          <thead className={`${isDarkMode ? 'bg-background-light' : 'bg-gray-200'}`}>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {documents.map((doc, index) => (
                <motion.tr
                  key={doc._id}
                  className={`${index % 2 === 0 ? (isDarkMode ? 'bg-background' : 'bg-gray-100') : (isDarkMode ? 'bg-background-light' : 'bg-white')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-2 font-mono">{doc._id}</td>
                  <td className="px-4 py-2">
                    <pre className={`whitespace-pre-wrap ${isDarkMode ? 'text-text-secondary' : 'text-gray-700'}`}>
                      {JSON.stringify(doc, null, 2)}
                    </pre>
                  </td>
                  <td className="px-4 py-2">
                    <motion.button
                      onClick={() => handleDelete(collection, doc._id)}
                      className={`px-3 py-1 rounded-md text-white ${isDarkMode ? 'bg-error hover:bg-error' : 'bg-red-500 hover:bg-red-600'}`}
                      whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,0,0)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        initial={{ display: "inline-block" }}
                        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        🗑️
                      </motion.span>
                      {" Delete"}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.section
      id={id}
      className={`${isDarkMode ? 'bg-surface' : 'bg-white'} bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg overflow-hidden relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <ParticleAnimation className="z-0" />
      <div className="relative z-10">
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

            <motion.button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-primary ${isDarkMode ? 'bg-primary hover:bg-primary-dark' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Submit'}
            </motion.button>
          </form>
          {message && (
            <motion.div
              className={`mt-6 p-4 rounded-md ${
                message.startsWith('Error')
                  ? isDarkMode
                    ? 'bg-error bg-opacity-20 text-error'
                    : 'bg-red-100 text-red-800'
                  : isDarkMode
                  ? 'bg-secondary bg-opacity-20 text-secondary'
                  : 'bg-green-100 text-green-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          )}
          <div className="mt-6">
            {renderDocumentsTable()}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Section;