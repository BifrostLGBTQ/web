import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Stories from './Stories';
import CreatePost from './CreatePost';
import Post from './Post';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();

  const stories = [
    { id: 1, name: 'Your Story', avatar: null, cover: null, isOwn: true },
    { id: 2, name: 'Alex', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 3, name: 'Jordan', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 4, name: 'Sam', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 5, name: 'Casey', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
    { id: 6, name: 'Riley', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', cover: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2', hasStory: true },
  ];

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

  return (
    <div className="min-h-screen">
      {/* Ultra Professional Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-12">

        {/* Stories Section - Full Width */}
        <div className="mb-6 sm:mb-8">
          <Stories />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">

              {/* Quick Actions */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-800 backdrop-blur-xl'
                  : 'bg-white/50 border-gray-200 backdrop-blur-xl'
              }`}>
                <h3 className={`font-bold text-lg mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}>
                    🏳️‍🌈 Find Events
                  </button>
                  <button className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}>
                    💬 Join Groups
                  </button>
                  <button className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}>
                    📍 Nearby Places
                  </button>
                </div>
              </div>

              {/* Trending Topics */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-800 backdrop-blur-xl'
                  : 'bg-white/50 border-gray-200 backdrop-blur-xl'
              }`}>
                <h3 className={`font-bold text-lg mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Trending
                </h3>
                <div className="space-y-3">
                  {['#PrideMonth', '#LoveWins', '#BeYourself', '#Community'].map((tag, index) => (
                    <div key={index} className={`p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tag}
                      </span>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {Math.floor(Math.random() * 50) + 10}k posts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            <div className="w-full">
              {/* Create Post */}
              <CreatePost />

              {/* Posts Feed */}
              <div className="space-y-6">
                {samplePosts.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">

              {/* Suggested Connections */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-800 backdrop-blur-xl'
                  : 'bg-white/50 border-gray-200 backdrop-blur-xl'
              }`}>
                <h3 className={`font-bold text-lg mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Suggested Connections
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Casey Morgan', username: 'caseymorgan', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                    { name: 'Riley Thompson', username: 'rileyt', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                    { name: 'Taylor Davis', username: 'taylord', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
                  ].map((person, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className={`font-medium text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {person.name}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            @{person.username}
                          </p>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}>
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-800 backdrop-blur-xl'
                  : 'bg-white/50 border-gray-200 backdrop-blur-xl'
              }`}>
                <h3 className={`font-bold text-lg mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Community Stats
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Active Members
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        12.5K
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Posts Today
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        847
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Events This Week
                      </span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        23
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;