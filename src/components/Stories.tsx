import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Stories: React.FC = () => {
  const { theme } = useTheme();
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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

  return (
    <>
      {/* Stories List */}
      <div className={`rounded-2xl`}>
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 w-32 relative">
              <button
                onClick={() => !story.isOwn && story.hasStory && setSelectedStory(story.id)}
                className="w-full h-[172px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative flex items-end justify-center transition-transform hover:scale-105 cursor-pointer"
              >
                {story.cover ? (
                  <img
                    src={story.cover}
                    alt={story.name}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center absolute inset-0" />
                )}
              </button>

              {/* Avatar */}
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full border-2 ${
                story.hasStory
                  ? 'border-gradient-to-tr from-pink-500 via-red-500 to-yellow-400'
                  : theme === 'dark'
                  ? 'border-gray-700/30'
                  : 'border-gray-200/30'
              } bg-white dark:bg-gray-900 flex items-center justify-center`}>
                {story.isOwn ? (
                  <Plus className={`w-7 h-7 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : story.avatar ? (
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : null}
              </div>

              {/* Name with blur background */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] z-10">
                <div className="backdrop-blur-md bg-black/40 rounded-lg px-2 py-1 flex justify-center">
                  <span className="text-xs text-white font-semibold truncate">{story.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram-Style Story Viewer */}
      <AnimatePresence>
        {selectedStory && selectedStoryData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-[200]"
            />

            {/* Story Viewer */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Previous Story Button */}
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Story Button */}
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Story Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-[414px] h-[90vh] mx-auto"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  {/* Story Image */}
                  {selectedStoryData.cover && (
                    <img
                      src={selectedStoryData.cover}
                      alt={selectedStoryData.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Story Header */}
                  <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                      {selectedStoryData.avatar && (
                        <img
                          src={selectedStoryData.avatar}
                          alt={selectedStoryData.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-white"
                        />
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{selectedStoryData.name}</p>
                        <p className="text-white/70 text-xs">2h</p>
                      </div>
                    </div>
                  </div>

                  {/* Story Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center space-x-8 z-10">
                    <button className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-white text-xs">Like</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-white text-xs">Reply</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <Share className="w-6 h-6" />
                      </div>
                      <span className="text-white text-xs">Share</span>
                    </button>
                  </div>
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