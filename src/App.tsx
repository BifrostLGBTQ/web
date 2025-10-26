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
import { Home, Search, MapPin, Heart, MessageCircle, User, Map, Building2, Menu, X, Sun, Moon, Languages, Sparkles, TrendingUp, Users, MoreHorizontal } from 'lucide-react';
import PlacesScreen from './components/PlacesScreen';
import HomeScreen from './components/HomeScreen';
import LanguageSelector from './components/LanguageSelector.tsx';
import CreatePost from './components/CreatePost.tsx';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthWizardOpen, setIsAuthWizardOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

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
        </main>

        {/* Right Sidebar - Fixed */}
        <aside className={`hidden xl:flex flex-col w-[350px] ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="p-6 sticky top-0 h-screen overflow-y-auto space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search"
                className={`w-full pl-12 pr-4 py-3 rounded-full ${theme === 'dark' ? 'bg-gray-900 text-white placeholder-gray-400 border border-gray-800' : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all`}
              />
            </div>

            {/* Trending Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-100'}`}
            >
              <div className="p-5">
                <h2 className={`font-bold text-xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Trending Now
                </h2>
                
                <div className="space-y-1">
                  {[
                    { category: 'Technology', tag: 'AI Revolution', posts: '12.5K', trending: true },
                    { category: 'Entertainment', tag: '#MovieNight', posts: '8.9K', trending: false },
                    { category: 'Lifestyle', tag: 'Healthy Living', posts: '5.2K', trending: true },
                    { category: 'Trending', tag: '#NewYear', posts: '45.8K', trending: false },
                  ].map((trend, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {trend.category}
                        </p>
                        <button className={`p-1 rounded-full transition-colors ${
                          theme === 'dark' ? 'hover:bg-white hover:bg-opacity-10' : 'hover:bg-gray-200'
                        }`}>
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-start justify-between">
                        <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {trend.trending && <Sparkles className="inline w-3 h-3 mr-1 text-blue-500" />}
                          {trend.tag}
                        </p>
                      </div>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {trend.posts} posts
                      </p>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-2.5 px-4 mt-3 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
                }`}>
                  Show more
                </button>
              </div>
            </motion.div>

            {/* Who to Follow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-100'}`}
            >
              <div className="p-5">
                <h2 className={`font-bold text-xl mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Who to Follow
                </h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'Alex Rivera', username: 'alexr', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 8 },
                    { name: 'Jordan Smith', username: 'jordansmith', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 12 },
                    { name: 'Taylor Davis', username: 'taylord', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 15 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            @{user.username} · {user.mutual} mutual
                          </p>
                        </div>
                      </div>
                      <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        theme === 'dark'
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}>
                        Follow
                      </button>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-2.5 px-4 mt-3 rounded-xl text-sm font-medium transition-colors ${
                  theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
                }`}>
                  Show more
                </button>
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
