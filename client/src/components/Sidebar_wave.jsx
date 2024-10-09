import React, { useContext, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { PlusCircleIcon, MagnifyingGlassIcon, PencilIcon, Square3Stack3DIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, CogIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../ThemeContext';

const Sidebar = ({ isOpen, setIsOpen, addTab }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const controls = useAnimation();

  useEffect(() => {
    controls.start(isOpen ? 'open' : 'closed');
  }, [isOpen, controls]);

  const sidebarVariants = {
    open: { 
      width: '250px',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    },
    closed: { 
      width: '80px',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

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
    <motion.div
      animate={controls}
      variants={sidebarVariants}
      className={`${isDarkMode ? 'bg-surface' : 'bg-white'} bg-opacity-70 h-full fixed left-0 top-0 z-20 shadow-lg backdrop-filter backdrop-blur-lg overflow-hidden`}
      initial="closed"
    >
      <div className="p-5 flex flex-col h-full">
        <motion.div 
          className="flex items-center justify-between mb-10"
          animate={{ justifyContent: isOpen ? 'space-between' : 'center' }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.h1
                className={`text-2xl font-bold ${isDarkMode ? 'text-primary' : 'text-blue-600'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                NexDB
              </motion.h1>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`${isDarkMode ? 'text-text-primary bg-background-light hover:bg-background-lighter' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} p-2 rounded-full transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <ChevronDoubleLeftIcon className="w-5 h-5" /> : <ChevronDoubleRightIcon className="w-5 h-5" />}
          </motion.button>
        </motion.div>

        <nav className="flex-grow">
          <motion.ul 
            className="space-y-4"
            variants={{
              open: {
                transition: { staggerChildren: 0.07, delayChildren: 0.2 }
              },
              closed: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 }
              }
            }}
          >
            <NavItem isOpen={isOpen} title="Insert" icon={<PlusCircleIcon className="w-6 h-6" />} onClick={() => addTab('insert')} />
            <NavItem isOpen={isOpen} title="Find" icon={<MagnifyingGlassIcon className="w-6 h-6" />} onClick={() => addTab('find')} />
            <NavItem isOpen={isOpen} title="Update" icon={<PencilIcon className="w-6 h-6" />} onClick={() => addTab('update')} />
            <NavItem isOpen={isOpen} title="Create Index" icon={<Square3Stack3DIcon className="w-6 h-6" />} onClick={() => addTab('index')} />
          </motion.ul>
        </nav>

        <motion.div 
          className="mt-auto"
          variants={{
            open: { opacity: 1, y: 0 },
            closed: { opacity: 0, y: 20 }
          }}
        >
          <div className="flex space-x-2 mb-4">
            <ThemeButton 
              icon={<SunIcon className="w-5 h-5" />} 
              onClick={() => setTheme('light')} 
              active={!isDarkMode}
            />
            <ThemeButton 
              icon={<MoonIcon className="w-5 h-5" />} 
              onClick={() => setTheme('dark')} 
              active={isDarkMode}
            />
            <ThemeButton 
              icon={<ComputerDesktopIcon className="w-5 h-5" />} 
              onClick={() => setTheme('system')} 
              active={false}
            />
          </div>
          <NavItem isOpen={isOpen} title="Settings" icon={<CogIcon className="w-6 h-6" />} onClick={() => {}} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const NavItem = ({ isOpen, title, icon, onClick }) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <motion.li 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      variants={{
        open: {
          y: 0,
          opacity: 1,
          transition: {
            y: { stiffness: 1000, velocity: -100 }
          }
        },
        closed: {
          y: 50,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 }
          }
        }
      }}
    >
      <button
        onClick={onClick}
        className={`flex items-center space-x-4 p-2 rounded-lg w-full text-left ${
          isDarkMode 
            ? 'hover:bg-background-light text-text-secondary' 
            : 'hover:bg-gray-200 text-gray-600'
        } transition-colors duration-200`}
      >
        <motion.span 
          className={isDarkMode ? 'text-primary' : 'text-blue-600'}
          whileHover={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          {icon}
        </motion.span>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              className={isDarkMode ? 'text-text-primary' : 'text-gray-800'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
};

const ThemeButton = ({ icon, onClick, active }) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <motion.button
      onClick={onClick}
      className={`p-2 rounded-full ${
        active
          ? isDarkMode
            ? 'bg-primary text-text-primary'
            : 'bg-blue-500 text-white'
          : isDarkMode
          ? 'bg-background-light text-text-secondary'
          : 'bg-gray-200 text-gray-600'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      variants={{
        open: {
          y: 0,
          opacity: 1,
          transition: {
            y: { stiffness: 1000, velocity: -100 }
          }
        },
        closed: {
          y: 50,
          opacity: 0,
          transition: {
            y: { stiffness: 1000 }
          }
        }
      }}
    >
      {icon}
    </motion.button>
  );
};

export default Sidebar;