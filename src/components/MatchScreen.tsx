import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
  interests: string[];
  occupation?: string;
  education?: string;
  distance: string;
}

const MatchScreen: React.FC = () => {
  const { theme } = useTheme();
  const [profiles] = useState<Profile[]>([
    {
      id: 1,
      name: 'Alex Rivera',
      age: 26,
      location: 'Downtown, New Jersey',
      bio: 'Artist & activist. Love hiking, coffee, and meaningful conversations. Looking for genuine connections. 🏳️‍🌈✨',
      images: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
        'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2'
      ],
      interests: ['Art', 'Hiking', 'Photography', 'Activism'],
      occupation: 'Graphic Designer',
      education: 'Art Institute',
      distance: '2 km away'
    },
    {
      id: 2,
      name: 'Jordan Kim',
      age: 24,
      location: 'Brooklyn, New York',
      bio: 'Software engineer by day, musician by night. Love indie music, good books, and exploring the city. 🎵📚',
      images: [
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2'
      ],
      interests: ['Music', 'Technology', 'Books', 'Coffee'],
      occupation: 'Software Engineer',
      education: 'MIT',
      distance: '5 km away'
    },
    {
      id: 3,
      name: 'Sam Chen',
      age: 28,
      location: 'Manhattan, New York',
      bio: 'Yoga instructor and wellness coach. Passionate about mental health, sustainability, and creating safe spaces. 🧘‍♀️🌱',
      images: [
        'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
        'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2'
      ],
      interests: ['Yoga', 'Wellness', 'Sustainability', 'Meditation'],
      occupation: 'Yoga Instructor',
      education: 'Wellness Institute',
      distance: '3 km away'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchPercentage] = useState(96);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} p-4`}>
      <motion.div 
        className="max-w-sm mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Find Your Match
          </h1>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Discover meaningful connections</p>
        </motion.div>

        {/* Card Stack */}
        <div className="relative h-[600px] mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              className={`absolute inset-0 rounded-3xl shadow-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.02, rotate: 2 }}
            >
              {/* Profile Image */}
              <div className="relative h-96 overflow-hidden">
                <motion.img
                  src={currentProfile.images[0]}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Match Percentage */}
                <motion.div 
                  className={`absolute top-4 right-4 backdrop-blur-sm rounded-full px-3 py-1 ${
                    theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'
                  }`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
                >
                  <span className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{matchPercentage}%</span>
                </motion.div>

                {/* Basic Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <motion.h2 
                    className="text-2xl font-bold mb-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {currentProfile.name}, {currentProfile.age}
                  </motion.h2>
                  <motion.div 
                    className="flex items-center text-white/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{currentProfile.location}</span>
                  </motion.div>
                </div>
              </div>

              {/* Profile Details */}
              <motion.div 
                className="p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{currentProfile.bio}</p>
                
                {/* Additional Info */}
                <div className="space-y-2">
                  {currentProfile.occupation && (
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Briefcase className={`w-4 h-4 mr-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`} />
                      <span className="text-sm">{currentProfile.occupation}</span>
                    </div>
                  )}
                  {currentProfile.education && (
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <GraduationCap className={`w-4 h-4 mr-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`} />
                      <span className="text-sm">{currentProfile.education}</span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <motion.span
                      key={interest}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}>
                    <MessageCircle className="w-3 h-3" />
                    <span className="text-xs">Message</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center items-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
          >
            <X className="w-6 h-6 text-red-500" />
          </motion.button>

          <motion.button
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center border-2 ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="w-5 h-5 text-yellow-500" />
          </motion.button>

          <motion.button
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
          >
            <Heart className="w-6 h-6" fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* Distance Info */}
        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>{currentProfile.distance}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MatchScreen;