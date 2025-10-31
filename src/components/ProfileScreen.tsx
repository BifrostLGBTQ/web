import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Link, MoreHorizontal, Heart, Baby, Cigarette, Wine, Languages, Ruler, PawPrint, Church, GraduationCap, VenusAndMars, Eye, Palette, Users, Accessibility, Paintbrush, RulerDimensionLine, Vegan, PersonStanding, Sparkles, Drama, Banana, Edit2, Save, Camera, Image as ImageIcon, ChevronRight, Check, HeartHandshake, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';
import Post from './Post';
import { api } from '../services/api';
import { Actions } from '../services/actions';
import { useTranslation } from 'react-i18next';

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
  user_attributes?: Array<{
    id: string;
    user_id: string;
    category_type: string;
    attribute_id: string;
    attribute: {
      id: string;
      category: string;
      display_order: number;
      name: Record<string, string>;
    };
  }>;
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
  const { user: authUser, isAuthenticated, updateUser } = useAuth();
  const { data: appData, defaultLanguage } = useApp();
  const { t } = useTranslation('common');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [attributeView, setAttributeView] = useState<'list' | 'detail'>('list');
  const [updatingAttributes, setUpdatingAttributes] = useState<Record<string, boolean>>({});
  
  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && authUser && user && (authUser.username === user.username || authUser.id === user.id);

  // Build fieldOptions from API data
  const fieldOptions: Record<string, Array<{ id: string; name: string; display_order: number }>> = {};
  
  if (appData?.attributes) {
    appData.attributes.forEach((group) => {
      const sortedAttributes = [...group.attributes].sort((a, b) => a.display_order - b.display_order);
      fieldOptions[group.category] = sortedAttributes.map(attr => ({
        id: attr.id,
        name: attr.name[defaultLanguage] || attr.name.en || Object.values(attr.name)[0] || '',
        display_order: attr.display_order,
      }));
    });
  }

  // Field labels for display
  const fieldLabels: Record<string, string> = {
    hair_color: t('profile.hair_color'),
    eye_color: t('profile.eye_color'),
    skin_color: t('profile.skin_color'),
    body_type: t('profile.body_type'),
    ethnicity: t('profile.ethnicity'),
    zodiac_sign: t('profile.zodiac_sign'),
    circumcision: t('profile.circumcision'),
    physical_disability: t('profile.physical_disability'),
    smoking: t('profile.smoking'),
    drinking: t('profile.drinking'),
    height: t('profile.height'),
    weight: t('profile.weight'),
    religion: t('profile.religion'),
    education: t('profile.education_level'),
    relationship_status: t('profile.relationship_status'),
    pets: t('profile.pets'),
    personality: t('profile.personality'),
    kids_preference: t('profile.kids'),
    dietary: t('profile.dietary'),
    hiv_aids_status: t('profile.hiv_aids_status'),
  };

  const USER_ATTRIBUTES = [
    { field: 'height', label: t('profile.height'), icon: Ruler },
    { field: 'weight', label: t('profile.weight'), icon: RulerDimensionLine },
    { field: 'hair_color', label: t('profile.hair_color'), icon: Paintbrush },
    { field: 'eye_color', label: t('profile.eye_color'), icon: Eye },
    { field: 'skin_color', label: t('profile.skin_color'), icon: Palette },
    { field: 'body_type', label: t('profile.body_type'), icon: PersonStanding },
    { field: 'ethnicity', label: t('profile.ethnicity'), icon: Users },
    { field: 'zodiac_sign', label: t('profile.zodiac_sign'), icon: Sparkles },
    { field: 'circumcision', label: t('profile.circumcision'), icon: Banana },
    { field: 'physical_disability', label: t('profile.physical_disability'), icon: Accessibility },
    { field: 'smoking', label: t('profile.smoking'), icon: Cigarette },
    { field: 'drinking', label: t('profile.drinking'), icon: Wine },
    { field: 'religion', label: t('profile.religion'), icon: Church },
    { field: 'education', label: t('profile.education_level'), icon: GraduationCap },
    { field: 'relationship_status', label: t('profile.relationship_status'), icon: Heart },
    { field: 'pets', label: t('profile.pets'), icon: PawPrint },
    { field: 'personality', label: t('profile.personality'), icon: Drama },
    { field: 'kids_preference', label: t('profile.kids'), icon: Baby },
    { field: 'dietary', label: t('profile.dietary'), icon: Vegan },
    { field: 'hiv_aids_status', label: t('profile.hiv_aids_status'), icon: HeartHandshake },
  ];

  const handleFieldOptionSelect = async (field: string, value: string) => {
    // Find the selected option to get both id and name
    const options = fieldOptions[field] || [];
    const selectedOption = options.find(opt => opt.id === value);
    const attributeId = selectedOption ? selectedOption.id : value;
    
    if (!attributeId) {
      console.error(`No attribute ID found for field ${field}`);
      return;
    }
    
    // Set loading state for this field
    setUpdatingAttributes({ ...updatingAttributes, [field]: true });
    
    // Immediately save to backend using CMD_USER_UPDATE_ATTRIBUTE
    try {
      const response = await api.call(Actions.CMD_USER_UPDATE_ATTRIBUTE, {
        method: "POST",
        body: { attribute_id: attributeId },
      });
      
      // Update auth context - always update if authenticated (removed isOwnProfile restriction)
      if (isAuthenticated && authUser) {
        // If response contains updated user, use that
        if (response?.user) {
          updateUser(response.user);
        } else {
          // Otherwise, update user_attributes manually
          const existingAttributes = authUser.user_attributes || [];
          const otherAttributes = existingAttributes.filter(ua => ua.category_type !== field);
          const attributeData = options.find(opt => opt.id === attributeId);
          
          if (attributeData) {
            const newAttribute = {
              id: `temp-${Date.now()}`,
              user_id: authUser.id,
              category_type: field,
              attribute_id: attributeId,
              attribute: {
                id: attributeId,
                category: field,
                display_order: attributeData.display_order,
                name: { [defaultLanguage]: attributeData.name } as Record<string, string>,
              },
            };
            
            updateUser({
              ...authUser,
              user_attributes: [...otherAttributes, newAttribute],
            } as any);
          }
        }
      }
      
      // Update local user state - always update if authenticated user matches
      if (isAuthenticated && authUser && user && (authUser.id === user.id || authUser.username === user.username)) {
        setUser(authUser as unknown as User);
      }
    } catch (err: any) {
      console.error(`Error updating ${field}:`, err);
      setError(err.response?.data?.message || `Failed to update ${field}`);
    } finally {
      // Clear loading state
      setUpdatingAttributes({ ...updatingAttributes, [field]: false });
    }
    
    // Go back to list view
    setAttributeView('list');
    setSelectedField(null);
  };

  const handleFieldClick = (field: string) => {
    // Always allow clicking - even if no options available
    // API might not have options yet, but user should still be able to interact
    setSelectedField(field);
    setAttributeView('detail');
  };

  // Initialize edit form when edit mode opens (only for non-attribute fields)
  useEffect(() => {
    if (isEditMode && user) {
      setEditFormData({
        displayname: user.displayname,
        bio: user.bio || '',
        website: user.website || '',
        languages: user.languages || [],
      } as any);
      // Reset image previews
      setProfileImagePreview(null);
      setCoverImagePreview(null);
      setProfileImageFile(null);
      setCoverImageFile(null);
      // Reset attribute view
      setAttributeView('list');
      setSelectedField(null);
    }
  }, [isEditMode, user]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setUploadingProfileImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Immediately upload the image
      try {
        const formData = new FormData();
        formData.append('profile_image', file);
        
        const response = await api.updateProfile(formData as any);
        
        // Update local state with new image URL if returned
        if (response?.user?.profile_image_url) {
          setUser({ ...user!, profile_image_url: response.user.profile_image_url });
          if (isOwnProfile && authUser) {
            updateUser({ profile_image_url: response.user.profile_image_url });
          }
        } else if (profileImagePreview) {
          // Fallback to preview URL
          setUser({ ...user!, profile_image_url: profileImagePreview });
          if (isOwnProfile && authUser) {
            updateUser({ profile_image_url: profileImagePreview });
          }
        }
      } catch (err: any) {
        console.error('Error uploading profile image:', err);
        setError(err.response?.data?.message || 'Failed to upload profile image');
      } finally {
        setUploadingProfileImage(false);
      }
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setUploadingCoverImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Immediately upload the image
      try {
        const formData = new FormData();
        formData.append('cover_image', file);
        
        const response = await api.updateProfile(formData as any);
        
        // Update local state with new image URL if returned
        if (response?.user?.cover_image_url) {
          setUser({ ...user!, cover_image_url: response.user.cover_image_url });
          if (isOwnProfile && authUser) {
            updateUser({ cover_image_url: response.user.cover_image_url } as any);
          }
        } else if (coverImagePreview) {
          // Fallback to preview URL
          setUser({ ...user!, cover_image_url: coverImagePreview });
          if (isOwnProfile && authUser) {
            updateUser({ cover_image_url: coverImagePreview } as any);
          }
        }
      } catch (err: any) {
        console.error('Error uploading cover image:', err);
        setError(err.response?.data?.message || 'Failed to upload cover image');
      } finally {
        setUploadingCoverImage(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    try {
      // Create FormData if there are images to upload
      const formData = new FormData();
      
      // Add profile image if selected
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      }
      
      // Add cover image if selected
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }
      
      // Add other form data
      Object.keys(editFormData).forEach(key => {
        const value = editFormData[key as keyof typeof editFormData];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // If there are images, send FormData, otherwise send regular object
      if (profileImageFile || coverImageFile) {
        await api.updateProfile(formData as any);
      } else {
        await api.updateProfile(editFormData);
      }
      
      // Update local user state
      const updatedUser = { 
        ...user, 
        ...editFormData,
        profile_image_url: profileImagePreview || user.profile_image_url,
        cover_image_url: coverImagePreview || user.cover_image_url,
      };
      setUser(updatedUser);
      
      // Update auth context user if it's the same user
      if (isOwnProfile && authUser) {
        // Filter out location string, only keep valid User fields
        const { location, ...restEditData } = editFormData;
        updateUser({
          ...restEditData as any,
          profile_image_url: profileImagePreview || authUser.profile_image_url,
          ...(coverImagePreview && { cover_image_url: coverImagePreview }),
        });
      }
      
      setIsEditMode(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

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
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className={`p-2 rounded-full transition-all duration-200 mr-3 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
              >
                <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              </button>
              <div className="flex-1">
                <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('profile.edit_profile')}
                </h1>
              </div>
              <div className="w-12"></div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="scrollbar-hide max-h-[100dvh] min-h-[100dvh]  overflow-y-auto max-w-[1380px] mx-auto">
        {isEditMode ? (
          // Edit Profile View
          <main className={`flex-1 w-full min-w-0 ${theme === 'dark' ? 'border-x border-black' : 'border-x border-gray-100'}`}>
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
              <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 border-x ${theme === 'dark' ? 'border-black' : 'border-gray-100'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Cover Image */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.cover_image')}
                    </label>
                    <div className="relative">
                      <div className={`w-full h-48 rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {(coverImagePreview || user.cover_image_url) ? (
                          <img
                            src={coverImagePreview || user.cover_image_url || ''}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => coverImageInputRef.current?.click()}
                        disabled={uploadingCoverImage}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${uploadingCoverImage
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                          } ${theme === 'dark'
                          ? 'bg-black/50 hover:bg-black/70 text-white'
                          : 'bg-white/90 hover:bg-white text-gray-900'
                          }`}
                      >
                        {uploadingCoverImage ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        ref={coverImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.profile_image')}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-32 h-32 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          {(profileImagePreview || user.profile_image_url) ? (
                            <img
                              src={profileImagePreview || user.profile_image_url || ''}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`} />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => profileImageInputRef.current?.click()}
                          disabled={uploadingProfileImage}
                          className={`absolute bottom-0 right-0 p-2 rounded-full transition-all border-2 ${uploadingProfileImage
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                            } ${theme === 'dark'
                            ? 'bg-black text-white border-gray-700 hover:bg-gray-800'
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                          {uploadingProfileImage ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>
                        <input
                          ref={profileImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t('profile.image_hint')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.display_name')}
                    </label>
                    <input
                      type="text"
                      value={editFormData.displayname || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, displayname: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                        }`}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.bio')}
                    </label>
                    <textarea
                      value={editFormData.bio || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all resize-none ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                        }`}
                      placeholder={t('profile.bio_placeholder')}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.location')}
                    </label>
                    <input
                      type="text"
                      value={typeof user?.location === 'string' ? user.location : (user?.location as any)?.display || ''}
                      onChange={(e) => {
                        const locationValue = e.target.value;
                        setEditFormData({ 
                          ...editFormData, 
                          location: locationValue as any
                        });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                        }`}
                      placeholder={t('profile.location_placeholder')}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.website')}
                    </label>
                    <input
                      type="url"
                      value={editFormData.website || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                        }`}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Attributes List - iOS tableView style */}
                  <div className="relative">
                    {/* List View */}
                    <motion.div
                      animate={{ 
                        x: attributeView === 'list' ? 0 : '-100%',
                        opacity: attributeView === 'list' ? 1 : 0
                      }}
                      transition={{ 
                        type: 'spring', 
                        damping: 35, 
                        stiffness: 400,
                        mass: 0.8
                      }}
                      className={`relative ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}
                      style={{ 
                        pointerEvents: attributeView === 'list' ? 'auto' : 'none',
                        willChange: 'transform, opacity'
                      }}
                    >
                      {/* List Header */}
                      <div className={`px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
                        <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {t('profile.attributes')}
                        </h3>
                      </div>
                      
                      {/* List Content */}
                      <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        {USER_ATTRIBUTES.map((item, index) => {
                          const isLast = index === USER_ATTRIBUTES.length - 1;
                          const isLoading = updatingAttributes[item.field] || false;
                          const options = fieldOptions[item.field] || [];
                          
                          // Get current attribute from authUser's user_attributes (if edit mode) or user's user_attributes
                          const userToCheck = isEditMode && isAuthenticated ? authUser : user;
                          const currentUserAttribute = userToCheck?.user_attributes?.find(
                            (ua: any) => ua.category_type === item.field
                          );
                          
                          const currentAttributeId = currentUserAttribute?.attribute_id;
                          const selectedOption = currentAttributeId 
                            ? options.find((opt: any) => opt.id === currentAttributeId)
                            : null;
                          
                          // If option found, use its name, otherwise try to use attribute.name from user_attributes
                          const hasValue = !!(selectedOption || (currentUserAttribute?.attribute?.name));
                          const displayValue = selectedOption 
                            ? selectedOption.name
                            : currentUserAttribute?.attribute?.name
                            ? (currentUserAttribute.attribute.name[defaultLanguage] || currentUserAttribute.attribute.name.en || Object.values(currentUserAttribute.attribute.name)[0] || t('profile.select_option'))
                            : t('profile.select_option');
                          
                          return (
                            <button
                              key={item.field}
                              type="button"
                              onClick={() => handleFieldClick(item.field)}
                              disabled={isLoading}
                              className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${isLoading ? 'opacity-50 cursor-default' : ''} ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${theme === 'dark'
                                ? 'text-white hover:bg-gray-800/50 active:bg-gray-800'
                                : 'text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <item.icon className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className="font-medium text-base flex-1 text-left">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                {!hasValue && (
                                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                                )}
                                <span className={`text-sm ${hasValue 
                                  ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')
                                  : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
                                } truncate max-w-[120px]`}>
                                  {displayValue}
                                </span>
                                {isLoading ? (
                                  <div className={`w-4 h-4 border-2 ${theme === 'dark' ? 'border-gray-500 border-t-gray-300' : 'border-gray-400 border-t-gray-600'} rounded-full animate-spin flex-shrink-0`} />
                                ) : (
                                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Detail View */}
                    <motion.div
                      animate={{ 
                        x: attributeView === 'detail' ? 0 : '100%',
                        opacity: attributeView === 'detail' ? 1 : 0
                      }}
                      transition={{ 
                        type: 'spring', 
                        damping: 35, 
                        stiffness: 400,
                        mass: 0.8
                      }}
                      className={`absolute inset-0 ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} z-10`}
                      style={{ 
                        pointerEvents: attributeView === 'detail' ? 'auto' : 'none',
                        willChange: 'transform, opacity'
                      }}
                    >
                      {/* Detail Header */}
                      <div className={`px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
                        <button
                          onClick={() => {
                            setAttributeView('list');
                            setSelectedField(null);
                          }}
                          className={`p-2 rounded-full transition-colors ${theme === 'dark'
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className={`text-lg font-bold flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedField ? (fieldLabels[selectedField] || selectedField) : ''}
                        </h2>
                      </div>

                      {/* Options List */}
                      <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        {selectedField && fieldOptions[selectedField] && fieldOptions[selectedField].length > 0 ? (
                          fieldOptions[selectedField].map((option, index) => {
                            // Get current attribute from authUser's user_attributes (if edit mode) or user's user_attributes
                            const userToCheck = isEditMode && isAuthenticated ? authUser : user;
                            const currentUserAttribute = userToCheck?.user_attributes?.find(
                              (ua: any) => ua.category_type === selectedField
                            );
                            const currentAttributeId = currentUserAttribute?.attribute_id;
                            const isSelected = currentAttributeId === option.id;
                            const isLast = index === fieldOptions[selectedField].length - 1;
                            return (
                              <button
                                key={option.id}
                                onClick={() => handleFieldOptionSelect(selectedField, option.id)}
                                className={`w-full px-4 py-4 text-left flex items-center justify-between transition-colors ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${isSelected
                                    ? theme === 'dark'
                                      ? 'bg-gray-800/50 text-white'
                                      : 'bg-gray-50 text-gray-900'
                                    : theme === 'dark'
                                      ? 'border-gray-800 text-gray-300 hover:bg-gray-800/30 active:bg-gray-800'
                                      : 'border-gray-100 text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                  }`}
                              >
                                <span className="text-base font-medium">{option.name}</span>
                                {isSelected && (
                                  <Check className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p className="text-sm">{t('profile.no_options_available') || 'No options available for this attribute'}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${theme === 'dark'
                        ? 'bg-red-900/20 border-red-700 text-red-300'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                      <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => setIsEditMode(false)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {t('profile.cancel')}
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${isSaving
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-white text-black hover:bg-gray-200'
                            : 'bg-black text-white hover:bg-gray-900'
                        }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>{t('profile.saving')}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{t('profile.save')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        ) : (
          // Profile View
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

              {/* Follow Button or Edit Button */}
              {!isEditMode && (
                isOwnProfile ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className={`px-6 py-2 -mt-12 rounded-full font-bold transition-all duration-200 flex items-center gap-2 ${theme === 'dark'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                      }`}
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('profile.edit_profile')}
                  </button>
                ) : (
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
                )
              )}
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
                  <div className={`w-full`}>
                   
                      <div className="w-full flex flex-col gap-2 sm:gap-3">
                        {USER_ATTRIBUTES.map((item) => {
                          // Find attribute from user_attributes
                          const currentUserAttribute = user?.user_attributes?.find(
                            (ua: any) => ua.category_type === item.field
                          );
                          
                          // Get display value
                          let displayValue = '';
                          let hasValue = false;
                          
                          if (currentUserAttribute?.attribute?.name) {
                            // Get localized name from attribute
                            displayValue = currentUserAttribute.attribute.name[defaultLanguage] || 
                                          currentUserAttribute.attribute.name.en || 
                                          Object.values(currentUserAttribute.attribute.name)[0] || '';
                            hasValue = !!displayValue;
                          }
                          
                          // Special cases for non-attribute fields
                          if (item.field === 'relationship_status' && !hasValue) {
                            displayValue = user?.relationship_status || '';
                            hasValue = !!displayValue;
                          }
                          
                          if (!hasValue) {
                            displayValue = t('profile.select_option');
                          }
                          
                          return (
                            <div key={item.field} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 ${theme === 'dark' ? 'bg-gray-950/50 border border-gray-900' : 'bg-gray-50 border border-gray-200'}`}>
                              <div className="flex items-center gap-3 min-w-0">
                                <item.icon className={`w-7 h-7 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.label}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {!hasValue && (
                                  <AlertTriangle className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                                )}
                                <span className={`text-sm whitespace-nowrap ${hasValue 
                                  ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')
                                  : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
                                }`}>
                                  {displayValue}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
           
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
        )}
      </div>

    </div>
  );
};

export default ProfileScreen;