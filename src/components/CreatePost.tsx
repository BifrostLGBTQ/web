import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  Smile,
  MapPin,
  Users,
  Globe,
  Lock,
  X,
  Video,
  BarChart3,
  Sparkles,
  Search,
  Plus,
  Clock,
  Navigation,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import L from 'leaflet';

const CreatePost: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [audience] = useState<'public' | 'community' | 'private'>('public');
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('1');
  const [isEventActive, setIsEventActive] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { theme } = useTheme();
  const maxChars = 500;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPostText(text);
    setCharCount(text.length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!postText.trim() && selectedImages.length === 0) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setPostText('');
    setSelectedImages([]);
    setIsExpanded(false);
    setIsPollActive(false);
    setIsEventActive(false);
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventTime('');
    setPollOptions(['', '']);
    setCharCount(0);
    setLocation(null);
    setIsSubmitting(false);
  };

  // Location functionality
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CreatePost-App/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }

        const data = await response.json();

        if (data && data.display_name) {
          setLocation({
            address: data.display_name,
            lat: latitude,
            lng: longitude
          });
          setIsLocationModalOpen(false);
        } else {
          // Fallback with coordinates
          setLocation({
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude
          });
          setIsLocationModalOpen(false);
        }
      } catch (addressError) {
        console.error('Error fetching address:', addressError);
        // Fallback with coordinates
        setLocation({
          address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude
        });
        setIsLocationModalOpen(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get your location. ';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
      }

      alert(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Poll helper functions
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // Initialize Leaflet map when location is set
  useEffect(() => {
    if (!location || !mapRef.current) {
      return;
    }

    // Cleanup existing map
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (error) {
        console.error('Error removing existing map:', error);
      }
    }

    // Clear container
    const container = mapRef.current;
    container.innerHTML = '';

    // Remove Leaflet-specific properties
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    try {
      // Create map with a small delay to ensure DOM is ready
      setTimeout(() => {
        if (!mapRef.current || !location) return;

        const map = L.map(mapRef.current, {
          center: [location.lat, location.lng],
          zoom: 15,
          zoomControl: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
          attributionControl: false
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Add custom marker
        const customIcon = L.divIcon({
          html: `
            <div style="
              width: 30px;
              height: 30px;
              background: #ef4444;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          className: 'custom-location-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);

      }, 100);

    } catch (error) {
      console.error('Error creating map:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, [location, theme]);





  // Enhanced emoji categories with more emojis
  const emojiCategories = {
    smileys: [
      '�', '�', '😄', '�', '�', '😅', '🤣', '�', '�', '🙃', '😉', '😊', '😇', '🥰', '�😍', '�',
      '�', '😗', '☺️', '😚', '😙', '�', '�', '�', '�', '🤪', '�', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '�', '�', '�', '�', '�', '�', '😬', '�', '�', '�', '🤤', '�', '�', '🤒',
      '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '�', '🤯', '🤠', '🥳', '🥸', '�', '🤓', '�', '�'
    ],
    nature: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸',
      '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺',
      '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍',
      '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊'
    ],
    food: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
      '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐',
      '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭',
      '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛'
    ],
    activities: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
      '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿',
      '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺',
      '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️'
    ],
    travel: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '�', '�🚚', '🚛', '🚜', '🏍️', '�',
      '🚲', '�🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵',
      '🚤', '🛥️', '🛳️', '⛴️', '🚂', '�', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋',
      '🚌', '🚍', '🎡', '🎢', '🎠', '🏗️', '🌁', '�', '🏭', '⛲', '🎡', '🎢', '🎪', '🚩', '🏁', '🏴'
    ],
    objects: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🎮', '🎰', '🎲', '🧩', '🎭', '🎨',
      '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎪', '🎫', '🎟️',
      '📷', '📸', '📹', '📼', '💿', '💾', '💽', '💻', '📱', '☎️', '📞', '📟', '📠', '📺', '📻', '🎙️',
      '⏰', '🕰️', '⏲️', '⏱️', '🧭', '🎚️', '🎛️', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️'
    ],
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
      '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳',
      '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️'
    ]
  };

  const audienceOptions = [
    { value: 'public', icon: Globe, label: 'Everyone', description: 'Anyone can see this post' },
    { value: 'community', icon: Users, label: 'Community', description: 'Only community members can see this post' },
    { value: 'private', icon: Lock, label: 'Private', description: 'Only you can see this post' },
  ];

  return (
    <>
      {/* Ultra-Professional Create Post Component */}
      <motion.div
        className={`relative rounded-3xl shadow-lg mb-6 overflow-hidden transition-all duration-500 w-full max-w-full ${
          theme === 'dark'
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-black/20'
            : 'bg-white/95 backdrop-blur-xl shadow-gray-900/10'
        } ${isExpanded ? 'shadow-xl' : ''}`}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          y: -2,
          transition: { duration: 0.3 }
        }}
      >
        {/* Professional Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${
                theme === 'dark' 
                  ? 'from-gray-600 to-gray-700' 
                  : 'from-gray-400 to-gray-500'
              }`} />
              <h2 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Create Post
              </h2>
            </div>
            
            {/* Audience Selector */}
            <motion.button
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {audienceOptions.find(opt => opt.value === audience)?.icon && 
                React.createElement(audienceOptions.find(opt => opt.value === audience)!.icon, { className: "w-4 h-4" })
              }
              <span className="text-sm font-medium">{audienceOptions.find(opt => opt.value === audience)?.label}</span>
            </motion.button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 py-4 w-full max-w-full">
          <div className="flex space-x-4 w-full max-w-full">
            {/* Enhanced Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                  alt="Your avatar"
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl object-cover ring-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'ring-gray-700 hover:ring-gray-600'
                      : 'ring-gray-200 hover:ring-gray-300'
                  }`}
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                  theme === 'dark'
                    ? 'bg-green-500 border-gray-900'
                    : 'bg-green-500 border-white'
                }`} />
              </div>
            </div>

            {/* Content Input Area */}
            <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
              {/* Professional Text Area */}
              <div className="relative w-full max-w-full">
                <textarea
                  value={postText}
                  onChange={handleTextChange}
                  placeholder="What's on your mind? Share your thoughts, experiences, or ask a question..."
                  className={`w-full max-w-full resize-none border-none outline-none text-base sm:text-lg leading-relaxed bg-transparent transition-all duration-300 placeholder:transition-colors scroll-none overflow-hidden ${
                    theme === 'dark'
                      ? 'text-white placeholder-gray-500 focus:placeholder-gray-600'
                      : 'text-gray-900 placeholder-gray-500 focus:placeholder-gray-400'
                  }`}
                  rows={isExpanded ? 5 : 3}
                  style={{
                    minHeight: isExpanded ? '140px' : '80px',
                    maxHeight: '300px',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                  onFocus={() => setIsExpanded(true)}
                />
                
                {/* Floating Character Counter */}
                <AnimatePresence>
                  {postText.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute bottom-2 right-2 flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
                        charCount > maxChars * 0.9 
                          ? 'bg-red-500/20 border border-red-500/30' 
                          : charCount > maxChars * 0.7 
                          ? 'bg-orange-500/20 border border-orange-500/30'
                          : theme === 'dark'
                          ? 'bg-gray-800/80 border border-gray-700/50'
                          : 'bg-white/80 border border-gray-200/50'
                      }`}
                    >
                      <span className={`text-xs font-medium ${
                        charCount > maxChars * 0.9 
                          ? 'text-red-500' 
                          : charCount > maxChars * 0.7 
                          ? 'text-orange-500'
                          : theme === 'dark' 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                      }`}>
                        {charCount}/{maxChars}
                      </span>
                      
                      {/* Circular Progress */}
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke={
                              charCount > maxChars * 0.9 ? '#EF4444' :
                              charCount > maxChars * 0.7 ? '#F59E0B' : '#6B7280'
                            }
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 8}`}
                            strokeDashoffset={`${2 * Math.PI * 8 * (1 - Math.min(charCount / maxChars, 1))}`}
                            className="transition-all duration-300"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Attachments Section */}
        <div className='w-full p-4'>
        <AnimatePresence>
          {(selectedImages.length > 0 || location || isPollActive || isEventActive || isEmojiPickerOpen) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`w-full max-w-full`}
            >
              {/* Professional Media Preview */}
              {selectedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <Image className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Media Files
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {selectedImages.length} file{selectedImages.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedImages([])}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/30'
                          : 'text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200'
                      }`}
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Enhanced Media Grid */}
                  <div className={`grid gap-2 sm:gap-3 w-full max-w-full overflow-hidden ${
                    selectedImages.length === 1 ? 'grid-cols-1' :
                    selectedImages.length === 2 ? 'grid-cols-2' :
                    selectedImages.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                    'grid-cols-2 sm:grid-cols-3'
                  }`}>
                    {selectedImages.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <div className={`relative rounded-2xl overflow-hidden ${
                          selectedImages.length === 1 ? 'h-48' : 'h-32'
                        } ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                <Video className={`w-6 h-6 ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="text-center px-2">
                                <p className={`text-xs font-medium truncate ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {file.name}
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                          )}

                          {/* File Type Badge */}
                          <div className="absolute top-2 left-2">
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              file.type.startsWith('image/')
                                ? 'bg-blue-500/80 text-white'
                                : 'bg-purple-500/80 text-white'
                            }`}>
                              {file.type.startsWith('image/') ? 'IMG' : 'VID'}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow-lg transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>

                          {/* Overlay for extra files */}
                          {selectedImages.length > 6 && index === 5 && (
                            <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                              <div className="text-center">
                                <Plus className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-white font-bold text-lg">
                                  +{selectedImages.length - 6}
                                </span>
                                <p className="text-white/80 text-xs">more files</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Poll Section */}
              {isPollActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className={`px-6 py-5 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <BarChart3 className={`w-5 h-5 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Create Poll
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Ask your community a question
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsPollActive(false)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4 w-full max-w-full">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3 w-full max-w-full">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            className={`flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                            }`}
                          />
                          {pollOptions.length > 2 && (
                            <button
                              onClick={() => removePollOption(index)}
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-col space-y-4 pt-3 w-full max-w-full">
                        {pollOptions.length < 4 && (
                          <button
                            onClick={addPollOption}
                            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-xl border transition-all duration-200 w-full sm:w-auto ${
                              theme === 'dark'
                                ? 'border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-500'
                                : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">Add option</span>
                          </button>
                        )}

                        <div className="w-full max-w-full">
                          <div className="flex items-center space-x-2 mb-3">
                            <Clock className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Poll Duration
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full max-w-full">
                            {[
                              { value: '1', label: '1 day', icon: '📅' },
                              { value: '3', label: '3 days', icon: '📆' },
                              { value: '7', label: '1 week', icon: '🗓️' },
                              { value: '30', label: '1 month', icon: '📋' }
                            ].map((duration) => (
                              <motion.button
                                key={duration.value}
                                onClick={() => setPollDuration(duration.value)}
                                className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl text-xs font-semibold transition-all duration-300 min-w-0 ${
                                  pollDuration === duration.value
                                    ? theme === 'dark'
                                      ? 'bg-white text-black shadow-lg'
                                      : 'bg-black text-white shadow-lg'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="text-xs">{duration.icon}</span>
                                <span className="text-xs whitespace-nowrap">{duration.label}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Professional Location Display with Leaflet Map */}
              {location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className={`rounded-2xl border overflow-hidden shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Professional Map Preview */}
                    <div className="relative h-72 overflow-hidden">
                      <div
                        ref={mapRef}
                        className="w-full h-full"
                        style={{ zIndex: 1, minHeight: '288px' }}
                      />

                      {/* Professional Map Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Map Attribution */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <div className={`px-2 py-1 backdrop-blur-md rounded-lg text-xs font-medium shadow-sm ${
                          theme === 'dark'
                            ? 'bg-black/60 text-white border border-white/20'
                            : 'bg-white/80 text-gray-700 border border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Live Map</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Location Info */}
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <MapPin className={`w-6 h-6 ${
                              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold text-base ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {(() => {
                                const parts = location.address.split(',');
                                const city = parts[parts.length - 3]?.trim() || parts[0]?.trim();
                                const country = parts[parts.length - 1]?.trim();
                                return city && country ? `${city}, ${country}` : location.address.split(',')[0];
                              })()}
                            </p>
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {(() => {
                                const parts = location.address.split(',');
                                return parts.slice(0, -2).join(', ').trim() || 'Exact location';
                              })()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setLocation(null)}
                          className={`p-2.5 rounded-xl transition-all duration-200 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/30'
                              : 'text-gray-500 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200'
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Event Creation Section */}
              {isEventActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-6"
                >
                  <div className={`px-6 py-5 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <Calendar className={`w-5 h-5 ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Create Event
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Plan something with your community
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEventActive(false)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 w-full max-w-full">
                      <input
                        type="text"
                        placeholder="Event title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                        }`}
                      />

                      <textarea
                        placeholder="Event description (optional)"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                        }`}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        />
                        <input
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Emoji Picker Inside Attachments */}
              {isEmojiPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-6"
                >
                  <div className={`p-6 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Emoji Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <Smile className={`w-5 h-5 ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Add Emoji
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Express yourself with emojis
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEmojiPickerOpen(false)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Emoji Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type="text"
                          placeholder="Search emojis..."
                          value={emojiSearchQuery}
                          onChange={(e) => setEmojiSearchQuery(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Emoji Categories */}
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-4 overflow-x-auto scroll-none pb-2">
                      {Object.keys(emojiCategories).map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedEmojiCategory(category)}
                          className={`flex-shrink-0 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                            selectedEmojiCategory === category
                              ? theme === 'dark'
                                ? 'bg-white text-black'
                                : 'bg-black text-white'
                              : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Emoji Grid */}
                    <div className="max-h-40 sm:max-h-48 overflow-y-auto scroll-none px-2">
                      <div className="grid grid-cols-8 gap-2 w-full place-items-center">
                        {emojiCategories[selectedEmojiCategory as keyof typeof emojiCategories]
                          .filter(emoji =>
                            emojiSearchQuery === '' ||
                            emoji.includes(emojiSearchQuery)
                          )
                          .map((emoji, index) => (
                            <motion.button
                              key={index}
                              onClick={() => {
                                setPostText(prev => prev + emoji);
                                setCharCount(prev => prev + emoji.length);
                              }}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Professional Action Bar */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t w-full max-w-full ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'
        }`}>
          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Photo Upload */}
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                selectedImages.some(f => f.type.startsWith('image/'))
                  ? theme === 'dark'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Add photos"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Video Upload */}
            <motion.button
              onClick={() => videoInputRef.current?.click()}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                selectedImages.some(f => f.type.startsWith('video/'))
                  ? theme === 'dark'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-purple-50 text-purple-600 border border-purple-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Add videos"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Poll */}
            <motion.button
              onClick={() => setIsPollActive(!isPollActive)}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                isPollActive
                  ? theme === 'dark'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-green-50 text-green-600 border border-green-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Create a poll"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Emoji */}
            <motion.button
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                isEmojiPickerOpen
                  ? theme === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Add emoji"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Event */}
            <motion.button
              onClick={() => setIsEventActive(!isEventActive)}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                isEventActive
                  ? theme === 'dark'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-purple-50 text-purple-600 border border-purple-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Create event"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Location */}
            <motion.button
              onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
              className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
                location
                  ? theme === 'dark'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-orange-50 text-orange-600 border border-orange-200'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Add location"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>

          {/* Post Button */}
          <motion.button
            disabled={(!postText.trim() && selectedImages.length === 0) || isSubmitting || charCount > maxChars}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm transition-all duration-300 flex-shrink-0 ${
              postText.trim() || selectedImages.length > 0
                ? theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl'
                  : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={(!postText.trim() && selectedImages.length === 0) || isSubmitting ? {} : { scale: 1.02 }}
            whileTap={(!postText.trim() && selectedImages.length === 0) || isSubmitting ? {} : { scale: 0.98 }}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  theme === 'dark' ? 'border-black' : 'border-white'
                }`} />
                <span>Publishing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Post</span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept="video/*"
        onChange={handleImageUpload}
        className="hidden"
      />



      {/* Professional Location Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLocationModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Location Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Add Location
                </h3>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Location Content */}
              <div className="p-6">
                <button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isGettingLocation
                      ? theme === 'dark'
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isGettingLocation ? (
                    <>
                      <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                        theme === 'dark' ? 'border-gray-500' : 'border-gray-400'
                      }`} />
                      <span>Getting location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreatePost;
