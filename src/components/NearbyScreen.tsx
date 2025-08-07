import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Search, Users, Heart, MessageCircle, ThumbsUp, Hand, Smile, Phone, Video, Gift, Flag, HandHeart, Baby, HeartHandshake, MessageCircleHeart, Banana, Carrot, Coffee, UserPlus } from 'lucide-react';
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
    },
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
    },
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {nearbyUsers.map((user, index) => (
            <div
              key={user.id}
              className={` select-none relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              {/* Cover Image */}
              <div className="relative min-h-[512px]">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full  min-h-[512px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Online Status */}
                {user.isOnline && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">Online</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/20"
                    >
                      <Flag className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                )}
                
                {/* Report Button (when not online) */}
                {!user.isOnline && (
                  <div className="absolute top-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center transition-all duration-200 cursor-pointer border border-white/20"
                    >
                      <Flag className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                )}
                
                {/* Distance Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{user.distance}</span>
                  </div>
                </div>

                {/* User Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {user.age} years old
                    </p>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {user.interests.slice(0, 2).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute flex flex-col gap-2 right-3  -top-[280px]  itens-end justify-center gap-2 mt-2">
                    {[
                      { icon: <HeartHandshake className="w-5 h-5" />, label: 'Touch', color: 'text-white/50' },
                      { icon: <Banana className="w-5 h-5" />, label: 'Banana', color: 'text-white/50' },
                      { icon: <Carrot className="w-5 h-5" />, label: 'Carrot', color: 'text-white/50' },
                      { icon: <Coffee className="w-5 h-5" />, label: 'Coffee', color: 'text-white/50' },
                      { icon: <Heart className="w-5 h-5" />, label: 'Like', color: 'text-white/50' },
                      { icon: <Baby className="w-5 h-5" />, label: 'Kiss', color: 'text-white/50' },
                      { icon: <Gift className="w-5 h-5" />, label: 'Gift', color: 'text-white/50' },
                      { icon: <MessageCircleHeart className="w-5 h-5" />, label: 'Message', color: 'text-white/50' },
                      { icon: <UserPlus className="w-5 h-5" />, label: 'Follow', color: 'text-white/50' },
                    ].map(({ icon, label, color }, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className="group relative flex items-center justify-center min-w-10 max-w-10 w-10 h-10 min-h-10 max-h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/30 text-white shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer border border-white/30 hover:bg-white/30"
                      >
                        <div className={`${color} group-hover:text-white`}>{icon}</div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-3 whitespace-nowrap shadow-lg border border-white/20">
                            {label}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-black/90"></div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
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