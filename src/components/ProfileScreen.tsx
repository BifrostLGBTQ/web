import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Edit3, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Users, 
  Calendar,
  Camera,
  Shield,
  Star
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('about');

  const profileData = {
    name: 'Alex Rivera',
    age: 26,
    location: 'Downtown, New Jersey',
    bio: 'Artist & activist passionate about creating inclusive spaces. Love hiking, coffee, and meaningful conversations. Looking for genuine connections in the LGBTIQ+ community. 🏳️‍🌈✨',
    occupation: 'Graphic Designer',
    education: 'Art Institute of Chicago',
    interests: ['Art', 'Hiking', 'Photography', 'Activism', 'Coffee', 'Travel', 'Music', 'Reading'],
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2'
    ],
    stats: {
      matches: 127,
      likes: 89,
      visits: 234
    }
  };

  const tabs = [
    { id: 'about', label: 'About', icon: Heart },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'interests', label: 'Interests', icon: Star }
  ];

  return (
    <div className={`max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <motion.div 
        className={`max-w-2xl mx-auto min-h-screen ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="relative h-80 rounded-lg overflow-hidden"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={profileData.photos[0]}
            alt="Profile"
            className="w-full h-full  object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Header Actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <motion.button
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-6 left-4 right-4 text-white">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {profileData.name}, {profileData.age}
            </motion.h1>
            <motion.div 
              className="flex items-center text-white/90 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{profileData.location}</span>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.stats.matches}</p>
                <p className="text-xs text-white/80">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.stats.likes}</p>
                <p className="text-xs text-white/80">Likes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profileData.stats.visits}</p>
                <p className="text-xs text-white/80">Profile Views</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className={`flex border-b ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 transition-all duration-300 ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-900 border-b-2 border-gray-900'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Bio */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>About Me</h3>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{profileData.bio}</p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <Briefcase className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{profileData.occupation}</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Occupation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <GraduationCap className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{profileData.education}</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Education</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-3">
                {profileData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'interests' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-3">
                {profileData.interests.map((interest, index) => (
                  <motion.span
                    key={interest}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 border-gray-700'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 15 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="p-6 pt-0 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.button
            className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Edit Profile
          </motion.button>
          
          <div className="flex space-x-3">
            <motion.button
              className={`flex-1 py-3 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </motion.button>
            
            <motion.button
              className={`flex-1 py-3 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;