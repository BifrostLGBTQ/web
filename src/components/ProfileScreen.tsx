import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Link, MoreHorizontal, Heart, Baby, Cigarette, Wine, Ruler, PawPrint, Church, GraduationCap, Eye, Palette, Users, Accessibility, Paintbrush, RulerDimensionLine, Vegan, PersonStanding, Sparkles, Drama, Banana, Save, Camera, Image as ImageIcon, ChevronRight, Check, HeartHandshake, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  fantasies?: Array<{
    id: string;
    user_id: string;
    fantasy_id: string;
    notes?: string;
    fantasy?: {
      id: string;
      category: string;
      translations?: Array<{
        id: string;
        fantasy_id: string;
        language: string;
        label: string;
        description?: string;
      }>;
    };
  }>;
  interests?: Array<{
    id: string;
    user_id: string;
    interest_item_id: string;
    interest_item?: {
      id: string;
      interest_id: string;
      name: Record<string, string>;
      emoji?: string;
      interest?: {
        id: string;
        name: Record<string, string>;
      };
    };
  }>;
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
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(57);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [attributeView, setAttributeView] = useState<'list' | 'detail'>('list');
  const [updatingAttributes, setUpdatingAttributes] = useState<Record<string, boolean>>({});
  const [editTab, setEditTab] = useState<'profile' | 'attributes' | 'interests' | 'fantasies'>('profile');
  const isEditModeRef = useRef(false);
  
  // Interests state
  const [interestView, setInterestView] = useState<'list' | 'detail'>('list');
  const [selectedInterestCategory, setSelectedInterestCategory] = useState<string | null>(null);
  const [updatingInterests, setUpdatingInterests] = useState(false);
  
  // Fantasies state
  const [fantasyView, setFantasyView] = useState<'list' | 'detail'>('list');
  const [selectedFantasyCategory, setSelectedFantasyCategory] = useState<string | null>(null);
  const [updatingFantasies, setUpdatingFantasies] = useState(false);
  
  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && authUser && user && (authUser.username === user.username || authUser.id === user.id);
  
  // Helper functions to get image URLs - prefer authUser if viewing own profile
  const getProfileImageUrl = () => {
    // If viewing own profile and authUser has avatar, use it
    if (isOwnProfile && authUser && (authUser as any).avatar?.file?.url) {
      return (authUser as any).avatar.file.url;
    }
    // Fallback to user state or authUser's profile_image_url
    if (user?.profile_image_url) {
      return user.profile_image_url;
    }
    if (authUser && (authUser as any).profile_image_url) {
      return (authUser as any).profile_image_url;
    }
    return undefined;
  };
  
  const getCoverImageUrl = () => {
    // If viewing own profile and authUser has cover, use it
    if (isOwnProfile && authUser && (authUser as any).cover?.file?.url) {
      return (authUser as any).cover.file.url;
    }
    // Fallback to user state or authUser's cover_image_url
    if (user?.cover_image_url) {
      return user.cover_image_url;
    }
    if (authUser && (authUser as any).cover_image_url) {
      return (authUser as any).cover_image_url;
    }
    return undefined;
  };

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

  // Build interestOptions from API data
  const interestOptions: Record<string, Array<{ id: string; name: string; emoji?: string; interest_id: string }>> = {};
  const interestCategories: Array<{ id: string; name: string }> = [];
  
  if (appData?.interests) {
    appData.interests.forEach((interest) => {
      const categoryName = interest.name[defaultLanguage] || interest.name.en || Object.values(interest.name)[0] || '';
      interestCategories.push({
        id: interest.id,
        name: categoryName,
      });
      
      interestOptions[interest.id] = (interest.items || []).map(item => ({
        id: item.id,
        name: item.name[defaultLanguage] || item.name.en || Object.values(item.name)[0] || '',
        emoji: item.emoji,
        interest_id: item.interest_id,
      }));
    });
  }

  // Get user's selected interests (as array of item IDs)
  // Use authUser if viewing own profile, otherwise use user
  const userSelectedInterestIds = React.useMemo(() => {
    const interestsSource = (isEditMode && isAuthenticated && isOwnProfile && authUser) ? (authUser as any).interests : user?.interests;
    if (!interestsSource) return [];
    // Handle both formats: array of objects (from API) or array of strings/numbers (legacy)
    return interestsSource.map((i: any) => {
      if (typeof i === 'object' && i !== null) {
        // New format: object with interest_item_id or interest_item.id
        return String(i.interest_item_id || i.interest_item?.id || i.id);
      }
      // Legacy format: string or number
      return String(i);
    });
  }, [user?.interests, authUser, isEditMode, isAuthenticated, isOwnProfile]);

  // Get selected interest items grouped by category for display in category list
  // Use authUser if viewing own profile, otherwise use user
  const userSelectedInterestsByCategory = React.useMemo(() => {
    const interestsSource = (isEditMode && isAuthenticated && isOwnProfile && authUser) ? (authUser as any).interests : user?.interests;
    if (!interestsSource || !appData?.interests) return {};
    const grouped: Record<string, Array<{ id: string; name: string; emoji?: string }>> = {};
    
    interestsSource.forEach((userInterest: any) => {
      if (typeof userInterest === 'object' && userInterest !== null) {
        const interestItem = userInterest.interest_item;
        if (interestItem) {
          const categoryId = interestItem.interest_id || interestItem.interest?.id;
          if (categoryId) {
            if (!grouped[categoryId]) {
              grouped[categoryId] = [];
            }
            const itemName = interestItem.name[defaultLanguage] || 
                           interestItem.name.en || 
                           Object.values(interestItem.name)[0] || '';
            grouped[categoryId].push({
              id: interestItem.id || String(userInterest.interest_item_id),
              name: itemName,
              emoji: interestItem.emoji,
            });
          }
        }
      }
    });
    
    return grouped;
  }, [user?.interests, authUser, isEditMode, isAuthenticated, isOwnProfile, appData?.interests, defaultLanguage]);

  // Build fantasyOptions and fantasyCategories from API data
  const fantasyOptions: Record<string, Array<{ id: string; name: string; description: string }>> = {};
  const fantasyCategories: Array<{ id: string; name: string }> = [];
  
  // Category name translations
  const fantasyCategoryNames: Record<string, Record<string, string>> = {
    joy_or_tabu: { en: 'Joy or Taboo', tr: 'Zevk veya Tabu' },
    sexual_adventure: { en: 'Sexual Adventure', tr: 'Cinsel Macera' },
    physical_pref: { en: 'Physical Preference', tr: 'Fiziksel Tercih' },
    sexual_pref: { en: 'Sexual Preference', tr: 'Cinsel Tercih' },
    amusement: { en: 'Amusement', tr: 'Eğlence' },
  };
  
  if (appData?.fantasies) {
    // Group fantasies by category
    const fantasiesByCategory: Record<string, typeof appData.fantasies> = {};
    appData.fantasies.forEach((fantasy) => {
      if (!fantasiesByCategory[fantasy.category]) {
        fantasiesByCategory[fantasy.category] = [];
      }
      fantasiesByCategory[fantasy.category].push(fantasy);
    });
    
    // Build categories and options
    Object.keys(fantasiesByCategory).forEach((categoryId) => {
      const categoryName = fantasyCategoryNames[categoryId]?.[defaultLanguage] || 
                          fantasyCategoryNames[categoryId]?.en || 
                          categoryId;
      fantasyCategories.push({
        id: categoryId,
        name: categoryName,
      });
      
      fantasyOptions[categoryId] = fantasiesByCategory[categoryId].map((fantasy) => {
        const translation = fantasy.translations?.find(t => t.language === defaultLanguage) ||
                           fantasy.translations?.find(t => t.language === 'en') ||
                           fantasy.translations?.[0];
        return {
          id: fantasy.id,
          name: translation?.label || '',
          description: translation?.description || '',
        };
      });
    });
  }

  // Get user's selected fantasies (as array of fantasy IDs)
  // Use authUser if viewing own profile in edit mode, otherwise use user
  const userSelectedFantasyIds = React.useMemo(() => {
    const fantasiesSource = (isEditMode && isAuthenticated && isOwnProfile && authUser) ? (authUser as any).fantasies : user?.fantasies;
    if (!fantasiesSource) return [];
    return fantasiesSource.map((f: any) => f.fantasy_id || f.id);
  }, [user?.fantasies, authUser, isEditMode, isAuthenticated, isOwnProfile]);

  // Get selected fantasy items grouped by category for display in category list
  // Use authUser if viewing own profile in edit mode, otherwise use user
  const userSelectedFantasiesByCategory = React.useMemo(() => {
    const fantasiesSource = (isEditMode && isAuthenticated && isOwnProfile && authUser) ? (authUser as any).fantasies : user?.fantasies;
    if (!fantasiesSource || !appData?.fantasies) return {};
    const grouped: Record<string, Array<{ id: string; name: string }>> = {};
    
    fantasiesSource.forEach((userFantasy: any) => {
      if (typeof userFantasy === 'object' && userFantasy !== null) {
        const fantasyId = userFantasy.fantasy_id || userFantasy.id;
        if (fantasyId) {
          // Find the fantasy in appData to get its category
          const fantasy = appData.fantasies.find(f => f.id === fantasyId);
          if (fantasy) {
            const categoryId = fantasy.category;
            if (!grouped[categoryId]) {
              grouped[categoryId] = [];
            }
            const translation = fantasy.translations?.find(t => t.language === defaultLanguage) ||
                               fantasy.translations?.find(t => t.language === 'en') ||
                               fantasy.translations?.[0];
            const fantasyName = translation?.label || '';
            grouped[categoryId].push({
              id: fantasyId,
              name: fantasyName,
            });
          }
        }
      }
    });
    
    return grouped;
  }, [user?.fantasies, authUser, isEditMode, isAuthenticated, isOwnProfile, appData?.fantasies, defaultLanguage]);

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

  const handleInterestCategoryClick = (categoryId: string) => {
    setSelectedInterestCategory(categoryId);
    setInterestView('detail');
  };

  const handleInterestItemToggle = async (itemId: string) => {
    const currentSelected = userSelectedInterestIds || [];
    const isSelected = currentSelected.includes(itemId);
    
    setUpdatingInterests(true);
    setError(null); // Clear previous errors
    
    // Optimistically update UI
    const newSelected = isSelected
      ? currentSelected.filter((id: string) => id !== itemId)
      : [...currentSelected, itemId];
    
    // Update local state immediately for better UX
    if (user) {
      // Update interests - maintain object structure if it exists, otherwise create new format
      const currentInterests = user.interests || [];
      let updatedInterests: typeof currentInterests;
      
      if (isSelected) {
        // Remove interest
        updatedInterests = currentInterests.filter((interest: any) => {
          if (typeof interest === 'object' && interest !== null) {
            return String(interest.interest_item_id || interest.interest_item?.id || interest.id) !== itemId;
          }
          return String(interest) !== itemId;
        });
      } else {
        // Add interest - find the item from appData to create proper structure
        const interestItem = Object.values(interestOptions).flat().find(item => item.id === itemId);
        if (interestItem) {
          // Find the category this item belongs to
          const category = interestCategories.find(cat => 
            interestOptions[cat.id]?.some(item => item.id === itemId)
          );
          
          if (category) {
            const newInterest = {
              id: `temp-${Date.now()}`,
              user_id: user.id,
              interest_item_id: itemId,
              interest_item: {
                id: itemId,
                interest_id: category.id,
                name: { [defaultLanguage]: interestItem.name } as Record<string, string>,
                emoji: interestItem.emoji,
                interest: {
                  id: category.id,
                  name: { [defaultLanguage]: category.name } as Record<string, string>,
                },
              },
            };
            updatedInterests = [...currentInterests, newInterest as any];
          } else {
            updatedInterests = currentInterests;
          }
        } else {
          updatedInterests = currentInterests;
        }
      }
      
      setUser({
        ...user,
        interests: updatedInterests,
      });
    }
    
    try {
      // Update via API using CMD_USER_UPDATE_INTEREST
      const response = await api.call(Actions.CMD_USER_UPDATE_INTEREST, {
        method: "POST",
        body: { interest_id: itemId },
      });
      
      // Update auth context - use response if available, otherwise use local state
      if (isAuthenticated && authUser) {
        if (response?.user) {
          updateUser(response.user);
          // Update local user state from response
          if (user && (authUser.id === user.id || authUser.username === user.username)) {
            setUser(response.user as unknown as User);
          }
        } else if (user && (authUser.id === user.id || authUser.username === user.username)) {
          // Fallback to local state update
          updateUser({
            ...authUser,
            interests: newSelected,
          } as any);
        }
      }
    } catch (err: any) {
      console.error('Error updating interests:', err);
      
      // Revert optimistic update on error
      if (user) {
        // Revert to previous interests state (before the change)
        // We need to restore the original interests array
        // For now, just refresh from authUser if available
        if (isAuthenticated && authUser && (authUser as any).interests) {
          setUser({
            ...user,
            interests: (authUser as any).interests,
          });
        } else {
          // Fallback: remove the last added item if we added, or re-add if we removed
          const currentInterests = user.interests || [];
          if (isSelected) {
            // We removed it, so re-add it
            const interestItem = Object.values(interestOptions).flat().find(item => item.id === itemId);
            if (interestItem) {
              const category = interestCategories.find(cat => 
                interestOptions[cat.id]?.some(item => item.id === itemId)
              );
              if (category) {
                const restoredInterest = {
                  id: `temp-${Date.now()}`,
                  user_id: user.id,
                  interest_item_id: itemId,
                  interest_item: {
                    id: itemId,
                    interest_id: category.id,
                    name: { [defaultLanguage]: interestItem.name } as Record<string, string>,
                    emoji: interestItem.emoji,
                    interest: {
                      id: category.id,
                      name: { [defaultLanguage]: category.name } as Record<string, string>,
                    },
                  },
                };
                setUser({
                  ...user,
                  interests: [...currentInterests, restoredInterest as any],
                });
              }
            }
          } else {
            // We added it, so remove it
            setUser({
              ...user,
              interests: currentInterests.filter((interest: any) => {
                if (typeof interest === 'object' && interest !== null) {
                  return String(interest.interest_item_id || interest.interest_item?.id || interest.id) !== itemId;
                }
                return String(interest) !== itemId;
              }),
            });
          }
        }
      }
      
      // Set error message - will be displayed in the error section (doesn't cause screen to disappear)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update interests';
      setError(errorMessage);
    } finally {
      setUpdatingInterests(false);
    }
  };

  const handleFantasyCategoryClick = (categoryId: string) => {
    setSelectedFantasyCategory(categoryId);
    setFantasyView('detail');
  };

  const handleFantasyItemToggle = async (fantasyId: string) => {
    const currentSelected = userSelectedFantasyIds || [];
    const isSelected = currentSelected.includes(fantasyId);
    
    setUpdatingFantasies(true);
    setError(null); // Clear previous errors
    
    // Update local state immediately for better UX
    if (user) {
      const currentFantasies = user.fantasies || [];
      if (isSelected) {
        // Remove fantasy
        setUser({
          ...user,
          fantasies: currentFantasies.filter(f => (f.fantasy_id || f.id) !== fantasyId),
        });
      } else {
        // Add fantasy - create UserFantasy object
        const fantasy = appData?.fantasies?.find(f => f.id === fantasyId);
        if (fantasy) {
          const newFantasy = {
            id: `temp-${Date.now()}`,
            user_id: user.id,
            fantasy_id: fantasyId,
            fantasy: {
              id: fantasy.id,
              category: fantasy.category,
              translations: fantasy.translations,
            },
          };
          setUser({
            ...user,
            fantasies: [...currentFantasies, newFantasy as any],
          });
        }
      }
    }
    
    try {
      // Update via API using CMD_USER_UPDATE_FANTASY
      const response = await api.call(Actions.CMD_USER_UPDATE_FANTASY, {
        method: "POST",
        body: { fantasy_id: fantasyId },
      });
      
      // Update auth context - use response if available, otherwise use local state
      if (isAuthenticated && authUser) {
        if (response?.user) {
          updateUser(response.user);
          // Update local user state from response
          if (user && (authUser.id === user.id || authUser.username === user.username)) {
            setUser(response.user as unknown as User);
          }
        } else if (user && (authUser.id === user.id || authUser.username === user.username)) {
          // Fallback to local state update
          updateUser({
            ...authUser,
            fantasies: user.fantasies,
          } as any);
        }
      }
    } catch (err: any) {
      console.error('Error updating fantasies:', err);
      
      // Revert optimistic update on error
      if (user) {
        const currentFantasies = user.fantasies || [];
        if (isSelected) {
          // Re-add fantasy if we removed it
          const fantasy = appData?.fantasies?.find(f => f.id === fantasyId);
          if (fantasy) {
            const restoredFantasy = {
              id: `temp-${Date.now()}`,
              user_id: user.id,
              fantasy_id: fantasyId,
              fantasy: {
                id: fantasy.id,
                category: fantasy.category,
                translations: fantasy.translations,
              },
            };
            setUser({
              ...user,
              fantasies: [...currentFantasies, restoredFantasy as any],
            });
          }
        } else {
          // Remove fantasy if we added it
          setUser({
            ...user,
            fantasies: currentFantasies.filter(f => (f.fantasy_id || f.id) !== fantasyId),
          });
        }
      }
      
      // Set error message - will be displayed in the error section (doesn't cause screen to disappear)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update fantasies';
      setError(errorMessage);
    } finally {
      setUpdatingFantasies(false);
    }
  };

  // Initialize edit form when edit mode opens (only for non-attribute fields)
  useEffect(() => {
    if (isEditMode) {
      // Reset edit tab only when first entering edit mode
      // Use a ref to track if this is the first time entering edit mode
      if (!isEditModeRef.current) {
        setEditTab('profile');
        isEditModeRef.current = true;
      }
      
      // Reset image previews
      setProfileImagePreview(null);
      setCoverImagePreview(null);
      setProfileImageFile(null);
      setCoverImageFile(null);
      // Reset attribute view
      setAttributeView('list');
      setSelectedField(null);
      // Reset interest view
      setInterestView('list');
      setSelectedInterestCategory(null);
      // Reset fantasy view
      setFantasyView('list');
      setSelectedFantasyCategory(null);
      
      // Initialize form data if user is available
      if (user) {
        setEditFormData({
          displayname: user.displayname,
          bio: user.bio || '',
          website: user.website || '',
          languages: user.languages || [],
        } as any);
      }
    } else {
      // Reset ref when exiting edit mode
      isEditModeRef.current = false;
    }
  }, [isEditMode]); // Only depend on isEditMode, not user
  
  // Update form data when user changes (but don't reset tab or other states)
  useEffect(() => {
    if (isEditMode && user && isEditModeRef.current) {
      // Only update if we're already in edit mode (ref is true)
      setEditFormData({
        displayname: user.displayname,
        bio: user.bio || '',
        website: user.website || '',
        languages: user.languages || [],
      } as any);
    }
  }, [isEditMode, user?.displayname, user?.bio, user?.website, user?.languages]);

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

      // Immediately upload the image using CMD_USER_UPLOAD_AVATAR
      try {
        const response = await api.call(Actions.CMD_USER_UPLOAD_AVATAR, {
          method: "POST",
          body: { avatar: file },
        });
        
        // Update local state with new image URL from API response
        if (response?.user?.avatar?.file?.url) {
          const imageUrl = response.user.avatar.file.url;
          setUser({ ...user!, profile_image_url: imageUrl });
          if (isOwnProfile && authUser) {
            updateUser({ profile_image_url: imageUrl });
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

      // Immediately upload the image using CMD_USER_UPLOAD_COVER
      try {
        const response = await api.call(Actions.CMD_USER_UPLOAD_COVER, {
          method: "POST",
          body: { cover: file },
        });
        
        // Update local state with new image URL from API response
        if (response?.user?.cover?.file?.url) {
          const imageUrl = response.user.cover.file.url;
          setUser({ ...user!, cover_image_url: imageUrl });
          if (isOwnProfile && authUser) {
            updateUser({ cover_image_url: imageUrl } as any);
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

  // Measure header height for sticky tabs
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };
    
    updateHeaderHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [user, isEditMode]);

  // Mock user data for now
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // If viewing own profile and authUser exists, use authUser data, otherwise create mock
        const isOwn = isAuthenticated && authUser && (authUser.username === username || authUser.id === username);
        
        let userInterests: any[] = [];
        let userFantasies: any[] = [];
        let userAttributes: any[] = [];
        
        if (isOwn && authUser) {
          // Use real data from authUser
          userInterests = (authUser as any).interests || [];
          userFantasies = (authUser as any).fantasies || [];
          userAttributes = authUser.user_attributes || [];
        }
        
        // Get avatar and cover URLs from authUser if available
        const profileImageUrl = (isOwn && authUser && (authUser as any).avatar?.file?.url) 
          ? (authUser as any).avatar.file.url 
          : (isOwn && authUser && (authUser as any).profile_image_url)
          ? (authUser as any).profile_image_url
          : `https://ui-avatars.com/api/?name=${username || 'user'}&background=random`;
        
        const coverImageUrl = (isOwn && authUser && (authUser as any).cover?.file?.url) 
          ? (authUser as any).cover.file.url 
          : (isOwn && authUser && (authUser as any).cover_image_url)
          ? (authUser as any).cover_image_url
          : undefined;

        const mockUser: User = {
          id: isOwn && authUser ? authUser.id : '1',
          public_id: isOwn && authUser ? authUser.public_id : 1,
          username: username || 'user',
          displayname: isOwn && authUser ? authUser.displayname : (username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User'),
          email: isOwn && authUser ? (authUser.email || `${username}@example.com`) : `${username}@example.com`,
          date_of_birth: isOwn && authUser ? (authUser.date_of_birth || '1990-01-01') : '1990-01-01',
          gender: isOwn && authUser ? (authUser.gender || 'male') : 'male',
          sexual_orientation: isOwn && authUser && (authUser as any).sexual_orientation ? (authUser as any).sexual_orientation : { id: '1', key: 'straight', order: 1 },
          sex_role: isOwn && authUser ? ((authUser as any).sex_role || 'top') : 'top',
          relationship_status: isOwn && authUser ? (authUser.relationship_status || 'single') : 'single',
          user_role: isOwn && authUser ? (authUser.user_role || 'user') : 'user',
          is_active: isOwn && authUser ? authUser.is_active : true,
          created_at: isOwn && authUser ? authUser.created_at : '2023-01-01T00:00:00Z',
          updated_at: isOwn && authUser ? authUser.updated_at : '2023-01-01T00:00:00Z',
          default_language: isOwn && authUser ? ((authUser as any).default_language || 'en') : 'en',
          languages: isOwn && authUser ? (authUser.languages || null) : ['English'],
          languages_display: isOwn && authUser ? ((authUser as any).languages_display || 'English') : 'English',
          fantasies: userFantasies,
          interests: userInterests,
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
          kids: "I'd like them someday",
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
          bio: isOwn && authUser && authUser.bio ? authUser.bio : `Welcome to my profile! I'm ${username} and I love connecting with amazing people.`,
          location: isOwn && authUser && (authUser as any).location ? (authUser as any).location : 'New York, NY',
          website: isOwn && authUser && (authUser as any).website ? (authUser as any).website : 'https://example.com',
          profile_image_url: profileImageUrl,
          cover_image_url: coverImageUrl,
          followers_count: Math.floor(Math.random() * 1000) + 100,
          following_count: Math.floor(Math.random() * 500) + 50,
          posts_count: Math.floor(Math.random() * 200) + 20,
          user_attributes: userAttributes,
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
  }, [username, authUser, isAuthenticated]);

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

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className={`scrollbar-hide max-h-[100dvh] overflow-y-auto ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div ref={headerRef} className={`sticky top-0 z-30 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
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

      <div className="max-w-[1380px] mx-auto">
        {isEditMode ? (
          // Edit Profile View
          <main className={`flex-1 w-full min-w-0 ${theme === 'dark' ? 'border-x border-black' : 'border-x border-gray-100'}`}>
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
              <div className={`max-w-4xl mx-auto border-x ${theme === 'dark' ? 'border-black' : 'border-gray-100'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Cover Image */}
                  <div className="px-4 sm:px-6 pt-8">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.cover_image')}
                    </label>
                    <div className="relative">
                      <div className={`w-full h-48 rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {(coverImagePreview || getCoverImageUrl()) ? (
                          <img
                            src={coverImagePreview || getCoverImageUrl() || ''}
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
                  <div className="px-4 sm:px-6">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('profile.profile_image')}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-32 h-32 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          {(profileImagePreview || getProfileImageUrl()) ? (
                            <img
                              src={profileImagePreview || getProfileImageUrl() || ''}
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

                  {/* Edit Tabs */}
                  <div className={`sticky z-20 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} backdrop-blur-sm ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'}`} style={{ top: `${headerHeight}px` }}>
                    <div className={`flex px-4 sm:px-6`}>
                      {[
                        { id: 'profile', label: t('profile.profile_info') || 'Profile Info' },
                        { id: 'attributes', label: t('profile.attributes') },
                        { id: 'interests', label: t('profile.interests') },
                        { id: 'fantasies', label: t('profile.fantasies') },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setEditTab(tab.id as any)}
                          className={`flex-1 py-3 font-semibold text-sm relative transition-all duration-200 ${editTab === tab.id
                              ? theme === 'dark' ? 'text-white' : 'text-black'
                              : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                          {tab.label}
                          {editTab === tab.id && (
                            <motion.div
                              className={`absolute bottom-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                              layoutId="activeEditTabIndicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="relative min-h-[400px] px-4 sm:px-6 w-full">
                    <AnimatePresence mode="wait" initial={false}>
                      {editTab === 'profile' && (
                        <motion.div
                          key="profile"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 w-full"
                        >
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
                        </motion.div>
                      )}
                      {editTab === 'attributes' && (
                        <motion.div
                          key="attributes"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 w-full"
                        >
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
                    </motion.div>
                      )}
                      {editTab === 'interests' && (
                        <motion.div
                          key="interests"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 w-full"
                        >
                          {/* Interests List - iOS tableView style */}
                          <div className="relative">
                            {/* List View */}
                            <motion.div
                              animate={{ 
                                x: interestView === 'list' ? 0 : '-100%',
                                opacity: interestView === 'list' ? 1 : 0
                              }}
                              transition={{ 
                                type: 'spring', 
                                damping: 35, 
                                stiffness: 400,
                                mass: 0.8
                              }}
                              className={`relative ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}
                              style={{ 
                                pointerEvents: interestView === 'list' ? 'auto' : 'none',
                                willChange: 'transform, opacity'
                              }}
                            >
                              {/* List Header */}
                              <div className={`px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
                                <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {t('profile.interests')}
                                </h3>
                              </div>
                              
                              {/* List Content */}
                              <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                {interestCategories.map((category, index) => {
                                  const isLast = index === interestCategories.length - 1;
                                  const categoryItems = interestOptions[category.id] || [];
                                  const selectedCount = categoryItems.filter(item => userSelectedInterestIds.includes(item.id)).length;
                                  const hasSelections = selectedCount > 0;
                                  const selectedItems = userSelectedInterestsByCategory[category.id] || [];
                                  
                                  return (
                                    <button
                                      key={category.id}
                                      type="button"
                                      onClick={() => handleInterestCategoryClick(category.id)}
                                      disabled={updatingInterests}
                                      className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${updatingInterests ? 'opacity-50 cursor-default' : ''} ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${theme === 'dark'
                                        ? 'text-white hover:bg-gray-800/50 active:bg-gray-800'
                                        : 'text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="font-medium text-base flex-1 text-left">{category.name}</span>
                                        {selectedItems.length > 0 && (
                                          <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0 ml-2">
                                            {selectedItems.slice(0, 3).map((item) => (
                                              <span
                                                key={item.id}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                  ? 'bg-gray-800 text-gray-200 border border-gray-700'
                                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}
                                              >
                                                {item.emoji && <span>{item.emoji}</span>}
                                                <span className="truncate max-w-[60px]">{item.name}</span>
                                              </span>
                                            ))}
                                            {selectedItems.length > 3 && (
                                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                +{selectedItems.length - 3}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                        {hasSelections && selectedItems.length === 0 && (
                                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {selectedCount}
                                          </span>
                                        )}
                                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>

                            {/* Detail View */}
                            <motion.div
                              animate={{ 
                                x: interestView === 'detail' ? 0 : '100%',
                                opacity: interestView === 'detail' ? 1 : 0
                              }}
                              transition={{ 
                                type: 'spring', 
                                damping: 35, 
                                stiffness: 400,
                                mass: 0.8
                              }}
                              className={`absolute inset-0 ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} z-10`}
                              style={{ 
                                pointerEvents: interestView === 'detail' ? 'auto' : 'none',
                                willChange: 'transform, opacity'
                              }}
                            >
                              {/* Detail Header */}
                              <div className={`sticky top-0 z-10 px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-black/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
                                <button
                                  onClick={() => {
                                    setInterestView('list');
                                    setSelectedInterestCategory(null);
                                  }}
                                  className={`p-2 rounded-full transition-colors ${theme === 'dark'
                                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h2 className={`text-lg font-bold flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedInterestCategory ? (interestCategories.find(c => c.id === selectedInterestCategory)?.name || '') : ''}
                                </h2>
                              </div>

                              {/* Options List */}
                              <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                {selectedInterestCategory && interestOptions[selectedInterestCategory] && interestOptions[selectedInterestCategory].length > 0 ? (
                                  interestOptions[selectedInterestCategory].map((item, index) => {
                                    const isSelected = userSelectedInterestIds.includes(item.id);
                                    const isLast = index === interestOptions[selectedInterestCategory].length - 1;
                                    return (
                                      <button
                                        key={item.id}
                                        onClick={() => handleInterestItemToggle(item.id)}
                                        disabled={updatingInterests}
                                        className={`w-full px-4 py-4 text-left flex items-center justify-between transition-colors ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${isSelected
                                            ? theme === 'dark'
                                              ? 'bg-gray-800/50 text-white'
                                              : 'bg-gray-50 text-gray-900'
                                            : theme === 'dark'
                                              ? 'border-gray-800 text-gray-300 hover:bg-gray-800/30 active:bg-gray-800'
                                              : 'border-gray-100 text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                          } ${updatingInterests ? 'opacity-50 cursor-wait' : ''}`}
                                      >
                                        <div className="flex items-center gap-3 flex-1">
                                          {item.emoji && (
                                            <span className="text-lg">{item.emoji}</span>
                                          )}
                                          <span className="text-base font-medium">{item.name}</span>
                                        </div>
                                        {isSelected && (
                                          <Check className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                        )}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <p className="text-sm">{t('profile.no_options_available') || 'No options available for this category'}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      {editTab === 'fantasies' && (
                        <motion.div
                          key="fantasies"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 w-full"
                        >
                          {/* Fantasies List - iOS tableView style */}
                          <div className="relative">
                            {/* List View */}
                            <motion.div
                              animate={{ 
                                x: fantasyView === 'list' ? 0 : '-100%',
                                opacity: fantasyView === 'list' ? 1 : 0
                              }}
                              transition={{ 
                                type: 'spring', 
                                damping: 35, 
                                stiffness: 400,
                                mass: 0.8
                              }}
                              className={`relative ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}
                              style={{ 
                                pointerEvents: fantasyView === 'list' ? 'auto' : 'none',
                                willChange: 'transform, opacity'
                              }}
                            >
                              {/* List Header */}
                              <div className={`px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
                                <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {t('profile.fantasies')}
                                </h3>
                              </div>
                              
                              {/* List Content */}
                              <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                {fantasyCategories.map((category, index) => {
                                  const isLast = index === fantasyCategories.length - 1;
                                  const categoryItems = fantasyOptions[category.id] || [];
                                  const selectedCount = categoryItems.filter(item => userSelectedFantasyIds.includes(item.id)).length;
                                  const hasSelections = selectedCount > 0;
                                  const selectedItems = userSelectedFantasiesByCategory[category.id] || [];
                                  
                                  return (
                                    <button
                                      key={category.id}
                                      type="button"
                                      onClick={() => handleFantasyCategoryClick(category.id)}
                                      disabled={updatingFantasies}
                                      className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${updatingFantasies ? 'opacity-50 cursor-default' : ''} ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${theme === 'dark'
                                        ? 'text-white hover:bg-gray-800/50 active:bg-gray-800'
                                        : 'text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="font-medium text-base flex-1 text-left">{category.name}</span>
                                        {selectedItems.length > 0 && (
                                          <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0 ml-2">
                                            {selectedItems.slice(0, 3).map((item) => (
                                              <span
                                                key={item.id}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                                                  ? 'bg-gray-800 text-gray-200 border border-gray-700'
                                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}
                                              >
                                                <span className="truncate max-w-[80px]">{item.name}</span>
                                              </span>
                                            ))}
                                            {selectedItems.length > 3 && (
                                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                +{selectedItems.length - 3}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                        {hasSelections && selectedItems.length === 0 && (
                                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {selectedCount}
                                          </span>
                                        )}
                                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>

                            {/* Detail View */}
                            <motion.div
                              animate={{ 
                                x: fantasyView === 'detail' ? 0 : '100%',
                                opacity: fantasyView === 'detail' ? 1 : 0
                              }}
                              transition={{ 
                                type: 'spring', 
                                damping: 35, 
                                stiffness: 400,
                                mass: 0.8
                              }}
                              className={`absolute inset-0 ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'} z-10`}
                              style={{ 
                                pointerEvents: fantasyView === 'detail' ? 'auto' : 'none',
                                willChange: 'transform, opacity'
                              }}
                            >
                              {/* Detail Header */}
                              <div className={`sticky top-0 z-10 px-4 py-4 flex items-center ${theme === 'dark' ? 'bg-black/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
                                <button
                                  onClick={() => {
                                    setFantasyView('list');
                                    setSelectedFantasyCategory(null);
                                  }}
                                  className={`p-2 rounded-full transition-colors ${theme === 'dark'
                                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h2 className={`text-lg font-bold flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedFantasyCategory ? (fantasyCategories.find(c => c.id === selectedFantasyCategory)?.name || '') : ''}
                                </h2>
                              </div>

                              {/* Options List */}
                              <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                {selectedFantasyCategory && fantasyOptions[selectedFantasyCategory] && fantasyOptions[selectedFantasyCategory].length > 0 ? (
                                  fantasyOptions[selectedFantasyCategory].map((item, index) => {
                                    const isSelected = userSelectedFantasyIds.includes(item.id);
                                    const isLast = index === fantasyOptions[selectedFantasyCategory].length - 1;
                                    return (
                                      <button
                                        key={item.id}
                                        onClick={() => handleFantasyItemToggle(item.id)}
                                        disabled={updatingFantasies}
                                        className={`w-full px-4 py-4 text-left flex items-center justify-between transition-colors ${!isLast ? `border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}` : ''} ${isSelected
                                            ? theme === 'dark'
                                              ? 'bg-gray-800/50 text-white'
                                              : 'bg-gray-50 text-gray-900'
                                            : theme === 'dark'
                                              ? 'border-gray-800 text-gray-300 hover:bg-gray-800/30 active:bg-gray-800'
                                              : 'border-gray-100 text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                          } ${updatingFantasies ? 'opacity-50 cursor-wait' : ''}`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className="flex-1 min-w-0">
                                            <div className="text-base font-medium mb-1">{item.name}</div>
                                            {item.description && (
                                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {item.description}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <Check className={`w-5 h-5 flex-shrink-0 ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                        )}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className={`px-4 py-8 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <p className="text-sm">{t('profile.no_options_available') || 'No options available for this category'}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

              {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mx-4 sm:mx-6 p-4 rounded-xl border ${theme === 'dark'
                        ? 'bg-red-900/20 border-red-700 text-red-300'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                      <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 pb-8 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800">
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
          <div className={`h-48 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {getCoverImageUrl() ? (
              <img
                src={getCoverImageUrl() || ''}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`} />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-4">
            {/* Profile Picture & Edit Button Row */}
            <div className="flex items-end justify-between -mt-16 mb-3 relative">
              {/* Profile Picture */}
              <div className={`relative w-32 h-32 rounded-full border-4 ${theme === 'dark' ? 'border-black' : 'border-white'} ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} z-10`}>
                  <img
                  src={getProfileImageUrl() || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    alt={user.displayname}
                    className="w-full h-full rounded-full object-cover"
                  />
              </div>

              {/* Action Button */}
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors border relative z-10 ${theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-900'
                      : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Edit profile
                </button>
              ) : (
                <div className="flex gap-2 relative z-10">
              <button
                onClick={handleFollowClick}
                    className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors ${isFollowing
                        ? `border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-900' : 'border-gray-300 hover:bg-gray-50'}`
                    : theme === 'dark'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
                  <button
                    className={`px-2 py-1.5 rounded-full transition-colors border ${theme === 'dark'
                        ? 'border-gray-700 hover:bg-gray-900'
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <MoreHorizontal className="w-5 h-5" />
              </button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="mb-3">
              <h2 className={`text-xl font-bold leading-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {user.displayname}
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                @{user.username}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className={`text-sm mb-3 leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {user.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-sm">
              {user.location && (
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  <Link className="w-4 h-4 mr-1" />
                  <a href={user.website} className="hover:underline" target="_blank" rel="noopener noreferrer">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatJoinDate(user.created_at)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-5 mb-4">
              <button className={`text-sm hover:underline ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {user.following_count?.toLocaleString()}
                </span>
                <span className="ml-1">Following</span>
              </button>
              <button className={`text-sm hover:underline ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {user.followers_count?.toLocaleString()}
                </span>
                <span className="ml-1">Followers</span>
              </button>
            </div>
          </div>

          {/* Tabs - Sticky */}
          <div className={`sticky z-20 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} backdrop-blur-sm ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'}`} style={{ top: `${headerHeight}px` }}>
            <div className={`flex`}>
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
                  className={`flex-1 py-4 font-bold text-sm relative transition-colors ${activeTab === tab.id
                      ? theme === 'dark' ? 'text-white' : 'text-black'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                      layoutId="activeTabIndicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className='w-full min-h-[100dvh]'>
            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="px-4 py-6 space-y-8">
                {/* Attributes Section */}
                <div className="w-full">
                  <h2 className={`text-2xl font-bold mb-5 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Attributes
                  </h2>
                  <div className={`rounded-2xl overflow-hidden ${theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-xl border border-white/5' 
                    : 'bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm'
                  }`}>
                    {USER_ATTRIBUTES.map((item, index) => {
                      // Find attribute from user_attributes
                      const currentUserAttribute = user?.user_attributes?.find(
                        (ua: any) => ua.category_type === item.field
                      );
                      
                      // Get display value
                      let displayValue = '';
                      let hasValue = false;
                      
                      if (currentUserAttribute?.attribute?.name) {
                        displayValue = currentUserAttribute.attribute.name[defaultLanguage] || 
                                      currentUserAttribute.attribute.name.en || 
                                      Object.values(currentUserAttribute.attribute.name)[0] || '';
                        hasValue = !!displayValue;
                      }
                      
                      if (item.field === 'relationship_status' && !hasValue) {
                        displayValue = user?.relationship_status || '';
                        hasValue = !!displayValue;
                      }
                      
                      if (!hasValue) {
                        displayValue = t('profile.select_option');
                      }
                      
                      const isLast = index === USER_ATTRIBUTES.length - 1;
                      
                      return (
                        <div 
                          key={item.field} 
                          className={`flex items-center justify-between px-4 py-3.5 transition-colors ${
                            !isLast ? `border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}` : ''
                          } ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                              <item.icon className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                            </div>
                            <span className={`text-[15px] font-medium tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </span>
                            </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!hasValue && (
                              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'}`} />
                            )}
                            <span className={`text-[13px] font-medium whitespace-nowrap ${hasValue 
                              ? (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
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

                {/* Fantasies Section */}
                <div>
                  <h2 className={`text-2xl font-bold mb-5 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Fantasies
                  </h2>
                  {user.fantasies && user.fantasies.length > 0 ? (
                    (() => {
                      // Group fantasies by category
                      const fantasiesByCategory: Record<string, typeof user.fantasies> = {};
                      user.fantasies.forEach((f) => {
                        const categoryId = f.fantasy?.category || 'other';
                        if (!fantasiesByCategory[categoryId]) {
                          fantasiesByCategory[categoryId] = [];
                        }
                        fantasiesByCategory[categoryId].push(f);
                      });

                      return (
                        <div className="space-y-3">
                          {Object.entries(fantasiesByCategory).map(([categoryId, categoryFantasies]) => {
                            const categoryName = fantasyCategoryNames[categoryId]?.[defaultLanguage] || 
                                               fantasyCategoryNames[categoryId]?.en || 
                                               categoryId;
                            return (
                              <div 
                                key={categoryId} 
                                className={`rounded-2xl overflow-hidden ${theme === 'dark' 
                                  ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-xl border border-white/5' 
                                  : 'bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm'
                                }`}
                              >
                                <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                  <h3 className={`text-[13px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {categoryName}
                                  </h3>
                                </div>
                                <div className="p-4 flex flex-wrap gap-2">
                                  {categoryFantasies.map((f) => {
                                    const translation = f.fantasy?.translations?.find(t => t.language === defaultLanguage) ||
                                                       f.fantasy?.translations?.find(t => t.language === 'en') ||
                                                       f.fantasy?.translations?.[0];
                                    const label = translation?.label || `Fantasy ${f.fantasy_id || f.id}`;
                                    return (
                        <span
                                        key={f.id || f.fantasy_id}
                                        className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-all ${theme === 'dark'
                                            ? 'bg-white/10 text-gray-200 hover:bg-white/15'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200/70'
                                          }`}
                                      >
                                        {label}
                        </span>
                                    );
                                  })}
                    </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()
                  ) : (
                    <div className={`text-center py-12 rounded-2xl ${theme === 'dark' 
                      ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-xl border border-white/5' 
                      : 'bg-white/90 backdrop-blur-xl border border-gray-200/50'
                    }`}>
                      <p className={`text-[15px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>No fantasies added</p>
                    </div>
                  )}
                </div>

                {/* Interests Section */}
                <div>
                  <h2 className={`text-2xl font-bold mb-5 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Interests
                  </h2>
                  {(() => {
                    // Use authUser.interests if viewing own profile, otherwise use user.interests
                    const interestsSource = (isOwnProfile && isAuthenticated && authUser && (authUser as any).interests) 
                      ? (authUser as any).interests 
                      : user?.interests;
                    
                    if (!interestsSource || interestsSource.length === 0) {
                      return (
                        <div className={`text-center py-12 rounded-2xl ${theme === 'dark' 
                          ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-xl border border-white/5' 
                          : 'bg-white/90 backdrop-blur-xl border border-gray-200/50'
                        }`}>
                          <p className={`text-[15px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>No interests added</p>
                        </div>
                      );
                    }
                    
                    // Group interests by category
                    const interestsByCategory: Record<string, Array<{ id: string; name: string; emoji?: string; categoryId: string; categoryName: string }>> = {};
                    
                    interestsSource.forEach((interest: any) => {
                      if (typeof interest === 'object' && interest !== null && interest.interest_item) {
                        const itemName = interest.interest_item.name[defaultLanguage] || 
                                       interest.interest_item.name.en || 
                                       Object.values(interest.interest_item.name)[0] || 
                                       `Interest ${interest.interest_item.id}`;
                        
                        const categoryId = interest.interest_item.interest_id || interest.interest_item.interest?.id || 'other';
                        const categoryName = interest.interest_item.interest?.name?.[defaultLanguage] ||
                                           interest.interest_item.interest?.name?.en ||
                                           (interest.interest_item.interest?.name ? Object.values(interest.interest_item.interest.name)[0] : null) ||
                                           'Other';
                        
                        if (!interestsByCategory[categoryId]) {
                          interestsByCategory[categoryId] = [];
                        }
                        
                        interestsByCategory[categoryId].push({
                          id: interest.interest_item.id || interest.id,
                          name: itemName,
                          emoji: interest.interest_item.emoji,
                          categoryId,
                          categoryName,
                        });
                      } else {
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
                        
                        const categoryId = 'uncategorized';
                        if (!interestsByCategory[categoryId]) {
                          interestsByCategory[categoryId] = [];
                        }
                        
                        interestsByCategory[categoryId].push({
                          id: String(interest),
                          name: typeof interest === 'number' ? (interestNameById[interest] || `Interest #${interest}`) : String(interest),
                          emoji: undefined,
                          categoryId,
                          categoryName: 'Other',
                        });
                      }
                    });
                    
                    return (
                      <div className="space-y-3">
                        {Object.entries(interestsByCategory).map(([categoryId, categoryInterests]) => {
                          const categoryName = categoryInterests[0]?.categoryName || 'Other';
                          return (
                            <div 
                              key={categoryId} 
                              className={`rounded-2xl overflow-hidden ${theme === 'dark' 
                                ? 'bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-xl border border-white/5' 
                                : 'bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-sm'
                              }`}
                            >
                              <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                <h3 className={`text-[13px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {categoryName}
                                </h3>
                              </div>
                              <div className="p-4 flex flex-wrap gap-2">
                                {categoryInterests.map((item) => (
                          <span
                                    key={item.id}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full transition-all ${theme === 'dark'
                                        ? 'bg-white/10 text-gray-200 hover:bg-white/15'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200/70'
                                      }`}
                                  >
                                    {item.emoji && <span className="text-sm">{item.emoji}</span>}
                                    <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                            </div>
                          );
                        })}
                      </div>
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