import React, { useState } from 'react';
import { Plus, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Sparkles, TrendingUp, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import Stories from './Stories';
import CreatePost from './CreatePost';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();

  const samplePosts = [
    {
      id: 1,
      author: {
        name: 'Alex Rivera',
        username: 'alexr_pride',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: true,
      },
      content: {
        text: 'Just finished volunteering at the local Pride center today! It\'s amazing to see so many people coming together to build a supportive community. Remember, you are loved, you are valid, and you belong here. 🏳️‍🌈💖 #Pride #Community #Love',
        image: 'https://images.pexels.com/photos/1601131/pexels-photo-1601131.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      },
      engagement: {
        likes: 248,
        comments: 32,
        shares: 18,
      },
      timestamp: '2h',
    },
    {
      id: 2,
      author: {
        name: 'Jordan Kim',
        username: 'jordankim',
        avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: false,
      },
      content: {
        text: 'Celebrating my 6-month anniversary with my amazing partner today! Feeling grateful for all the love and support from this incredible community. Love is love! 💕✨',
      },
      engagement: {
        likes: 156,
        comments: 28,
        shares: 12,
      },
      timestamp: '4h',
    },
    {
      id: 3,
      author: {
        name: 'Sam Chen',
        username: 'samchen_artist',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: true,
      },
      content: {
        text: 'New art piece completed! This one is dedicated to all the brave individuals who paved the way for our rights and freedoms. Art has always been a powerful form of expression and activism. 🎨🏳️‍⚧️',
        image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      },
      engagement: {
        likes: 392,
        comments: 45,
        shares: 67,
      },
      timestamp: '6h',
    },
  ];

  const trends = [
    { category: 'Trending in LGBTQ+', tag: 'PrideMonth', posts: '52.3K', trending: true },
    { category: 'Trending', tag: 'LoveWins', posts: '34.1K', trending: false },
    { category: 'Culture', tag: 'BeYourself', posts: '28.7K', trending: false },
    { category: 'Community', tag: 'CommunitySupport', posts: '19.4K', trending: false },
  ];

  const suggestedUsers = [
    { name: 'Casey Morgan', username: 'caseymorgan', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 12 },
    { name: 'Riley Thompson', username: 'rileyt', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 8 },
    { name: 'Taylor Davis', username: 'taylord', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', mutual: 15 },
  ];

  const [activeTab, setActiveTab] = useState('foryou');
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const selectedPostData = selectedPost ? samplePosts.find(p => p.id === selectedPost) : null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      
      {/* Stories Above Tabs */}
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-black' : 'border-gray-100'}  p-4`}>
        <Stories />
      </div>

      {/* Header - Show Post Detail or Tabs */}
      <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-black' : 'border-gray-100'}`}>
        {selectedPost ? (
          // Post Detail Header
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setSelectedPost(null)}
              className={`p-2 rounded-full transition-all duration-200 mr-3 ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <div>
              <h2 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Post
              </h2>
            </div>
          </div>
        ) : (
          // Tab Navigation
          <div className="flex relative">
            <motion.button
              onClick={() => setActiveTab('foryou')}
              whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              whileTap={{ scale: 0.99 }}
              className={`flex-1 py-4 font-semibold text-[15px] relative transition-all duration-200 ${
                activeTab === 'foryou'
                  ? theme === 'dark' ? 'text-white' : 'text-black'
                  : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="relative z-10">For You</span>
              {activeTab === 'foryou' && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('following')}
              whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              whileTap={{ scale: 0.99 }}
              className={`flex-1 py-4 font-semibold text-[15px] relative transition-all duration-200 ${
                activeTab === 'following'
                  ? theme === 'dark' ? 'text-white' : 'text-black'
                  : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="relative z-10">Following</span>
              {activeTab === 'following' && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        )}
      </div>

      <div className="max-w-[1380px] mx-auto">
        
 
      <main className={`flex-1 w-full min-w-0 ${theme === 'dark' ? 'border-x border-black' : 'border-x border-gray-100'}`}>
        {selectedPost ? (
          // Post Detail View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
          >
            {selectedPostData && (
              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={selectedPostData.author.avatar}
                    alt={selectedPostData.author.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <h3 className={`font-bold text-[16px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedPostData.author.name}
                      </h3>
                      {selectedPostData.author.verified && (
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 2.96 8.6 1.54 6.71 4.72l-3.61.82.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21.04l3.4 1.42 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10.29 4.8l-4.5-4.31 1.39-1.32 3.11 2.97 5.98-6.03 1.39 1.37-7.37 7.32z"/>
                        </svg>
                      )}
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        @{selectedPostData.author.username}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`}>·</span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {selectedPostData.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className={`text-[16px] leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {selectedPostData.content.text}
                </p>

                {/* Post Image */}
                {selectedPostData.content.image && (
                  <div className="mb-6 rounded-2xl overflow-hidden">
                    <img
                      src={selectedPostData.content.image}
                      alt="Post"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Engagement Bar */}
                <div className="border-t border-b py-4 my-4" style={theme === 'dark' ? { borderColor: '#1a1a1a' } : { borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-around">
                    
                    {/* Comment */}
                    <button className={`flex items-center space-x-2 group transition-colors ${
                      theme === 'dark' ? 'text-gray-500 hover:text-blue-500' : 'text-gray-500 hover:text-blue-600'
                    }`}>
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{selectedPostData.engagement.comments}</span>
                    </button>

                    {/* Share */}
                    <button className={`flex items-center space-x-2 group transition-colors ${
                      theme === 'dark' ? 'text-gray-500 hover:text-green-500' : 'text-gray-500 hover:text-green-600'
                    }`}>
                      <Share className="w-5 h-5" />
                      <span className="text-sm font-medium">{selectedPostData.engagement.shares}</span>
                    </button>

                    {/* Like */}
                    <button className={`flex items-center space-x-2 group transition-colors ${
                      theme === 'dark' ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-red-600'
                    }`}>
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{selectedPostData.engagement.likes}</span>
                    </button>

                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Posts Feed
          <>
            {/* Create Post */}
            <div className={`${theme === 'dark' ? 'bg-black border-b border-black' : 'bg-white border-b border-gray-100'}`}>
              <CreatePost />
            </div>

            {/* Posts Feed */}
            <div>
              {samplePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPost(post.id)}
                  whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                  whileTap={{ scale: 0.999 }}
                  className={`border-b ${theme === 'dark' ? 'border-black' : 'border-gray-100'} transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-black' : 'bg-white'
                  }`}
                >
                  <div className="p-4">
                    
                    {/* Post Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <h3 className={`font-bold text-[15px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {post.author.name}
                          </h3>
                          {post.author.verified && (
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 2.96 8.6 1.54 6.71 4.72l-3.61.82.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21.04l3.4 1.42 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10.29 4.8l-4.5-4.31 1.39-1.32 3.11 2.97 5.98-6.03 1.39 1.37-7.37 7.32z"/>
                            </svg>
                          )}
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            @{post.author.username}
                          </span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`}>·</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {post.timestamp}
                          </span>
                        </div>
                        <p className={`text-[15px] leading-relaxed ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {post.content.text}
                        </p>
                      </div>
                      <button className={`p-1.5 rounded-full transition-colors flex-shrink-0 ml-1 ${
                        theme === 'dark' ? 'hover:bg-white hover:bg-opacity-10 text-gray-500' : 'hover:bg-gray-100 text-gray-500'
                      }`}>
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Image */}
                    {post.content.image && (
                      <div className="my-3 rounded-2xl overflow-hidden">
                        <img
                          src={post.content.image}
                          alt="Post"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {/* Engagement Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-0">
                        
                        {/* Comment */}
                        <button className={`flex items-center space-x-2 group transition-colors p-2 -ml-2 rounded-full ${
                          theme === 'dark' ? 'text-gray-500 hover:text-blue-500' : 'text-gray-500 hover:text-blue-600'
                        }`}>
                          <div className={`p-1.5 rounded-full transition-colors ${
                            theme === 'dark' ? 'group-hover:bg-blue-500 group-hover:bg-opacity-10' : 'group-hover:bg-blue-500 group-hover:bg-opacity-10'
                          }`}>
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">{post.engagement.comments}</span>
                        </button>

                        {/* Retweet/Share */}
                        <button className={`flex items-center space-x-2 group transition-colors p-2 rounded-full ${
                          theme === 'dark' ? 'text-gray-500 hover:text-green-500' : 'text-gray-500 hover:text-green-600'
                        }`}>
                          <div className={`p-1.5 rounded-full transition-colors ${
                            theme === 'dark' ? 'group-hover:bg-green-500 group-hover:bg-opacity-10' : 'group-hover:bg-green-500 group-hover:bg-opacity-10'
                          }`}>
                            <Share className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">{post.engagement.shares}</span>
                        </button>

                        {/* Like */}
                        <button className={`flex items-center space-x-2 group transition-colors p-2 rounded-full ${
                          theme === 'dark' ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-red-600'
                        }`}>
                          <div className={`p-1.5 rounded-full transition-colors ${
                            theme === 'dark' ? 'group-hover:bg-red-500 group-hover:bg-opacity-10' : 'group-hover:bg-red-500 group-hover:bg-opacity-10'
                          }`}>
                            <Heart className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">{post.engagement.likes}</span>
                        </button>

                      </div>
                      
                      {/* Save */}
                      <button className={`p-2 rounded-full transition-colors ${
                        theme === 'dark' ? 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-500 hover:bg-opacity-10' : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-500 hover:bg-opacity-10'
                      }`}>
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
};

export default HomeScreen;