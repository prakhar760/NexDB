import React, { useState, useContext, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Section from './components/Section';
import GradientWaveBackground from './components/GradientWaveBackground';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { PlusCircleIcon, MagnifyingGlassIcon, PencilIcon, Square3Stack3DIcon, XMarkIcon, PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ThemeProvider, ThemeContext } from './ThemeContext';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const [tabs, setTabs] = useState([{ id: 'default', title: 'New Tab', content: 'insert' }]);
  const [activeTab, setActiveTab] = useState('default');
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const mainRef = useRef(null);
  const editInputRef = useRef(null);

  const { scrollY } = useScroll({ container: mainRef });
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTabId]);

  const sections = [
    { id: 'insert', title: 'Insert Document', icon: <PlusCircleIcon className="w-6 h-6" /> },
    { id: 'find', title: 'Find Documents', icon: <MagnifyingGlassIcon className="w-6 h-6" /> },
    { id: 'update', title: 'Update Document', icon: <PencilIcon className="w-6 h-6" /> },
    { id: 'index', title: 'Create Index', icon: <Square3Stack3DIcon className="w-6 h-6" /> },
  ];

  const addTab = (content) => {
    const newTab = { id: Date.now().toString(), title: 'New Tab', content };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTabTitle = (tabId, newTitle) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, title: newTitle } : tab
    ));
  };

  const startEditingTab = (tabId, e) => {
    e.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    setEditingTabId(tabId);
    setEditingTitle(tab.title);
  };

  const finishEditingTab = () => {
    if (editingTabId) {
      updateTabTitle(editingTabId, editingTitle);
      setEditingTabId(null);
      setEditingTitle('');
    }
  };

  const handleEditingKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditingTab();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
      setEditingTitle('');
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-background text-text-primary' : 'bg-gray-100 text-gray-900'}`}>
      <GradientWaveBackground />
      <div className="relative z-10 flex w-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} addTab={addTab} />
        <div 
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: isSidebarOpen ? '250px' : '80px' }}
        >
          <header className={`${isDarkMode ? 'bg-surface' : 'bg-white'} bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <motion.h1 
                className={`text-3xl font-bold ${isDarkMode ? 'text-primary' : 'text-blue-600'} mb-4`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                NexDB Dashboard
              </motion.h1>
              <div className="flex space-x-2 overflow-x-auto">
                {tabs.map(tab => (
                  <div 
                    key={tab.id} 
                    className={`group flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeTab === tab.id 
                        ? isDarkMode 
                          ? 'bg-background text-text-primary' 
                          : 'bg-white text-blue-600'
                        : isDarkMode
                          ? 'bg-surface text-text-secondary hover:bg-background-light'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {editingTabId === tab.id ? (
                      <div className="flex items-center">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={finishEditingTab}
                          onKeyDown={handleEditingKeyDown}
                          className={`bg-transparent border-b-2 ${
                            isDarkMode ? 'border-primary text-text-primary' : 'border-blue-600 text-gray-900'
                          } focus:outline-none px-1 py-0.5 w-32 rounded`}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); finishEditingTab(); }}
                          className={`ml-2 p-1 rounded-full ${
                            isDarkMode ? 'bg-primary text-text-primary' : 'bg-blue-600 text-white'
                          } hover:opacity-80 transition-opacity duration-200`}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate max-w-[100px]">{tab.title}</span>
                        <button 
                          onClick={(e) => startEditingTab(tab.id, e)}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full ${
                            isDarkMode ? 'hover:bg-background-light' : 'hover:bg-gray-300'
                          }`}
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {tabs.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full ${
                          isDarkMode ? 'hover:bg-background-light' : 'hover:bg-gray-300'
                        }`}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </header>
          <main 
            ref={mainRef}
            className={`flex-1 overflow-auto p-8 ${isDarkMode ? 'bg-background' : 'bg-gray-100'} bg-opacity-70`}
          >
            <motion.div 
              className="max-w-7xl mx-auto"
              style={{ y }}
            >
              <AnimatePresence mode="wait">
                {tabs.map(tab => (
                  tab.id === activeTab && (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Section
                        {...sections.find(section => section.id === tab.content)}
                        addTab={addTab}
                        updateTabTitle={(newTitle) => updateTabTitle(tab.id, newTitle)}
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;