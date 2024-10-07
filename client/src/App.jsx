import React, { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Section from './components/Section';
import AnimatedBackground from './components/AnimatedBackground';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ThemeProvider, ThemeContext } from './ThemeContext';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-background text-text-primary' : 'bg-gray-100 text-gray-900'}`}>
      <AnimatedBackground />
      <div className="relative z-10 flex w-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div 
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: isSidebarOpen ? '250px' : '80px' }}
        >
          <header className={`${isDarkMode ? 'bg-surface' : 'bg-white'} bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <motion.h1 
                className={`text-3xl font-bold ${isDarkMode ? 'text-primary' : 'text-blue-600'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                NexDB Dashboard
              </motion.h1>
            </div>
          </header>
          <main className={`flex-1 overflow-auto p-8 ${isDarkMode ? 'bg-background' : 'bg-gray-100'} bg-opacity-70`}>
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <Section id="insert" title="Insert Document" icon={<ChartBarIcon className="w-6 h-6" />} />
                <Section id="find" title="Find Documents" icon={<ChartBarIcon className="w-6 h-6" />} />
                <Section id="update" title="Update Document" icon={<ChartBarIcon className="w-6 h-6" />} />
                <Section id="index" title="Create Index" icon={<ChartBarIcon className="w-6 h-6" />} />
              </motion.div>
            </div>
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