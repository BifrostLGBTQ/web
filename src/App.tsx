import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import MatchScreen from './components/MatchScreen';
import NearbyScreen from './components/NearbyScreen';
import ProfileScreen from './components/ProfileScreen';
import SearchScreen from './components/SearchScreen';
import MessagesScreen from './components/MessagesScreen';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext.tsx';
import AuthWizard from './components/AuthWizard';
import { Home, Search, MapPin, Heart, MessageCircle, User, Map, Building2, Menu, X, Sun, Moon, Languages, Sparkles, TrendingUp, Users, MoreHorizontal, Star, Activity, Flame, TrendingDown, FileText } from 'lucide-react';
import PlacesScreen from './components/PlacesScreen';
import HomeScreen from './components/HomeScreen';
import LanguageSelector from './components/LanguageSelector.tsx';
import CreatePost from './components/CreatePost.tsx';
import ClassifiedsScreen from './components/ClassifiedsScreen';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthWizardOpen, setIsAuthWizardOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();


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
    { id: 'classifieds', label: 'Classifieds', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];



  return (
    <>
      {/* Twitter Style Layout - 3 Columns */}
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        
        {/* Left Sidebar - Fixed */}
        <aside className={`hidden lg:flex flex-col w-[280px] ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
                  PrideApp
                </h1>
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'search', label: 'Explore', icon: Search },
                { id: 'match', label: 'Matches', icon: Heart },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'places', label: 'Places', icon: Building2 },
                { id: 'classifieds', label: 'Classifieds', icon: FileText },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
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
                  onClick={() => setActiveScreen('profile')}
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
        <main className={`flex-1 min-w-0 ${theme === 'dark' ? 'border-l border-r border-black' : 'border-l border-r border-gray-100'}`}>
          {/* Render Content */}
          {activeScreen === 'home' && <HomeScreen />}
          {activeScreen === 'following' && <HomeScreen />}
          {activeScreen === 'search' && <SearchScreen />}
          {activeScreen === 'match' && <MatchScreen />}
          {activeScreen === 'nearby' && <NearbyScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
          {activeScreen === 'places' && <PlacesScreen />}
          {activeScreen === 'messages' && <MessagesScreen />}
          {activeScreen === 'classifieds' && <ClassifiedsScreen />}
        </main>

        {/* Right Sidebar - Fixed */}
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
                        setSelectedUser(match.name.toLowerCase());
                        setActiveScreen('profile');
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
                        setSelectedUser(user.username);
                        setActiveScreen('profile');
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
      </div>

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





      {/* Footer - Only show on home screen */}
      {activeScreen === 'xxhome' && <Footer />}

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
