import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Search, Users, Heart, MessageCircle, ThumbsUp, Hand, Smile, Phone, Video, Gift } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NearbyUser {
  id: number;
  name: string;
  age: number;
  distance: string;
  avatar: string;
  isOnline: boolean;
  interests: string[];
}

const NearbyScreen: React.FC = () => {
  const { theme } = useTheme();
  const [nearbyUsers] = useState<NearbyUser[]>([
    {
      id: 1,
      name: 'Alex Rivera',
      age: 26,
      distance: '0.5 km',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: true,
      interests: ['Art', 'Music']
    },
    {
      id: 2,
      name: 'Jordan Kim',
      age: 24,
      distance: '1.2 km',
      avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: false,
      interests: ['Tech', 'Books']
    },
    {
      id: 3,
      name: 'Sam Chen',
      age: 28,
      distance: '2.1 km',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: true,
      interests: ['Yoga', 'Travel']
    },
    {
      id: 4,
      name: 'Casey Morgan',
      age: 25,
      distance: '3.5 km',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: true,
      interests: ['Photography', 'Nature']
    },
    {
      id: 5,
      name: 'Riley Thompson',
      age: 27,
      distance: '4.2 km',
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: false,
      interests: ['Fitness', 'Cooking']
    },
    {
      id: 6,
      name: 'Taylor Davis',
      age: 23,
      distance: '5.8 km',
      avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      isOnline: true,
      interests: ['Music', 'Art']
    }
  ]);

  return (
    <div className={`w-full min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} p-4`}>
      <motion.div 
        className="w-full mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className={`text-3xl font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Nearby People
          </h1>
          <p className={`text-base ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Discover LGBTIQ+ community members around you</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex space-x-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search nearby people..."
              className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-base ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:ring-gray-600'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
              }`}
            />
          </div>
          <motion.button
            className={`px-6 py-4 rounded-2xl transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-900 border border-gray-700 hover:bg-gray-800'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className={`w-6 h-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className={`rounded-3xl p-6 mb-8 shadow-lg border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Users className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`} />
              </div>
              <div>
                <p className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{nearbyUsers.length} people nearby</p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Within 10km radius</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{nearbyUsers.filter(u => u.isOnline).length} online</p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Active now</p>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {nearbyUsers.map((user, index) => (
            <div
              key={user.id}
              className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              {/* Cover Image */}
              <div className="relative h-36">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Online Status */}
                {user.isOnline && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Online</span>
                    </div>
                  </div>
                )}
                
                {/* Distance Badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                    <MapPin className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">{user.distance}</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className={`text-sm font-bold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.name}
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {user.age} years old
                  </p>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {user.interests.slice(0, 2).map((interest, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-200' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Hand className="w-3.5 h-3.5" />, label: 'Touch' },
                    { icon: <Heart className="w-3.5 h-3.5" />, label: 'Like' },
                    { icon: <Smile className="w-3.5 h-3.5" />, label: 'Kiss' },
                    { icon: <Gift className="w-3.5 h-3.5" />, label: 'Gift' },
                    { icon: <MessageCircle className="w-3.5 h-3.5" />, label: 'Message' },
                    { icon: <Users className="w-3.5 h-3.5" />, label: 'Follow' },
                  ].map(({ icon, label }, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.1 }
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        transition: { duration: 0.05 }
                      }}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-sm hover:shadow-md'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {icon}
                      <span className="text-[8px] font-semibold mt-1">{label}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <div className={`text-xs rounded-lg py-1.5 px-2.5 whitespace-nowrap shadow-lg ${
                          theme === 'dark'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-800 text-white'
                        }`}>
                          {label}
                          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent ${
                            theme === 'dark'
                              ? 'border-t-gray-900'
                              : 'border-t-gray-800'
                          }`}></div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            className={`px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More People
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NearbyScreen;