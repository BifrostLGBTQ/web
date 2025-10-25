import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Edit3,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Shield,
  Star,
  Rabbit,
  Plus,
  X,
  Save
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { UserFantasy } from '../interfaces/user';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [imageType, setImageType] = useState<'avatar' | 'cover' | 'public' | 'private'>('public');
  const [photoGallery, setPhotoGallery] = useState<'public' | 'private'>('public');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showPhotoActions, setShowPhotoActions] = useState(false);
  const [selectedFantasies, setSelectedFantasies] = useState<Set<string>>(new Set());
  const [showFantasyModal, setShowFantasyModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { data } = useApp();

  const [profileData, setProfileData] = useState({
    name: 'Alex Rivera',
    age: 26,
    location: 'Downtown, New Jersey',
    bio: 'Artist & activist passionate about creating inclusive spaces. Love hiking, coffee, and meaningful conversations. Looking for genuine connections in the LGBTIQ+ community. 🏳️‍🌈✨',
    occupation: 'Graphic Designer',
    education: 'Art Institute of Chicago',
    interests: ['Art', 'Hiking', 'Photography', 'Activism', 'Coffee', 'Travel', 'Music', 'Reading'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
    cover: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
    publicPhotos: [
      'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2'
    ],
    privatePhotos: [
      'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2'
    ],
    stats: {
      matches: 127,
      likes: 89,
      visits: 234
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        // Direct image update without crop
        if (imageType === 'avatar') {
          setProfileData(prev => ({
            ...prev,
            avatar: result
          }));
        } else if (imageType === 'cover') {
          setProfileData(prev => ({
            ...prev,
            cover: result
          }));
        } else if (imageType === 'public') {
          setProfileData(prev => ({
            ...prev,
            publicPhotos: [...prev.publicPhotos, result]
          }));
        } else if (imageType === 'private') {
          setProfileData(prev => ({
            ...prev,
            privatePhotos: [...prev.privatePhotos, result]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEditField = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowPhotoActions(true);
  };

  const handleMoveToPrivate = () => {
    if (selectedPhotoIndex !== null && photoGallery === 'public') {
      const photo = profileData.publicPhotos[selectedPhotoIndex];
      setProfileData(prev => ({
        ...prev,
        publicPhotos: prev.publicPhotos.filter((_, i) => i !== selectedPhotoIndex),
        privatePhotos: [...prev.privatePhotos, photo]
      }));
    } else if (selectedPhotoIndex !== null && photoGallery === 'private') {
      const photo = profileData.privatePhotos[selectedPhotoIndex];
      setProfileData(prev => ({
        ...prev,
        privatePhotos: prev.privatePhotos.filter((_, i) => i !== selectedPhotoIndex),
        publicPhotos: [...prev.publicPhotos, photo]
      }));
    }
    setShowPhotoActions(false);
    setSelectedPhotoIndex(null);
  };

  const handleDeletePhoto = () => {
    if (selectedPhotoIndex !== null) {
      if (photoGallery === 'public') {
        setProfileData(prev => ({
          ...prev,
          publicPhotos: prev.publicPhotos.filter((_, i) => i !== selectedPhotoIndex)
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          privatePhotos: prev.privatePhotos.filter((_, i) => i !== selectedPhotoIndex)
        }));
      }
    }
    setShowPhotoActions(false);
    setSelectedPhotoIndex(null);
  };

  const handleFantasyToggle = (fantasyId: string) => {
    setSelectedFantasies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fantasyId)) {
        newSet.delete(fantasyId);
      } else {
        newSet.add(fantasyId);
      }
      return newSet;
    });
  };

  const handleSaveFantasies = () => {
    // Save selected fantasies to user profile
    console.log('Selected fantasies:', Array.from(selectedFantasies));
    setShowFantasyModal(false);
  };

  // Initialize selected fantasies from user data
  useEffect(() => {
    if (user?.fantasies && Array.isArray(user.fantasies)) {
      const userFantasyIds = user.fantasies.map((userFantasy: UserFantasy) => userFantasy.fantasy_id);
      setSelectedFantasies(new Set(userFantasyIds));
    }
  }, [user]);

  const tabs = [
    { id: 'about', label: 'About', icon: Heart },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'interests', label: 'Interests', icon: Star },
    { id: 'preferences', label: 'Preferences', icon: Rabbit }
  ];

  return (
    <div className={`max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <motion.div
        className={`max-w-2xl mx-auto min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Cover Image */}
          <div className="relative w-full h-full">
            <img
              src={profileData.cover}
              alt="Cover"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Cover Photo Edit Button */}
          {isEditing && (
            <motion.button
              onClick={() => {
                setImageType('cover');
                fileInputRef.current?.click();
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.35)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.button>
          )}

          {/* Header Actions */}
          <div className="absolute top-6 left-6 right-6 flex justify-between">
            <motion.button
              className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center border transition-all duration-300 ${isEditing
                  ? 'bg-white/25 border-white/40'
                  : 'bg-white/15 border-white/20'
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Avatar Section - Fixed Position */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="relative px-6 pb-6">
              {/* Avatar Container */}
              <div className="flex items-end space-x-4">
                {/* Avatar */}
                <motion.div
                  className="relative flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-2xl"
                    />
                    {isEditing && (
                      <motion.button
                        onClick={() => {
                          setImageType('avatar');
                          fileInputRef.current?.click();
                        }}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Camera className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0 pb-2">
                  <motion.h1
                    className="text-3xl font-bold text-white mb-2 truncate"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {profileData.name}, {profileData.age}
                  </motion.h1>

                  <motion.div
                    className="flex items-center text-white/90 mb-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{profileData.location}</span>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    className="flex space-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profileData.stats.matches}</p>
                      <p className="text-xs text-white/80">Matches</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profileData.stats.likes}</p>
                      <p className="text-xs text-white/80">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profileData.stats.visits}</p>
                      <p className="text-xs text-white/80">Views</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className={`flex border-b-2 ${theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-5 transition-all duration-300 relative ${activeTab === tab.id
                  ? theme === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'scale-110' : ''
                } transition-transform duration-300`} />
              <span className={`text-sm font-semibold ${activeTab === tab.id ? 'scale-105' : ''
                } transition-transform duration-300`}>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-900'
                    }`}
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>About Me</h3>
                  {isEditing && (
                    <motion.button
                      onClick={() => setIsEditing(false)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <Save className="w-4 h-4 mr-1 inline" />
                      Save
                    </motion.button>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleEditField('bio', e.target.value)}
                    className={`w-full p-4 rounded-2xl border-2 resize-none ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                      }`}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{profileData.bio}</p>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Details</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                      <Briefcase className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.occupation}
                          onChange={(e) => handleEditField('occupation', e.target.value)}
                          className={`w-full p-2 rounded-lg border ${theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                        />
                      ) : (
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{profileData.occupation}</p>
                      )}
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Occupation</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                      <GraduationCap className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.education}
                          onChange={(e) => handleEditField('education', e.target.value)}
                          className={`w-full p-2 rounded-lg border ${theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                        />
                      ) : (
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{profileData.education}</p>
                      )}
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Education</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Gallery Toggle */}
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setPhotoGallery('public')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${photoGallery === 'public'
                      ? theme === 'dark'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-900 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Public Photos
                </motion.button>
                <motion.button
                  onClick={() => setPhotoGallery('private')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${photoGallery === 'private'
                      ? theme === 'dark'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-900 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Private Photos
                </motion.button>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-3">
                {(photoGallery === 'public' ? profileData.publicPhotos : profileData.privatePhotos).map((photo, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handlePhotoClick(index)}
                  >
                    <img
                      src={photo}
                      alt={`${photoGallery === 'public' ? 'Public' : 'Private'} Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add Photo Button */}
                <motion.div
                  className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setImageType(photoGallery);
                    fileInputRef.current?.click();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {photoGallery === 'public' ? 'Add Public Photo' : 'Add Private Photo'}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interests' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-3">
                {profileData.interests.map((interest, index) => (
                  <motion.span
                    key={interest}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 border-gray-700'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 15 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

           {activeTab === 'preferences' && (
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
               className="space-y-6"
             >
               {/* Selected Fantasies */}
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                       Your Fantasies
                     </h3>
                     {user?.fantasies && (
                       <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                         {user.fantasies.length} fantasy from your profile
                       </p>
                     )}
                   </div>
                   <motion.button
                     onClick={() => setShowFantasyModal(true)}
                     className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                       theme === 'dark'
                         ? 'bg-white text-gray-900 hover:bg-gray-100'
                         : 'bg-gray-900 text-white hover:bg-gray-800'
                     }`}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <Edit3 className="w-4 h-4 mr-2 inline" />
                     Edit Fantasies
                   </motion.button>
                 </div>
                 
                 {selectedFantasies.size > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {Array.from(selectedFantasies).map((fantasyId) => {
                       const fantasy = data?.fantasies ? Object.values(data.fantasies).find(f => f.id === fantasyId) : null;
                       if (!fantasy) return null;
                       
                       return (
                         <motion.span
                           key={fantasyId}
                           className={`px-4 py-2 rounded-full text-sm font-medium border ${
                             theme === 'dark'
                               ? 'bg-white/10 text-white border-white/20'
                               : 'bg-gray-900/10 text-gray-900 border-gray-300'
                           }`}
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ type: "spring", stiffness: 500, damping: 15 }}
                           whileHover={{ scale: 1.05 }}
                         >
                           {fantasy.translations.en?.label || fantasy.category}
                         </motion.span>
                       );
                     })}
                   </div>
                 ) : (
                   <div className={`p-6 rounded-2xl border-2 border-dashed text-center ${
                     theme === 'dark'
                       ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                       : 'bg-gray-50 border-gray-200 text-gray-500'
                   }`}>
                     <Heart className={`w-8 h-8 mx-auto mb-2 ${
                       theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                     }`} />
                     <p className="text-sm">No fantasies selected yet</p>
                     <p className="text-xs mt-1">Tap "Edit Fantasies" to add your preferences</p>
                   </div>
                 )}
               </div>
             </motion.div>
           )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="p-6 pt-0 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <motion.button
            className={`w-full py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600'
                : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'
              }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit3 className="w-5 h-5 mr-2 inline" />
            Edit Profile
          </motion.button>

          <div className="flex space-x-4">
            <motion.button
              className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-5 h-5" />
              <span>Privacy</span>
            </motion.button>

            <motion.button
              className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />


      {/* Fantasy Selection Modal */}
      <AnimatePresence>
        {showFantasyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowFantasyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Select Your Fantasies
                    </h3>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Choose the fantasies that interest you (select as many as you want)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFantasyModal(false)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Fantasy Grid */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data?.fantasies ? Object.values(data.fantasies).map((fantasy, index) => {
                    const isSelected = selectedFantasies.has(fantasy.id);
                    return (
                      <motion.button
                        key={fantasy.id}
                        onClick={() => handleFantasyToggle(fantasy.id)}
                        className={`p-4 rounded-2xl text-left transition-all duration-200 ${
                          isSelected
                            ? theme === 'dark'
                              ? 'bg-white text-gray-900 border-2 border-white'
                              : 'bg-gray-900 text-white border-2 border-gray-900'
                            : theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">
                              {fantasy.translations.en?.label || fantasy.category}
                            </h4>
                            {fantasy.translations.en?.description && (
                              <p className={`text-xs ${
                                isSelected ? (theme === 'dark' ? 'text-gray-700' : 'text-gray-300') : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {fantasy.translations.en.description}
                              </p>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${
                            isSelected
                              ? theme === 'dark'
                                ? 'bg-gray-900 border-gray-900'
                                : 'bg-white border-white'
                              : theme === 'dark'
                              ? 'border-gray-600'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-900'}`} />}
                          </div>
                        </div>
                      </motion.button>
                    );
                  }) : []}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedFantasies.size} fantasy selected
                  </p>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowFantasyModal(false)}
                      className={`px-6 py-3 rounded-2xl font-semibold ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveFantasies}
                      className={`px-6 py-3 rounded-2xl font-semibold ${
                        theme === 'dark'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Fantasies
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Actions Modal - Elegant Design */}
      <AnimatePresence>
        {showPhotoActions && selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4"
            onClick={() => {
              setShowPhotoActions(false);
              setSelectedPhotoIndex(null);
            }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl ${theme === 'dark'
                  ? 'bg-gray-900'
                  : 'bg-white'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
              </div>

              <div className="px-6 pb-6">
                {/* Photo preview */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden">
                    <img
                      src={(photoGallery === 'public' ? profileData.publicPhotos : profileData.privatePhotos)[selectedPhotoIndex]}
                      alt="Selected photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                      Photo Options
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Choose an action for this photo
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleMoveToPrivate}
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-200 ${theme === 'dark'
                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900/20' : 'bg-white/20'
                      }`}>
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <span>{photoGallery === 'public' ? 'Move to Private' : 'Move to Public'}</span>
                  </motion.button>

                  <motion.button
                    onClick={handleDeletePhoto}
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-200 ${theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg border border-gray-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-lg border border-gray-300'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300/50'
                      }`}>
                      <X className="w-4 h-4" />
                    </div>
                    <span>Delete Photo</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowPhotoActions(false);
                      setSelectedPhotoIndex(null);
                    }}
                    className={`w-full py-3 rounded-2xl font-medium transition-all duration-200 ${theme === 'dark'
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileScreen;