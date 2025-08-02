import React from 'react';
import { Home, Search, Users, MessageCircle, User, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileNavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeScreen, onScreenChange }) => {
  const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: MapPin, label: 'Nearby', id: 'nearby' },
    { icon: Heart, label: 'Match', id: 'match' },
    { icon: MessageCircle, label: 'Messages', id: 'messages' },
    { icon: User, label: 'Profile', id: 'profile' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-emerald-100/50 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
              activeScreen === item.id 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-500 hover:text-emerald-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <item.icon className={`w-5 h-5 ${activeScreen === item.id ? 'scale-110' : ''} transition-transform duration-200`} />
            <span className="text-xs font-medium">{item.label}</span>
            {activeScreen === item.id && (
              <motion.div
                className="w-1 h-1 bg-emerald-600 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNavigation;