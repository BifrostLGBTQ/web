import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Link, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import Post from './Post';

// User interface
interface User {
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
  bio?: string;
  location?: string;
  website?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
}

// Post interface (simplified for profile)
interface ProfilePost {
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
  author: User;
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
}

const ProfileScreen: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data for now
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const mockUser: User = {
          id: '1',
          public_id: 1,
          username: username || 'user',
          displayname: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User',
          email: `${username}@example.com`,
          date_of_birth: '1990-01-01',
          gender: 'male',
          sexual_orientation: { id: '1', key: 'straight', order: 1 },
          sex_role: 'top',
          relationship_status: 'single',
          user_role: 'user',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          default_language: 'en',
          languages: null,
          fantasies: [],
          travel: null,
          social: null,
          deleted_at: null,
          bio: `Welcome to my profile! I'm ${username} and I love connecting with amazing people.`,
          location: 'New York, NY',
          website: 'https://example.com',
          profile_image_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
          followers_count: Math.floor(Math.random() * 1000) + 100,
          following_count: Math.floor(Math.random() * 500) + 50,
          posts_count: Math.floor(Math.random() * 200) + 20,
        };
        setUser(mockUser);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  // Mock posts data
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setPostsLoading(true);
        // TODO: Replace with actual API call
        const mockPosts: ProfilePost[] = Array.from({ length: 5 }, (_, i) => ({
          id: `post-${i}`,
          public_id: i + 1,
          author_id: user?.id || '1',
          type: 'text',
          content: {
            en: `This is post ${i + 1} from ${username}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
          },
          published: true,
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          deleted_at: null,
          author: user!,
          attachments: [],
        }));
        setPosts(mockPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setPostsLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user, username]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleBackClick}
            className={`p-2 rounded-full transition-all duration-200 mr-3 ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <div className="flex-1">
            <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user.displayname}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {user.posts_count} posts
            </p>
          </div>
          <button className={`p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}>
            <MoreHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
          </div>

      <div className="max-w-[1380px] mx-auto">
        <main className={`flex-1 w-full min-w-0 ${theme === 'dark' ? 'border-x border-black' : 'border-x border-gray-100'}`}>
          
          {/* Cover Photo */}
          <div className={`h-48 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {user.cover_image_url ? (
              <img
                src={user.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`} />
                    )}
                  </div>

                {/* Profile Info */}
          <div className="relative px-4">
            <div className="flex items-start justify-between">
              {/* Profile Picture */}
              <div className="relative -mt-16">
                <div className={`w-28 h-28 rounded-full border-4 ${theme === 'dark' ? 'border-black' : 'border-white'}`}>
                  <img
                    src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    alt={user.displayname}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollowClick}
                className={`px-6 py-2 -mt-12 rounded-full font-bold transition-all duration-200 ${
                  isFollowing
                  ? theme === 'dark'
                      ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200'
                  : theme === 'dark'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* User Info */}
            <div className="mt-3 mb-3">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.displayname}
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                @{user.username}
              </p>
            </div>

              {/* Bio */}
            {user.bio && (
              <p className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.bio}
              </p>
            )}

            {/* Additional Info */}
            <div className="space-y-1 mb-3">
              {user.location && (
                <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Link className="w-4 h-4 mr-2" />
                  <a href={user.website} className="hover:underline" target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
              </div>
              )}
              <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar className="w-4 h-4 mr-2" />
                {formatJoinDate(user.created_at)}
                    </div>
                  </div>

            {/* Stats */}
            <div className="flex space-x-4 mb-3">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user.following_count}
                </span> Following
                    </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user.followers_count}
                </span> Followers
                  </div>
                </div>
              </div>

          {/* Tabs - Sticky */}
          <div className={`sticky ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} style={{ top: '73px', zIndex: 10 }}>
            <div className={`flex border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              {[
                { id: 'posts', label: 'Posts' },
                { id: 'replies', label: 'Replies' },
                { id: 'media', label: 'Media' },
                { id: 'likes', label: 'Likes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 font-semibold text-sm relative transition-all duration-200 ${
                    activeTab === tab.id
                      ? theme === 'dark' ? 'text-white' : 'text-black'
                      : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                  <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                      layoutId="activeTabIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
                ))}
                </div>
              </div>
              
          {/* Posts */}
          <div>
            {postsLoading ? (
              <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No posts yet
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
                    post={post as any} 
                    onPostClick={(postId, username) => navigate(`/${username}/status/${postId}`)}
                    onProfileClick={(username) => navigate(`/${username}`)}
                  />
                </motion.div>
              ))
            )}
                  </div>
        </main>
              </div>
    </div>
  );
};

export default ProfileScreen;