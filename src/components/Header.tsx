import React, { useState } from 'react';
import { Search, Bell, MessageCircle, Heart, User, Menu, Settings, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div 
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800' 
                  : 'bg-gray-200'
              }`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: theme === 'dark' 
                  ? "0 8px 25px 0 rgba(0,0,0,0.4)"
                  : "0 8px 25px 0 rgba(0,0,0,0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
              }`} fill="currentColor" />
            </motion.div>
            <div className="flex flex-col">
              <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                PrideConnect
              </h1>
              <p className={`text-xs font-medium tracking-wide uppercase hidden sm:block ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Professional Network
              </p>
            </div>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div 
            className="hidden md:flex flex-1 max-w-2xl mx-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative w-full">
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                isSearchFocused 
                  ? theme === 'dark'
                    ? 'bg-gray-800 border-2 border-gray-600'
                    : 'bg-gray-100 border-2 border-gray-400'
                  : theme === 'dark'
                    ? 'bg-gray-800/90 border border-gray-700'
                    : 'bg-gray-100/90 border border-gray-300'
              }`} />
              <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                isSearchFocused 
                  ? theme === 'dark' ? 'text-white' : 'text-gray-700'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search professionals, communities, events..."
                className={`relative w-full pl-14 pr-6 py-4 bg-transparent border-none outline-none font-medium text-sm tracking-wide ${
                  theme === 'dark' 
                    ? 'text-white placeholder-gray-400' 
                    : 'text-gray-900 placeholder-gray-500'
                }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <kbd className={`hidden lg:inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${
                  theme === 'dark'
                    ? 'text-gray-300 bg-gray-700/50 border-gray-600'
                    : 'text-gray-600 bg-gray-200/50 border-gray-300'
                }`}>
                  ⌘K
                </kbd>
              </div>
            </div>
          </motion.div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-1">
            {/* Notifications */}
            <motion.button
              className={`relative p-2 sm:p-3 rounded-2xl transition-all duration-300 group ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Bell className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
              }`} />
              <motion.span 
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm ${
                  theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 500, damping: 15 }}
              />
            </motion.button>

            {/* Messages */}
            <motion.button
              className={`relative p-2 sm:p-3 rounded-2xl transition-all duration-300 group ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <MessageCircle className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
              }`} />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`relative p-2 sm:p-3 rounded-2xl transition-all duration-300 group ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
              )}
            </motion.button>

            {/* Divider */}
            <div className={`w-px h-6 sm:h-8 mx-1 sm:mx-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`} />

            {/* Profile Menu */}
            <div className="relative">
              <motion.button 
                className={`flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-2xl transition-all duration-300 group ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                    alt="Profile"
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl object-cover border-2 shadow-sm ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 shadow-sm ${
                    theme === 'dark' ? 'bg-gray-400 border-gray-900' : 'bg-gray-500 border-white'
                  }`} />
                </div>
                <div className="hidden lg:block text-left">
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Alex Rivera</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Professional</p>
                </div>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-xl border backdrop-blur-xl ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border-gray-800' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`p-4 border-b ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                          alt="Profile"
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                        <div>
                          <p className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>Alex Rivera</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>alexr_pride@email.com</p>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                            }`} />
                            <span className={`text-xs font-medium ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:bg-gray-800' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:bg-gray-800' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <div className={`border-t my-2 ${
                        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                      }`} />
                      <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:bg-gray-800' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}>
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;