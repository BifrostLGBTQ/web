import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import Stories from './components/Stories';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import MatchScreen from './components/MatchScreen';
import NearbyScreen from './components/NearbyScreen';
import ProfileScreen from './components/ProfileScreen';
import SearchScreen from './components/SearchScreen';
import MessagesScreen from './components/MessagesScreen';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext.tsx';
import AuthWizard from './components/AuthWizard';
import { Home, Search, MapPin, Heart, MessageCircle, User, Map, Building2, Menu, X, Sun, Moon, Languages } from 'lucide-react';
import PlacesScreen from './components/PlacesScreen';
import HomeScreen from './components/HomeScreen';
import LanguageSelector from './components/LanguageSelector.tsx';
import React, { Suspense, lazy } from "react";

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthWizardOpen, setIsAuthWizardOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'match', label: 'Match', icon: Heart },
    { id: 'messages', label: 'Chat', icon: MessageCircle },
    { id: 'places', label: 'Places', icon: Building2 },
  ];

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'match', label: 'Match', icon: Heart },
    { id: 'places', label: 'Places', icon: Building2 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'search':
        return <SearchScreen />;
      case 'match':
        return <MatchScreen />;
      case 'nearby':
        return <NearbyScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'places':
        return <PlacesScreen />;
      case 'messages':
        return <MessagesScreen />;
      default:
        return (
          <HomeScreen />
        );
    }
  };

  return (
    <>
      {/* Professional Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-center  h-16 sm:h-20">


            <motion.div
              className="w-full flex justify-start items-center space-x-2 sm:space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <nav className={`flex items-center space-x-2 p-2 rounded-2xl backdrop-blur-xl border-b  border-b ${theme === 'dark'
                  ? 'border-gray-800/30 bg-black/10 border-black/20'
                  : 'border-gray-200/30  bg-white/10 border-white/20'
                } ${theme === 'dark'
                  ? 'bg-gray-900/50 border border-gray-800'
                  : 'bg-gray-50/50 border border-gray-200'
                }`}>


                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center ${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300'
                  }`}>
                  <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>P</span>
                </div>
                <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  TESTTEST
                </h1>
              </nav>
            </motion.div>


            {/* Professional Desktop Navigation */}
            <div className="w-full hidden lg:flex  items-center">
              <nav className={`flex items-center space-x-2 p-2 rounded-2xl backdrop-blur-xl border-b  border-b ${theme === 'dark'
                  ? 'border-gray-800/30 bg-black/10 border-black/20'
                  : 'border-gray-200/30  bg-white/10 border-white/20'
                } ${theme === 'dark'
                  ? 'bg-gray-900/50 border border-gray-800'
                  : 'bg-gray-50/50 border border-gray-200'
                }`}>
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isActive
                          ? theme === 'dark'
                            ? 'text-white bg-white/10 shadow-lg'
                            : 'text-white bg-gray-900 shadow-lg'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                        }`}
                      whileHover={{
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 17 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden xl:block">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Right Section - Mobile Optimized */}
            <div className="w-full   justify-end flex items-center space-x-2 sm:space-x-3">
              <nav className={`flex items-center space-x-2 p-2 rounded-2xl backdrop-blur-xl border-b  border-b ${theme === 'dark'
                  ? 'border-gray-800/30 bg-black/10 border-black/20'
                  : 'border-gray-200/30  bg-white/10 border-white/20'
                } ${theme === 'dark'
                  ? 'bg-gray-900/50 border border-gray-800'
                  : 'bg-gray-50/50 border border-gray-200'
                }`}>
                {/* Map Icon - Desktop */}
                <motion.button
                  onClick={() => setActiveScreen('nearby')}
                  className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 ${activeScreen === 'nearby'
                      ? theme === 'dark'
                        ? 'bg-white/10 text-white border border-gray-600'
                        : 'bg-gray-900 text-white border border-gray-300'
                      : theme === 'dark'
                        ? 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
                        : 'bg-gray-100/50 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Map className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>

                {/* Language Icon - Desktop */}
                <motion.button
                  onClick={() =>
                    setIsLanguageSelectorOpen(true)

                  }
                  className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 
                  ${isLanguageSelectorOpen
                      ? theme === 'dark'
                        ? 'bg-white/10 text-white border border-gray-600'
                        : 'bg-gray-900 text-white border border-gray-300'
                      : theme === 'dark'
                        ? 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
                        : 'bg-gray-100/50 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>





                {/* Theme Toggle - Desktop */}
                <motion.button
                  onClick={toggleTheme}
                  className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 ${theme === 'dark'
                      ? 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
                      : 'bg-gray-100/50 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {theme === 'dark' ?
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> :
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                </motion.button>

                {/* Profile Avatar or Auth Button */}
                {isAuthenticated ? (
                  <motion.button
                    onClick={() => setActiveScreen('profile')}
                    className={`flex items-center space-x-1 sm:space-x-2 p-0.5 sm:p-1 rounded-xl transition-all duration-300 ${activeScreen === 'profile'
                        ? theme === 'dark'
                          ? 'bg-gray-800 ring-2 ring-gray-600'
                          : 'bg-gray-100 ring-2 ring-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <img
                      src={user?.avatar || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"}
                      alt="Profile"
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <span className={`hidden md:block font-medium text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      {user?.displayname || user?.username || 'Unknown'}
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setIsAuthWizardOpen(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${theme === 'dark'
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Join</span>
                  </motion.button>
                )}

                {/* Mobile Menu Button - Ultra Clean */}
                <motion.button
                  className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${theme === 'dark'
                      ? 'bg-gray-800/70 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700/50'
                      : 'bg-gray-100/70 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200/50'
                    } backdrop-blur-sm`}
                  onClick={() => setIsMobileMenuOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.button>
              </nav>
            </div>
          </div>
        </div>
      </motion.header>
      {/* Professional Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-[101] ${theme === 'dark'
                  ? 'bg-gray-900/95 backdrop-blur-xl border-r border-gray-800'
                  : 'bg-white/95 backdrop-blur-xl border-r border-gray-200'
                } shadow-2xl flex flex-col`}
            >
              {/* Header */}
              <div className={`relative px-6 py-8 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                    alt="Profile"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                      Alex Rivera
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      @alexr_pride
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-2">
                  {mobileNavItems.map((item, index) => {
                    const isActive = activeScreen === item.id;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 ${isActive
                            ? theme === 'dark'
                              ? 'bg-white/10 text-white shadow-lg border border-gray-700'
                              : 'bg-gray-900 text-white shadow-lg'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          setActiveScreen(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-base">{item.label}</span>
                        {isActive && (
                          <motion.div
                            className={`ml-auto w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-white'
                              }`}
                            layoutId="mobileActiveIndicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className={`px-6 py-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 ${theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content - Mobile Optimized */}
      <div className="pt-16 sm:pt-20 scrollbar-hide w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>



      {/* Footer - Only show on home screen */}
      {activeScreen === 'home' && <Footer />}

      {/* Auth Wizard */}
      <AuthWizard
        isOpen={isAuthWizardOpen}
        onClose={() => setIsAuthWizardOpen(false)}
      />
      {/* LanguageSelector */}
      <LanguageSelector isOpen={isLanguageSelectorOpen} onClose={() => setIsLanguageSelectorOpen(false)} />

    </>
  );
}

export default App;
