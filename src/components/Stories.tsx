import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Stories: React.FC = () => {
  const { theme } = useTheme();
  
  const stories = [
    { id: 1, name: 'Your Story', avatar: null, isOwn: true },
    { id: 2, name: 'Alex', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', hasStory: true },
    { id: 3, name: 'Jordan', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', hasStory: true },
    { id: 4, name: 'Sam', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', hasStory: true },
    { id: 5, name: 'Casey', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', hasStory: true },
    { id: 6, name: 'Riley', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', hasStory: true },
  ];

  return (
    <div className={`rounded-2xl shadow-sm border p-4 mb-6 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 text-center">
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${
              story.hasStory ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500' : 
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              {story.isOwn ? (
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Plus className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              ) : (
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover bg-white p-0.5"
                />
              )}
            </div>
            <p className={`text-xs mt-2 truncate w-16 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>{story.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;