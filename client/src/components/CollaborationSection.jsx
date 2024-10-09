import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { ThemeContext } from '../ThemeContext';

const CollaborationSection = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('database-update', (update) => {
      setMessages(prev => [...prev, update]);
    });
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    // Implement sending message to server
    console.log('Sending message:', inputMessage);
    setInputMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto border rounded p-2" >
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${isDarkMode ? 'text-text-primary' : 'text-gray-800'}`}>{msg}</div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className={`flex-grow p-2 border rounded-l ${isDarkMode ? 'bg-background text-text-primary' : 'bg-white text-gray-800'}`}
        />
        <button 
          onClick={sendMessage}
          className={`px-4 py-2 ${isDarkMode ? 'bg-primary text-text-primary' : 'bg-blue-500 text-white'} rounded-r hover:opacity-80 transition-opacity duration-200`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CollaborationSection;