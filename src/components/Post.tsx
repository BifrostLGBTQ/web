import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PostProps {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: {
    text: string;
    image?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
}

const Post: React.FC<PostProps> = ({ author, content, engagement, timestamp }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl shadow-sm border mb-6 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{author.name}</h3>
              {author.verified && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>@{author.username} · {timestamp}</p>
          </div>
        </div>
        <button className={`p-2 rounded-full transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-gray-800' 
            : 'hover:bg-gray-100'
        }`}>
          <MoreHorizontal className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className={`leading-relaxed mb-3 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>{content.text}</p>
      </div>

      {/* Post Image */}
      {content.image && (
        <div className="px-4 pb-3">
          <img
            src={content.image}
            alt="Post content"
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Engagement Bar */}
      <div className={`px-4 py-3 border-t ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 
                theme === 'dark' ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{engagement.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className={`flex items-center space-x-2 transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
            }`}>
              <MessageCircle className="w-5 h-5" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{engagement.comments}</span>
            </button>
            <button className={`flex items-center space-x-2 transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
            }`}>
              <Share className="w-5 h-5" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{engagement.shares}</span>
            </button>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${
              isBookmarked ? 'text-yellow-500' : 
              theme === 'dark' ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;