import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import MatchScreen from './components/MatchScreen';
import NearbyScreen from './components/NearbyScreen';
import ProfileScreen from './components/ProfileScreen';
import SearchScreen from './components/SearchScreen';
import MessagesScreen from './components/MessagesScreen';
import NotificationsScreen from './components/NotificationsScreen';
import SplashScreen from './components/SplashScreen';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext.tsx';
import AuthWizard from './components/AuthWizard';
import { Home, Search, MapPin, Heart, MessageCircle, User, Map, Building2, Menu, X, Sun, Moon, Languages, Sparkles, TrendingUp, Users, MoreHorizontal, Star, Activity, Flame, TrendingDown, FileText, Bell } from 'lucide-react';
import PlacesScreen from './components/PlacesScreen';
import HomeScreen from './components/HomeScreen';
import LanguageSelector from './components/LanguageSelector.tsx';
import CreatePost from './components/CreatePost.tsx';
import ClassifiedsScreen from './components/ClassifiedsScreen';
import './i18n';
import i18n, { setLanguage } from './i18n';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthWizardOpen, setIsAuthWizardOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Update activeScreen based on current URL
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') {
      setActiveScreen('home');
    } else if (path === '/search') {
      setActiveScreen('search');
    } else if (path === '/nearby') {
      setActiveScreen('nearby');
    } else if (path === '/match') {
      setActiveScreen('match');
    } else if (path === '/messages') {
      setActiveScreen('messages');
    } else if (path === '/notifications') {
      setActiveScreen('notifications');
    } else if (path === '/places') {
      setActiveScreen('places');
    } else if (path === '/classifieds') {
      setActiveScreen('classifieds');
    } else if (path.startsWith('/') && path.split('/').length === 2) {
      // Profile route like /username
      setActiveScreen('profile');
    }
  }, [location.pathname]);


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
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'classifieds', label: 'Classifieds', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];



  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Twitter Style Layout - 3 Columns */}
      {!showSplash && (
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        
        {/* Mobile Header - Top Navigation */}
        <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800/50' : 'bg-white/95 backdrop-blur-xl border-b border-gray-100/50'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
            >
              <Menu className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark'
                ? 'bg-gradient-to-br from-white to-gray-300 text-black'
                : 'bg-gradient-to-br from-black to-gray-700 text-white'
              }`}>
                <span className="text-sm font-bold">P</span>
              </div>
              <h1 className={`text-lg font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                SOCIAL
              </h1>
            </div>
            <button
              onClick={() => setIsAuthWizardOpen(true)}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
            >
              <User className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </button>
          </div>
        </header>
        
        {/* Left Sidebar - Fixed */}
        <aside className={`hidden    scrollbar-hide lg:flex flex-col w-[280px] ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="p-4 sticky top-0 h-screen overflow-y-auto flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4 pt-2">
              <button className="flex items-center space-x-3 p-3 rounded-full hover:bg-opacity-10 transition-colors group">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${theme === 'dark'
                    ? 'bg-gradient-to-br from-white to-gray-300 text-black'
                    : 'bg-gradient-to-br from-black to-gray-700 text-white'
                  }`}>
                  <span className="text-xl font-bold">P</span>
                </div>
                <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  SOCIAL
                </h1>
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'nearby', label: 'NearBy', icon: MapPin },
                { id: 'search', label: 'Explore', icon: Search },
                { id: 'match', label: 'Matches', icon: Heart },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'places', label: 'Places', icon: Building2 },
                { id: 'classifieds', label: 'Classifieds', icon: FileText },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'home') {
                        navigate('/');
                      } else if (item.id === 'profile') {
                        navigate(`/${user?.username || 'profile'}`);
                      } else {
                        navigate(`/${item.id}`);
                      }
                    }}
                    className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-full transition-all duration-200 group ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-white text-black shadow-lg shadow-white/20'
                          : 'bg-black text-white shadow-lg shadow-black/20'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-white/10'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-semibold text-base tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-4 pb-2 space-y-3">
              
              {/* User Profile Card */}
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(`/${user?.username || 'profile'}`)}
                  className={`w-full p-3 rounded-2xl transition-all duration-200 border border-transparent hover:border-opacity-30 ${
                    theme === 'dark' 
                      ? 'hover:bg-white/5 hover:border-white/30' 
                      : 'hover:bg-black/5 hover:border-black/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full ring-2 ${theme === 'dark' ? 'ring-white/20' : 'ring-black/20'}`}>
                        <img
                          src={user?.profile_image_url || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ${theme === 'dark' ? 'ring-black' : 'ring-white'}`}></div>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user?.displayname || user?.username || 'User'}
                      </p>
                      <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{user?.username || 'username'}
                      </p>
                    </div>
                    <MoreHorizontal className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthWizardOpen(true)}
                  className={`w-full px-4 py-3.5 rounded-full font-bold transition-all duration-200 shadow-lg hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-white to-gray-200 text-black hover:shadow-white/20'
                      : 'bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-black/20'
                  }`}
                >
                  Join Now
                </button>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-2 px-2">
                <button
                  onClick={toggleTheme}
                  className={`flex-1 py-2.5 rounded-full transition-all duration-200 hover:scale-105 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 mx-auto" /> : <Moon className="w-5 h-5 mx-auto" />}
                </button>
                <button
                  onClick={() => setIsLanguageSelectorOpen(true)}
                  className={`flex-1 py-2.5 rounded-full transition-all duration-200 hover:scale-105 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  title="Language"
                >
                  <Languages className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Section - Scrollable */}
        <main className={`
              max-h-[100dvh] 
            
    scrollbar-hide
     flex-1 min-w-0 lg:border-l lg:border-r ${theme === 'dark' ? 'lg:border-gray-800/30' : 'lg:border-gray-100/50'} pt-[56px] lg:pt-0 pb-[70px] lg:pb-0`}>
          <Routes>
            {/* Home Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            
            {/* Profile Routes */}
            <Route path="/:username" element={<ProfileScreen />} />
            <Route path="/:username/status/:postId" element={<HomeScreen />} />
            
            {/* Other Routes */}
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/match" element={<MatchScreen />} />
            <Route path="/nearby" element={<NearbyScreen />} />
            <Route path="/places" element={<PlacesScreen />} />
            <Route path="/messages" element={<MessagesScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/classifieds" element={<ClassifiedsScreen />} />
            
            {/* Fallback */}
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </main>

        {/* Right Sidebar - Fixed */}
        {/* Hide right sidebar on messages and notifications routes for better UX */}
        {location.pathname !== '/messages' && (
        <aside className={`hidden xl:flex scrollbar-hide flex-col w-[380px] ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="p-5 sticky top-0 h-screen scrollbar-hide overflow-y-auto space-y-4">
            
            {/* Discover Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-white border border-gray-200'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    <h2 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      New Matches
                    </h2>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                    3
                  </span>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                  {[
                    { name: 'Alex', age: 28, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isNew: true, mutual: 'New York' },
                    { name: 'Jordan', age: 25, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isNew: true, mutual: 'Los Angeles' },
                    { name: 'Sam', age: 30, avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', isNew: true, mutual: 'San Francisco' },
                  ].map((match, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-28 cursor-pointer group"
                      onClick={() => {
                        navigate(`/${match.name.toLowerCase()}`);
                      }}
                    >
                      <div className="relative">
                        <div className={`w-full aspect-square rounded-2xl overflow-hidden transition-all duration-200 ${match.isNew ? 'ring-2 ring-red-500' : 'ring-2 ring-transparent'} group-hover:ring-2 group-hover:ring-opacity-50 ${match.isNew ? 'group-hover:ring-red-500' : 'group-hover:ring-gray-400'}`}>
                          <img
                            src={match.avatar}
                            alt={match.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {match.isNew && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                        )}
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="backdrop-blur-sm bg-black/70 rounded-lg px-2 py-1">
                            <p className="text-white text-[10px] font-bold">New</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {match.name}, {match.age}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Suggested Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-white border border-gray-200'}`}
            >
              <div className="p-4">
                <div className="mb-3">
                  <h2 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Suggested Matches
                  </h2>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Based on your preferences
                  </p>
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: 'Alex Rivera', age: 28, username: 'alexr', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: '8 mutual friends', isOnline: true, location: 'New York, NY', verified: true },
                    { name: 'Jordan Smith', age: 25, username: 'jordansmith', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: '12 mutual friends', isOnline: false, location: 'Los Angeles, CA', verified: false },
                    { name: 'Taylor Davis', age: 30, username: 'taylord', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: '15 mutual friends', isOnline: true, location: 'San Francisco, CA', verified: true },
                  ].map((user, index) => (
                    <div 
                      key={index} 
                      className="group cursor-pointer rounded-xl p-2 transition-all duration-200"
                      style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
                      }}
                      onClick={() => {
                        navigate(`/${user.username}`);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl overflow-hidden ${user.isOnline ? 'ring-2 ring-green-500/50' : ''}`}>
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {user.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {user.name}
                              </p>
                              {user.verified && (
                                <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 2.96 8.6 1.54 6.71 4.72l-3.61.82.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21.04l3.4 1.42 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10.29 4.8l-4.5-4.31 1.39-1.32 3.11 2.97 5.98-6.03 1.39 1.37-7.37 7.32z"/>
                                </svg>
                              )}
                            </div>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.age} · {user.location}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                            theme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200'
                              : 'bg-black text-white hover:bg-gray-900'
                          }`}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </aside>
        )}

      {/* Mobile Bottom Navigation Bar - Twitter Style */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-black/95 backdrop-blur-xl border-t border-gray-800/50' : 'bg-white/95 backdrop-blur-xl border-t border-gray-100/50'} safe-area-inset-bottom`}>
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'search', icon: Search, label: 'Explore' },
            { id: 'match', icon: Heart, label: 'Matches' },
            { id: 'messages', icon: MessageCircle, label: 'Messages' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.id === 'home') {
                    navigate('/');
                  } else if (item.id === 'profile') {
                    navigate(`/${user?.username || 'profile'}`);
                  } else {
                    navigate(`/${item.id}`);
                  }
                }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? 'text-white'
                      : 'text-black'
                    : theme === 'dark'
                      ? 'text-gray-500'
                      : 'text-gray-500'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="mobileBottomNavIndicator"
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
      </div>
      </nav>

      {/* Professional Mobile Menu - Optimized */}
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          document.body.style.overflow = '';
        }}
      >
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`fixed inset-0 z-[100]`}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ willChange: 'opacity' }}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
                mass: 0.8
              }}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-[101] ${
                theme === 'dark'
                  ? 'bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 shadow-2xl'
                  : 'bg-white/50 backdrop-blur-xl border-r border-gray-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.08)]'
              } flex flex-col`}
              onAnimationStart={() => {
                // Prevent body scroll when menu is opening
                if (isMobileMenuOpen) {
                  document.body.style.overflow = 'hidden';
                }
              }}
            >
              {/* Header */}
              <div className={`relative px-6 py-8 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  whileTap={{ scale: 0.9 }}
                  style={{ willChange: 'transform' }}
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
              <nav className="flex-1 px-6 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {mobileNavItems.map((item, index) => {
                    const isActive = activeScreen === item.id;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${isActive
                            ? theme === 'dark'
                              ? 'bg-white/10 text-white shadow-lg border border-gray-700'
                              : 'bg-gray-900 text-white shadow-lg'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          if (item.id === 'home') {
                            navigate('/');
                          } else if (item.id === 'profile') {
                            navigate(`/${user?.username || 'profile'}`);
                          } else {
                            navigate(`/${item.id}`);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.2,
                          ease: 'easeOut'
                        }}
                        whileTap={{ scale: 0.97 }}
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <Icon className="w-6 h-6 flex-shrink-0" />
                        <span className="text-base">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className={`px-6 py-6 border-t space-y-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                <motion.button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  whileTap={{ scale: 0.97 }}
                  style={{ willChange: 'transform' }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsLanguageSelectorOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  whileTap={{ scale: 0.97 }}
                  style={{ willChange: 'transform' }}
                >
                  <Languages className="w-5 h-5" />
                  <span>Language</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-black/95 backdrop-blur-xl border-t border-gray-800/50' : 'bg-white/95 backdrop-blur-xl border-t border-gray-100/50'} safe-area-inset-bottom`}>
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'search', icon: Search, label: 'Explore' },
              { id: 'match', icon: Heart, label: 'Matches' },
              { id: 'messages', icon: MessageCircle, label: 'Messages' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'home') {
                      navigate('/');
                    } else if (item.id === 'profile') {
                      navigate(`/${user?.username || 'profile'}`);
                    } else {
                      navigate(`/${item.id}`);
                    }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? theme === 'dark'
                        ? 'text-white'
                        : 'text-black'
                      : theme === 'dark'
                        ? 'text-gray-500'
                        : 'text-gray-500'
                  }`}
                >
                  <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobileBottomNavIndicator"
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Professional Mobile Menu - Optimized */}
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            document.body.style.overflow = '';
          }}
        >
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`fixed inset-0 z-[100]`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ willChange: 'opacity' }}
              />

              {/* Mobile Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 40,
                  mass: 0.8
                }}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
                className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-[101] ${
                  theme === 'dark'
                    ? 'bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 shadow-2xl'
                    : 'bg-white/50 backdrop-blur-xl border-r border-gray-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.08)]'
                } flex flex-col`}
                onAnimationStart={() => {
                  // Prevent body scroll when menu is opening
                  if (isMobileMenuOpen) {
                    document.body.style.overflow = 'hidden';
                  }
                }}
              >
                {/* Header */}
                <div className={`relative px-6 py-8 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      }`}
                    whileTap={{ scale: 0.9 }}
                    style={{ willChange: 'transform' }}
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
                <nav className="flex-1 px-6 py-6 overflow-y-auto">
                  <div className="space-y-2">
                    {mobileNavItems.map((item, index) => {
                      const isActive = activeScreen === item.id;
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${isActive
                              ? theme === 'dark'
                                ? 'bg-white/10 text-white shadow-lg border border-gray-700'
                                : 'bg-gray-900 text-white shadow-lg'
                              : theme === 'dark'
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          onClick={() => {
                            if (item.id === 'home') {
                              navigate('/');
                            } else if (item.id === 'profile') {
                              navigate(`/${user?.username || 'profile'}`);
                            } else {
                              navigate(`/${item.id}`);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.2,
                            ease: 'easeOut'
                          }}
                          whileTap={{ scale: 0.97 }}
                          style={{ willChange: 'transform, opacity' }}
                        >
                          <Icon className="w-6 h-6 flex-shrink-0" />
                          <span className="text-base">{item.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className={`px-6 py-6 border-t space-y-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                  <motion.button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    whileTap={{ scale: 0.97 }}
                    style={{ willChange: 'transform' }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsLanguageSelectorOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    whileTap={{ scale: 0.97 }}
                    style={{ willChange: 'transform' }}
                  >
                    <Languages className="w-5 h-5" />
                    <span>Language</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      )}

      {/* Footer - Only show on home screen */}
      {!showSplash && activeScreen === 'xxhome' && <Footer />}

      {/* Auth Wizard */}
      {!showSplash && (
      <AuthWizard
        isOpen={isAuthWizardOpen}
        onClose={() => setIsAuthWizardOpen(false)}
      />
      )}
      
      {/* LanguageSelector */}
      {!showSplash && (
      <LanguageSelector isOpen={isLanguageSelectorOpen} onClose={() => setIsLanguageSelectorOpen(false)} />
      )}

    </>
  );
}

export default App;
