import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const SettingsModal = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const setTheme = (theme) => {
    if (theme === 'system') {
      localStorage.removeItem('theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggleTheme(systemPreference);
    } else {
      toggleTheme(theme === 'dark');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Settings</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-300">Theme</span>
              <div className="flex space-x-2">
                <ThemeButton icon={<SunIcon className="w-6 h-6" />} onClick={() => setTheme('light')} active={!isDarkMode} />
                <ThemeButton icon={<MoonIcon className="w-6 h-6" />} onClick={() => setTheme('dark')} active={isDarkMode} />
                <ThemeButton icon={<ComputerDesktopIcon className="w-6 h-6" />} onClick={() => setTheme('system')} active={localStorage.getItem('theme') === null} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThemeButton = ({ icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
    }`}
  >
    {icon}
  </button>
);

export default SettingsModal;