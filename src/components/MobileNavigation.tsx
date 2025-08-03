import React from 'react';
import { Home, Search, Users, MessageCircle, User, MapPin, Heart, Plus, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface MobileNavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeScreen, onScreenChange }) => {
  const { theme } = useTheme();
  
  const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Search, label: 'Search', id: 'search' },
    { icon: MapPin, label: 'Nearby', id: 'nearby' },
    { icon: Heart, label: 'Match', id: 'match' },
    { icon: Building2, label: 'Places', id: 'places' },
    { icon: MessageCircle, label: 'Messages', id: 'messages' },
    { icon: User, label: 'Profile', id: 'profile' },
  ];

  return (
    <>
      {/* Ultra Professional Mobile Navigation */}
      <motion.div 
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t backdrop-blur-xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-black/95 border-gray-800' 
            : 'bg-white/95 border-gray-200'
        }`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <motion.button
                key={index}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center space-y-1.5 p-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? theme === 'dark'
                      ? 'text-white bg-gray-800 shadow-lg' 
                      : 'text-white bg-gray-900 shadow-lg'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -1,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {/* Icon Container with Enhanced Effects */}
                <div className={`relative transition-all duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : theme === 'dark' 
                        ? 'text-gray-400 group-hover:text-white' 
                        : 'text-gray-500 group-hover:text-gray-900'
                  }`} />
                </div>
                
                {/* Label with Enhanced Typography */}
                <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : theme === 'dark' 
                      ? 'text-gray-400 group-hover:text-white' 
                      : 'text-gray-500 group-hover:text-gray-900'
                }`}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Professional Floating Action Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-50 lg:hidden"
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          whileHover={{ 
            scale: 1.1, 
            y: -2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Bottom Safe Area for iOS */}
      <div className="h-6 lg:hidden"></div>
    </>
  );
};

export default MobileNavigation;