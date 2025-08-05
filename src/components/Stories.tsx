import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Stories: React.FC = () => {
  const { theme } = useTheme();

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

  return (
    <div className={`rounded-2xl  `}>
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 w-32 relative">
            {/* Story Cover */}
            <div className="w-full h-[172px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative flex items-end justify-center">
              {story.cover ? (
                <img
                  src={story.cover}
                  alt={story.name}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center absolute inset-0" />
              )}
              {/* Avatar */}
              <div className={`absolute top-2 left-8 -translate-x-1/2 z-10 w-10 h-10 rounded-full  border-2 ${
                story.hasStory
                  ? 'border-gradient-to-tr from-pink-500 via-red-500 to-yellow-400'
                  : theme === 'dark'
                  ? 'border-gray-700/30'
                  : 'border-gray-200/30'
              } bg-white dark:bg-gray-900 flex items-center justify-center`}>
                {story.isOwn ? (
                  <Plus className={`w-7 h-7 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              {/* Name with blur background */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%]">
                <div className="backdrop-blur-md bg-black/40 rounded-lg px-2 py-1 flex justify-center">
                  <span className="text-xs text-white font-semibold truncate">{story.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;