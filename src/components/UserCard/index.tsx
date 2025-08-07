
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, HeartHandshake, Banana, Carrot, Coffee, Baby, Gift, MessageCircleHeart, UserPlus, Flag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import GiftSelector from '../GiftSelector';
import QuickMessages from '../QuickMessages';

export const UserCard: React.FC<{ user: any }> = ({ user }) => {
  const { theme } = useTheme();
  const [isGiftSelectorOpen, setIsGiftSelectorOpen] = useState(false);
  const [isQuickMessageSelectorOpen, setIsQuickMessageSelectorOpen] = useState(false);

  const handleGiftSelect = (gift: any) => {
    console.log(`Sending ${gift.name} to ${user.name}`);
    // Here you can add your gift sending logic
  };

  const handleQuickMessageSelect = (message:any) => {
        console.log(`Sending ${message.text} to ${user.name}`);

  }

  return(
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
                      { icon: <HeartHandshake className="w-5 h-5" />, label: 'Touch', color: 'text-white/50', action: () => {} },
                      { icon: <Banana className="w-5 h-5" />, label: 'Banana', color: 'text-white/50', action: () => {} },
                      { icon: <Carrot className="w-5 h-5" />, label: 'Carrot', color: 'text-white/50', action: () => {} },
                      { icon: <Coffee className="w-5 h-5" />, label: 'Coffee', color: 'text-white/50', action: () => {} },
                      { icon: <Heart className="w-5 h-5" />, label: 'Like', color: 'text-white/50', action: () => {} },
                      { icon: <Baby className="w-5 h-5" />, label: 'Kiss', color: 'text-white/50', action: () => {} },
                      { icon: <Gift className="w-5 h-5" />, label: 'Gift', color: 'text-white/50', action: () => {
                        console.log('Gift button clicked!');
                        setIsGiftSelectorOpen(true);
                      }},
                      { icon: <MessageCircleHeart className="w-5 h-5" />, label: 'Message', color: 'text-white/50', action: () => {
                            console.log('Message button clicked!');
                        setIsQuickMessageSelectorOpen(true);
                      } },
                      { icon: <UserPlus className="w-5 h-5" />, label: 'Follow', color: 'text-white/50', action: () => {
                      
                      } },
                    ].map(({ icon, label, color, action }, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          action();
                        }}
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

              {/* Gift Selector */}
              <GiftSelector
                isOpen={isGiftSelectorOpen}
                onClose={() => setIsGiftSelectorOpen(false)}
                onSelectGift={handleGiftSelect}
                userName={user.name}
              />

              <QuickMessages onSendMessage={handleQuickMessageSelect}
                isOpen={isQuickMessageSelectorOpen}
                onClose={() => setIsQuickMessageSelectorOpen(false)}
                userName={user.name}
              />
            </div>
  )}