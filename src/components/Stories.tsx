import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Stories: React.FC = () => {
  const { theme } = useTheme();
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stories = [
    { id: 1, name: 'Your Story', avatar: null, cover: null, isOwn: true },
    { id: 2, name: 'Alex', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 3, name: 'Jordan', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 4, name: 'Sam', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 5, name: 'Casey', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 6, name: 'Riley', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 7, name: 'Jordan', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 8, name: 'Sam', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 9, name: 'Casey', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 10, name: 'Riley', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
  ];

  const selectedStoryData = selectedStory ? stories.find(s => s.id === selectedStory) : null;
  const availableStories = stories.filter(s => s.hasStory && !s.isOwn);

  const nextStory = () => {
    if (!selectedStory) return;
    const currentIndex = availableStories.findIndex(s => s.id === selectedStory);
    if (currentIndex < availableStories.length - 1) {
      setSelectedStory(availableStories[currentIndex + 1].id);
    } else {
      setSelectedStory(null);
    }
  };

  const prevStory = () => {
    if (!selectedStory) return;
    const currentIndex = availableStories.findIndex(s => s.id === selectedStory);
    if (currentIndex > 0) {
      setSelectedStory(availableStories[currentIndex - 1].id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowAddStoryModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareStory = () => {
    // Here you would upload the story to your backend
    console.log('Sharing story:', selectedImage);
    setShowAddStoryModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Stories List - Premium Design */}
      <div className="py-1">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-1">
          {stories.map((story) => (
            <motion.div 
              key={story.id} 
              className="flex-shrink-0"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="relative group">
                {/* Story Card Container - Flat Design */}
                <button
                  onClick={() => {
                    if (story.isOwn) {
                      fileInputRef.current?.click();
                    } else if (story.hasStory) {
                      setSelectedStory(story.id);
                    }
                  }}
                  className={`relative w-[120px] h-[180px] rounded-[14px] overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                  } transition-all duration-300 group-hover:scale-[1.02] cursor-pointer`}
                  style={{ transformOrigin: 'center' }}
                >
                    {/* Story Cover Image */}
                    {story.cover ? (
                      <>
                        <img
                          src={story.cover}
                          alt={story.name}
                          className="w-full h-full object-cover absolute inset-0 transition-all duration-300"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                      </>
                    ) : (
                      <div className={`absolute inset-0 w-full h-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                      }`}>
                        {story.isOwn && (
                          <div className={`w-16 h-16 rounded-full ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          } flex items-center justify-center`}>
                            <Plus className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Avatar - Flat Style */}
                    {!story.isOwn && story.avatar && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="w-11 h-11 rounded-full">
                          <img
                            src={story.avatar}
                            alt={story.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Name Label - Flat Design */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <div className={`backdrop-blur-xl ${
                        theme === 'dark' ? 'bg-black/60' : 'bg-white/80'
                      } rounded-lg px-2.5 py-1.5`}>
                        <p className={`text-[13px] font-semibold tracking-[-0.006em] truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {story.name}
                        </p>
                      </div>
                    </div>

                    {/* Add Story Icon for Own Story */}
                    {story.isOwn && !story.cover && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className={`w-11 h-11 rounded-full ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                        } flex items-center justify-center`}>
                          <Plus className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        </div>
                      </div>
                    )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Story Viewer */}
      <AnimatePresence>
        {selectedStory && selectedStoryData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[200]"
            />

            {/* Story Viewer Container */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
              {/* Close Button - Flat */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Navigation Buttons - Flat */}
              {availableStories.findIndex(s => s.id === selectedStory) > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStory}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 z-20"
                >
                  <ChevronLeft className="w-7 h-7" />
                </motion.button>
              )}

              {availableStories.findIndex(s => s.id === selectedStory) < availableStories.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStory}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 z-20"
                >
                  <ChevronRight className="w-7 h-7" />
                </motion.button>
              )}

              {/* Story Content - Premium Card */}
              <motion.div
                key={selectedStory}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[420px] h-[92vh] mx-auto"
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  {/* Story Image */}
                  {selectedStoryData.cover && (
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                      src={selectedStoryData.cover}
                      alt={selectedStoryData.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Premium Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                  {/* Progress Bars */}
                  <div className="absolute top-0 left-0 right-0 p-3 z-10 flex gap-1">
                    {availableStories.map((story, index) => (
                      <div
                        key={story.id}
                        className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ width: availableStories.findIndex(s => s.id === selectedStory) > index ? '100%' : '0%' }}
                          animate={{ 
                            width: story.id === selectedStory ? '100%' : 
                                  availableStories.findIndex(s => s.id === selectedStory) > index ? '100%' : '0%'
                          }}
                          transition={{ duration: story.id === selectedStory ? 5 : 0.3 }}
                          className="h-full bg-white rounded-full shadow-lg"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Story Header - Flat */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-12 left-0 right-0 px-4 z-10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedStoryData.avatar && (
                          <div className="w-11 h-11 rounded-full">
                            <img
                              src={selectedStoryData.avatar}
                              alt={selectedStoryData.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-[15px] tracking-[-0.011em] drop-shadow-lg">
                            {selectedStoryData.name}
                          </p>
                          <p className="text-white/80 text-[13px] font-medium drop-shadow-lg">2h ago</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Story Actions - Flat */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-6 left-0 right-0 px-6 z-10"
                  >
                    <div className="flex items-center justify-center gap-6">
                      <motion.button 
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/25">
                          <Heart className="w-6 h-6" />
                        </div>
                        <span className="text-white text-[13px] font-semibold drop-shadow-lg">Like</span>
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/25">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-white text-[13px] font-semibold drop-shadow-lg">Reply</span>
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-300 hover:bg-white/25">
                          <Share className="w-6 h-6" />
                        </div>
                        <span className="text-white text-[13px] font-semibold drop-shadow-lg">Share</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Add Story Modal */}
      <AnimatePresence>
        {showAddStoryModal && selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full max-w-[420px] rounded-3xl overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900/95 to-gray-900/60 backdrop-blur-xl' 
                    : 'bg-gradient-to-br from-white/95 to-gray-50/60 backdrop-blur-xl'
                }`}
              >
                {/* Close Button */}
                <motion.button
                  onClick={() => {
                    setShowAddStoryModal(false);
                    setSelectedImage(null);
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-5 right-5 z-20 w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-black/10 hover:bg-black/20 text-gray-900'
                  }`}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Header */}
                <div className={`px-6 py-5 ${
                  theme === 'dark' ? 'border-b border-white/5' : 'border-b border-black/5'
                }`}>
                  <h3 className={`text-xl font-bold tracking-[-0.022em] ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Create Story
                  </h3>
                  <p className={`text-[13px] mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Share a moment with your friends
                  </p>
                </div>

                {/* Image Preview */}
                <div className={`relative w-full h-[500px] ${
                  theme === 'dark' ? 'bg-black/40' : 'bg-gray-900'
                }`}>
                  <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedImage}
                    alt="Story preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Action Buttons */}
                <div className={`p-5 flex gap-3 backdrop-blur-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-900/40 border-t border-white/5' 
                    : 'bg-white/40 border-t border-black/5'
                }`}>
                  <motion.button
                    onClick={handleShareStory}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-5 py-3.5 rounded-2xl font-bold text-[15px] tracking-[-0.011em] shadow-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-900'
                    }`}
                  >
                    Share Story
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowAddStoryModal(false);
                      setSelectedImage(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-5 py-3.5 rounded-2xl font-bold text-[15px] tracking-[-0.011em] transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-black/10 hover:bg-black/20 text-gray-900'
                    }`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Stories;