import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Stories from './components/Stories';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import MobileNavigation from './components/MobileNavigation';
import MatchScreen from './components/MatchScreen';
import NearbyScreen from './components/NearbyScreen';
import ProfileScreen from './components/ProfileScreen';
import SearchScreen from './components/SearchScreen';
import MessagesScreen from './components/MessagesScreen';
import { useTheme } from './contexts/ThemeContext';
import { Home, Search, MapPin, Heart, MessageCircle, User, Map, Building2 } from 'lucide-react';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const { theme } = useTheme();

  const samplePosts = [
    {
      id: 1,
      author: {
        name: 'Alex Rivera',
        username: 'alexr_pride',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: true,
      },
      content: {
        text: 'Just finished volunteering at the local Pride center today! It\'s amazing to see so many people coming together to build a supportive community. Remember, you are loved, you are valid, and you belong here. 🏳️‍🌈💖 #Pride #Community #Love',
        image: 'https://images.pexels.com/photos/1601131/pexels-photo-1601131.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      },
      engagement: {
        likes: 248,
        comments: 32,
        shares: 18,
      },
      timestamp: '2h',
    },
    {
      id: 2,
      author: {
        name: 'Jordan Kim',
        username: 'jordankim',
        avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: false,
      },
      content: {
        text: 'Celebrating my 6-month anniversary with my amazing partner today! Feeling grateful for all the love and support from this incredible community. Love is love! 💕✨',
      },
      engagement: {
        likes: 156,
        comments: 28,
        shares: 12,
      },
      timestamp: '4h',
    },
    {
      id: 3,
      author: {
        name: 'Sam Chen',
        username: 'samchen_artist',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: true,
      },
      content: {
        text: 'New art piece completed! This one is dedicated to all the brave individuals who paved the way for our rights and freedoms. Art has always been a powerful form of expression and activism. 🎨🏳️‍⚧️',
        image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      },
      engagement: {
        likes: 392,
        comments: 45,
        shares: 67,
      },
      timestamp: '6h',
    },
  ];

  const navigationItems = [
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
        return (
          <div className={`min-h-screen flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-black' 
              : 'bg-gray-50'
          }`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8"
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <Building2 className="w-12 h-12 text-gray-500" />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Places</h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Discover amazing places</p>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>Coming soon...</p>
            </motion.div>
          </div>
        );
      case 'messages':
        return <MessagesScreen />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pb-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        
              {/* Main Content */}
              <div className="flex-1 max-w-none lg:max-w-3xl xl:max-w-4xl">
                <Stories />
                <CreatePost />
                
                {/* Posts Feed */}
                <div className="space-y-4 sm:space-y-6">
                  {samplePosts.map((post) => (
                    <Post key={post.id} {...post} />
                  ))}
                </div>
              </div>
              
              {/* Right Sidebar - Hidden on mobile and tablet */}
              <div className="hidden xl:block w-80 flex-shrink-0">
                <div className="sticky top-28 space-y-6">
                  {/* Suggested Connections */}
                  <div className={`rounded-2xl shadow-sm border p-4 ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-800' 
                      : 'bg-white border-gray-100'
                  }`}>
                    <h2 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Suggested Connections</h2>
                    <div className="space-y-3">
                      {[
                        { name: 'Casey Morgan', username: 'caseymorgan', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                        { name: 'Riley Thompson', username: 'rileyt', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                        { name: 'Taylor Davis', username: 'taylord', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                      ].map((person, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{person.name}</h3>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>@{person.username}</p>
                            </div>
                          </div>
                          <button className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-white hover:bg-gray-700'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}>
                            Follow
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className={`rounded-2xl shadow-sm border p-4 ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-800' 
                      : 'bg-white border-gray-100'
                  }`}>
                    <h2 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Upcoming Events</h2>
                    <div className="space-y-4">
                      {[
                        { title: 'Pride Parade 2025', date: 'Jun 15', time: '10:00 AM', color: 'bg-gray-600' },
                        { title: 'Trans Rights Rally', date: 'Mar 31', time: '2:00 PM', color: 'bg-gray-600' },
                        { title: 'Queer Film Festival', date: 'Apr 12', time: '7:00 PM', color: 'bg-gray-600' },
                      ].map((event, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-800' 
                            : 'hover:bg-gray-50'
                        }`}>
                          <div className={`w-10 h-10 rounded-lg ${event.color} flex items-center justify-center text-white font-bold text-sm`}>
                            {event.date.split(' ')[1]}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{event.title}</h3>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{event.date} at {event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header - Show on all screens */}
      <Header />
      
      {/* Ultra Professional Navigation - Fixed Sticky */}
      <div className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-xl ${
        theme === 'dark' 
          ? 'border-gray-800 bg-gray-900/95' 
          : 'border-gray-200 bg-white/95'
      }`} style={{ top: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between lg:justify-start lg:space-x-6 overflow-x-auto scrollbar-hide py-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center space-x-2.5 py-2.5 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? theme === 'dark'
                        ? 'text-white bg-gray-800 shadow-lg'
                        : 'text-white bg-gray-900 shadow-lg'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -1,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className={`relative transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <Icon className={`w-4 h-4 transition-all duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : theme === 'dark' 
                          ? 'text-gray-400 group-hover:text-white' 
                          : 'text-gray-600 group-hover:text-gray-900'
                    }`} />
                  </div>
                  <span className={`font-semibold text-sm tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : theme === 'dark' 
                        ? 'text-gray-400 group-hover:text-white' 
                        : 'text-gray-600 group-hover:text-gray-900'
                  }`}>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-20">
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
      
      <MobileNavigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      
      {/* Footer - Only show on home screen */}
      {activeScreen === 'home' && <Footer />}
    </motion.div>
  );
}

export default App;