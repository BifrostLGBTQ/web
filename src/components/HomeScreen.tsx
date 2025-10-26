import React from 'react';
import { Plus, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Sparkles, TrendingUp, Users, ChevronRight } from 'lucide-react';
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Ultra Professional Layout - Award Winning */}
        <div className="flex justify-center gap-0">
          
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-[290px] pt-6 pr-4">
            <div className="sticky top-20 space-y-5">
              
              {/* Profile Card - Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-200'}`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'bg-green-500 border-black' : 'bg-green-500 border-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Alex Rivera
                    </h3>
                    <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      @alexr_pride
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-900">
                  <div className="text-center">
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>248</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Following</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>12.5K</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Followers</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>847</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Posts</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`rounded-2xl p-5 ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-200'}`}
              >
                <h2 className={`font-bold text-base mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h2>
                
                <div className="space-y-1.5">
                  {[
                    { icon: Sparkles, label: 'Create Post' },
                    { icon: Users, label: 'Find Friends' },
                    { icon: TrendingUp, label: 'Trending Now' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${
                          theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white bg-opacity-5' : 'bg-gray-200'}`}>
                          <Icon className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

            </div>
          </aside>

          {/* Center Feed - Main Content */}
          <main className={`flex-1 max-w-[598px] min-w-0 ${theme === 'dark' ? 'border-l border-r border-black' : 'border-l border-r border-gray-200'}`}>
            
            {/* Stories Section */}
            <div className={`border-b ${theme === 'dark' ? 'border-black bg-black' : 'border-gray-200 bg-white'}`}>
              <Stories />
            </div>

            {/* Create Post */}
            <div className={`border-b ${theme === 'dark' ? 'border-black bg-black' : 'border-gray-200 bg-white'}`}>
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
                  className={`border-b ${theme === 'dark' ? 'border-black' : 'border-gray-200'} transition-colors ${
                    theme === 'dark' ? 'hover:bg-white hover:bg-opacity-[0.01]' : 'hover:bg-gray-50'
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

          </main>

          {/* Right Sidebar - Trending & Suggestions */}
          <aside className="hidden lg:block w-[340px] pt-6 pl-4">
            <div className="sticky top-20 space-y-5">
              
              {/* Trending Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-200'}`}
              >
                <div className="p-5">
                  <h2 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    What's Happening
                  </h2>
                  
                  <div className="space-y-0">
                    {trends.map((trend, index) => (
                      <div
                        key={index}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5' : 'hover:bg-gray-100'
                        } ${index !== 0 ? 'border-t ' + (theme === 'dark' ? 'border-gray-900' : 'border-gray-200') : ''}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {trend.category}
                          </p>
                          <button className={`p-1 rounded-full transition-colors ${
                            theme === 'dark' ? 'hover:bg-white hover:bg-opacity-10' : 'hover:bg-gray-200'
                          }`}>
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-start justify-between">
                          <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {trend.trending && <Sparkles className="inline w-3 h-3 mr-1" />}
                            {trend.tag}
                          </p>
                        </div>
                        <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {trend.posts} posts
                        </p>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full py-2.5 px-4 mt-3 rounded-xl text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5 text-blue-500' : 'hover:bg-gray-100 text-blue-600'
                  }`}>
                    Show more
                  </button>
                </div>
              </motion.div>

              {/* Who to Follow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-950 border border-gray-900' : 'bg-gray-50 border border-gray-200'}`}
              >
                <div className="p-5">
                  <h2 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Who to Follow
                  </h2>
                  
                  <div className="space-y-3">
                    {suggestedUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {user.name}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              @{user.username} · {user.mutual} mutual
                            </p>
                          </div>
                        </div>
                        <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          theme === 'dark'
                            ? 'bg-white text-black hover:bg-gray-200'
                            : 'bg-black text-white hover:bg-gray-900'
                        }`}>
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full py-2.5 px-4 mt-3 rounded-xl text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'hover:bg-white hover:bg-opacity-5 text-blue-500' : 'hover:bg-gray-100 text-blue-600'
                  }`}>
                    Show more
                  </button>
                </div>
              </motion.div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default HomeScreen;