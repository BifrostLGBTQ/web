import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Link, MoreHorizontal, Heart, Baby, Cigarette, Wine, Languages, Ruler, Star as StarIcon, PawPrint, Church, Brain, GraduationCap, ChevronRight, VenusAndMars, Eye, Palette, Users, Accessibility, Paintbrush, RulerDimensionLine, Vegan, PersonStanding, SparkleIcon, Scissors, Sparkle, Sparkles, Drumstick, Drama, Banana } from 'lucide-react';
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
  languages: string[] | null;
  languages_display?: string;
  fantasies: string[]; // labels of selected fantasies
  interests?: number[] | string[]; // interest ids (from README) or labels
  height_cm?: number;
  weight_kg?: number;
  hair_color?: string;
  eye_color?: string;
  body_type?: string;
  skin_color?: string;
  ethnicity?: string;
  zodiac_sign?: string;
  physical_disability?: string;
  circumcision?: string;
  kids?: string;
  smoking?: string;
  drinking?: string;
  star_sign?: string;
  pets?: string;
  religion?: string;
  personality?: string;
  education_level?: string;
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
  const [activeTab, setActiveTab] = useState<'profile' | 'posts' | 'replies' | 'media' | 'likes'>('posts');
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
          languages: ['English'],
          languages_display: 'English',
          fantasies: ['Bondage', 'Role Play', 'Voyeurism'],
          interests: [247, 175, 21, 253, 125, 88, 228, 229, 221, 136, 25],
          height_cm: 178,
          weight_kg: 76,
          hair_color: 'Brown',
          eye_color: 'Hazel',
          body_type: 'Athletic',
          skin_color: 'Tan',
          ethnicity: 'Mediterranean',
          zodiac_sign: 'Aquarius',
          physical_disability: 'None',
          circumcision: 'Circumcised',
          kids: 'I’d like them someday',
          smoking: 'No',
          drinking: 'Socially',
          star_sign: 'Aquarius',
          pets: 'Dog(s)',
          religion: 'Agnostic',
          personality: 'Somewhere in between',
          education_level: 'Undergraduate degree',
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
    <div className={`scrollbar-hide max-h-[100dvh]  overflow-y-auto ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleBackClick}
            className={`p-2 rounded-full transition-all duration-200 mr-3 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
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
          <button className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
            <MoreHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      <div className="scrollbar-hide max-h-[100dvh] min-h-[100dvh]  overflow-y-auto max-w-[1380px] mx-auto">
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
                className={`px-6 py-2 -mt-12 rounded-full font-bold transition-all duration-200 ${isFollowing
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
                { id: 'profile', label: 'Profile' },
                { id: 'posts', label: 'Posts' },
                { id: 'replies', label: 'Replies' },
                { id: 'media', label: 'Media' },
                { id: 'likes', label: 'Likes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 font-semibold text-sm relative transition-all duration-200 ${activeTab === tab.id
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

          <div className='w-full min-h-[100dvh]'>
            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="px-4 py-4 space-y-6">
                <div className={`w-full`}>
                <h3 className={`text-base font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Attributes</h3>
                  <div className="divide-y divide-gray-200 dark:divide-gray-900">
                    {[{
                      id: 'relationship_status', label: 'Relationship', icon: Heart, value: user.relationship_status
                    },{
                      id: 'sexuality', label: 'Sexuality', icon: VenusAndMars, value: user.sexual_orientation?.key
                    },{
                      id: 'hair_color', label: 'Hair color', icon: Paintbrush, value: user.hair_color || '—'
                    },{
                      id: 'eye_color', label: 'Eye color', icon: Eye, value: user.eye_color || '—'
                    },{
                      id: 'skin_color', label: 'Skin color', icon: Palette, value: (user as any).skin_color || '—'
                    },{
                      id: 'height', label: 'Height', icon: Ruler, value: user.height_cm ? `${user.height_cm} cm` : '—'
                    },{
                      id: 'weight', label: 'Weight', icon: RulerDimensionLine, value: user.weight_kg ? `${user.weight_kg} kg` : '—'
                    },{
                      id: 'body_type', label: 'Body type', icon: PersonStanding, value: user.body_type || '—'
                    },{
                      id: 'circumcision', label: 'Circumcision', icon: Banana, value: (user as any).circumcision || '—'
                    },{
                      id: 'physical_disability', label: 'Physical disability', icon: Accessibility, value: (user as any).physical_disability || '—'
                    },{
                      id: 'ethnicity', label: 'Ethnicity', icon: Users, value: (user as any).ethnicity || '—'
                    },{
                      id: 'kids_preference', label: 'Kids', icon: Baby, value: (user as any).kids || (user as any).kids_preference || '—'
                    },{
                      id: 'smoking', label: 'Smoking', icon: Cigarette, value: (user as any).smoking || '—'
                    },{
                      id: 'drinking', label: 'Drinking', icon: Wine, value: (user as any).drinking || '—'
                    },
                    {
                      id: 'dietary', label: 'Dietary', icon: Vegan, value: (user as any).dietary || '—'
                    },   
                    {
                      id: 'language', label: 'Language', icon: Languages, value: (user as any).languages_display || (Array.isArray(user.languages) ? user.languages.join(', ') : '—')
                    },{
                      id: 'zodiac_sign', label: 'Star sign', icon: Sparkles, value: (user as any).zodiac_sign || (user as any).star_sign || '—'
                    },{
                      id: 'pets', label: 'Pets', icon: PawPrint, value: (user as any).pets || '—'
                    },{
                      id: 'religion', label: 'Religion', icon: Church, value: (user as any).religion || '—'
                    },{
                      id: 'personality', label: 'Personality', icon: Drama, value: (user as any).personality || '—'
                    },{
                      id: 'education', label: 'Education level', icon: GraduationCap, value: (user as any).education_level || '—'
                    }].map((row) => (
                      <button key={row.id} className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 hover:opacity-90`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <row.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{row.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{row.value}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fantasies */}
                <div>
                  <h3 className={`text-base font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fantasies</h3>
                  {user.fantasies && user.fantasies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.fantasies.map((f) => (
                        <span
                          key={String(f)}
                          className={`px-3 py-1 text-xs rounded-full border ${theme === 'dark'
                              ? 'border-gray-800 bg-gray-900 text-gray-200'
                              : 'border-gray-200 bg-gray-50 text-gray-800'
                            }`}
                        >
                          {String(f)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>No fantasies added</div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <h3 className={`text-base font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Interests</h3>
                  {(() => {
                    const interestNameById: Record<number, string> = {
                      247: '3D printing',
                      175: 'Acting',
                      21: 'Action films',
                      253: 'Adventure',
                      125: 'Afrobeats',
                      88: 'Animal lover',
                      228: 'Badminton',
                      229: 'Graduate degree or higher',
                      221: 'Exercising',
                      136: 'Sci-fi books',
                      25: 'Sci-fi films',
                    };
                    const asLabels = (user.interests || []).map((i) =>
                      typeof i === 'number' ? (interestNameById[i] || `Interest #${i}`) : i
                    );
                    return asLabels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {asLabels.map((label) => (
                          <span
                            key={label}
                            className={`px-3 py-1 text-xs rounded-full border ${theme === 'dark'
                                ? 'border-gray-800 bg-gray-900 text-gray-200'
                                : 'border-gray-200 bg-gray-50 text-gray-800'
                              }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>No interests added</div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Posts */}
            <div className={activeTab === 'profile' ? 'hidden' : ''}>
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
          </div>


        </main>
      </div>
    </div>
  );
};

export default ProfileScreen;