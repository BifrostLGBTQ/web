import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Search, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4">
      <motion.div 
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Nearby</span> People
          </h1>
          <p className="text-gray-600 text-sm">Discover LGBTIQ+ community members around you</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex space-x-3 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search nearby..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-300 text-sm"
            />
          </div>
          <motion.button
            className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-emerald-50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{nearbyUsers.length} people nearby</p>
                <p className="text-xs text-gray-500">Within 10km radius</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-600">{nearbyUsers.filter(u => u.isOnline).length} online</p>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {nearbyUsers.map((user, index) => (
            <motion.div
              key={user.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative mb-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-32 object-cover rounded-xl"
                />
                {user.isOnline && (
                  <motion.div 
                    className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-medium">{user.distance}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{user.name}, {user.age}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    {user.interests.slice(0, 2).map((interest, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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