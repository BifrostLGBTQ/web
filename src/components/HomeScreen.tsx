import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import Stories from './Stories';
import CreatePost from './CreatePost';
import Post from './Post';
import { api } from '../services/api';

// Import the ApiPost interface from Post component
interface ApiPost {
  id: string;
  public_id: number;
  author_id: string;
  type: string;
  content: {
    en: string;
  };
  published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author: {
    id: string;
    public_id: number;
    username: string;
    displayname: string;
    email: string;
    date_of_birth: string;
    gender: string;
    sexual_orientation: {
      id: string;
      key: string;
      order: number;
    };
    sex_role: string;
    relationship_status: string;
    user_role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    default_language: string;
    languages: unknown;
    fantasies: unknown[];
    travel: unknown;
    social: unknown;
    deleted_at: string | null;
  };
  attachments: Array<{
    id: string;
    file_id: string;
    owner_id: string;
    owner_type: string;
    role: string;
    is_public: boolean;
    file: {
      id: string;
      url: string;
      storage_path: string;
      mime_type: string;
      size: number;
      name: string;
      created_at: string;
    };
    created_at: string;
    updated_at: string;
  }>;
  poll?: {
    id: string;
    post_id: string;
    contentable_id: string;
    contentable_type: string;
    question: {
      en: string;
    };
    duration: number;
    created_at: string;
    updated_at: string;
    choices: Array<{
      id: string;
      poll_id: string;
      label: {
        en: string;
      };
      vote_count: number;
    }>;
  };
  event?: {
    id: string;
    post_id: string;
    title: {
      en: string;
    };
    description: {
      en: string;
    };
    start_time: string;
    location: {
      id: string;
      contentable_id: string;
      contentable_type: string;
      country_code: string | null;
      address: string;
      display: string | null;
      latitude: number;
      longitude: number;
      location_point: {
        lng: number;
        lat: number;
      };
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    type: string;
    created_at: string;
    updated_at: string;
  };
  location?: {
    id: string;
    contentable_id: string;
    contentable_type: string;
    country_code: string | null;
    address: string;
    display: string | null;
    latitude: number;
    longitude: number;
    location_point: {
      lng: number;
      lat: number;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

interface TimelineResponse {
  posts: ApiPost[];
  next_cursor: number;
}

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [activeTab, setActiveTab] = useState('foryou');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const selectedPostData = selectedPost ? posts.find(p => p.id === selectedPost) : null;

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: TimelineResponse = await api.fetchTimeline({ limit: 10, cursor: "" });
        setPosts(response.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              <Post 
                post={selectedPostData} 
              />
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
              {loading ? (
                <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Loading posts...
                </div>
              ) : error ? (
                <div className={`p-8 text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No posts available
                </div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
                  >
                    <Post 
                      post={post} 
                      onPostClick={setSelectedPost}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
};

export default HomeScreen;