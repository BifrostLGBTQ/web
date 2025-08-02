import React, { useState, useRef } from 'react';
import { 
  Image, 
  Smile, 
  MapPin, 
  Calendar, 
  Hash, 
  Users, 
  Globe, 
  Lock, 
  X, 
  Video, 
  FileText, 
  BarChart3,
  AtSign,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Clock,
  GripVertical,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const CreatePost: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [audience, setAudience] = useState<'public' | 'community' | 'private'>('public');
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('1 day');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [location, setLocation] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('recent');
  const { theme } = useTheme();
  const maxChars = 500;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPostText(text);
    setCharCount(text.length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    // Sınırsız medya seçimi (resim + video)
    setSelectedImages(prev => [...prev, ...imageFiles, ...videoFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option));
  };

  const handleLocationClick = () => {
    setIsLocationModalOpen(true);
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding using a free service
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
          setLocation(data.display_name);
          setIsLocationModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to manual input
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && selectedImages.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form
    setPostText('');
    setSelectedImages([]);
    setIsExpanded(false);
    setIsPollActive(false);
    setPollOptions(['', '']);
    setCharCount(0);
    setLocation('');
    setIsSubmitting(false);
  };

  const audienceOptions = [
    { value: 'public', icon: Globe, label: 'Everyone', description: 'Anyone can see this post' },
    { value: 'community', icon: Users, label: 'Community', description: 'Only community members can see this post' },
    { value: 'private', icon: Lock, label: 'Private', description: 'Only you can see this post' },
  ];

  const pollDurations = [
    { value: '1 hour', label: '1 hour' },
    { value: '6 hours', label: '6 hours' },
    { value: '1 day', label: '1 day' },
    { value: '3 days', label: '3 days' },
    { value: '1 week', label: '1 week' },
  ];

  const popularLocations = [
    'San Francisco, CA',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Miami, FL',
    'Austin, TX',
    'Seattle, WA',
    'Denver, CO'
  ];

  const emojiCategories = {
    recent: ['😊', '😂', '❤️', '🔥', '👍', '🎉', '✨', '💪', '😍', '🤔', '😎', '🥳', '💯', '🚀', '💖', '😌', '🤗', '😇', '🤩', '😋', '🥰', '😘', '🤗', '😊'],
    smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦋', '🐛', '🐌', '🐞', '🐜', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🍾', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🤼‍♀️', '🤼', '🤸‍♀️', '🤸', '⛹️‍♀️', '⛹️', '🤺', '🤾‍♀️', '🤾', '🏌️‍♀️', '🏌️', '🏇', '🧘‍♀️', '🧘', '🏄‍♀️', '🏄', '🏊‍♀️', '🏊', '🤽‍♀️', '🤽', '🚣‍♀️', '🚣', '🏊‍♀️', '🏊', '🚴‍♀️', '🚴', '🚵‍♀️', '🚵', '🎯', '🎮', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎪', '🎟️', '🎫', '🎗️', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚜️', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🛵', '🛺', '🚲', '🛞', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🚧', '⛽', '🚏', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏔️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺', '🏔️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺', '🏔️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🎮', '🎰', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '📺', '📻', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🪃', '🏹', '🛡️', '🪄', '🔮', '🧿', '🪬', '📿', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎀', '🪄', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚜️', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  };

  return (
    <motion.div 
      className={`rounded-2xl shadow-sm border p-4 sm:p-6 mb-6 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
        <img
          src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
          alt="Your avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-100"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Audience Selector */}
          <div className="mb-3">
            <motion.button
              className={`flex items-center space-x-2 transition-colors text-sm font-medium ${
                theme === 'dark' 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-600 hover:text-red-700'
              }`}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {audienceOptions.find(opt => opt.value === audience)?.icon && 
                React.createElement(audienceOptions.find(opt => opt.value === audience)!.icon, { className: "w-4 h-4" })
              }
              <span>{audienceOptions.find(opt => opt.value === audience)?.label}</span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>•</span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Anyone can reply</span>
            </motion.button>
          </div>

          {/* Text Area */}
          <textarea
            value={postText}
            onChange={handleTextChange}
            placeholder="What's happening in your professional world? Share your thoughts, achievements, or insights..."
            className={`w-full resize-none border-none outline-none text-lg leading-relaxed bg-transparent ${
              theme === 'dark' 
                ? 'text-white placeholder-gray-400' 
                : 'text-gray-900 placeholder-gray-500'
            }`}
            rows={isExpanded ? 4 : 3}
            style={{ minHeight: isExpanded ? '120px' : '90px' }}
          />

          {/* Location Display */}
          {location && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mt-3 relative group"
            >
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl shadow-sm overflow-hidden">
                {/* Map Preview */}
                <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/30" />
                  
                  {/* Streets Grid */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="grid grid-cols-6 grid-rows-4 h-full">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="border border-gray-400/40" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Main Streets */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400/60" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400/60" />
                  </div>
                  
                  {/* Buildings */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/6 w-3 h-4 bg-gray-300/70 rounded-sm" />
                    <div className="absolute top-1/4 right-1/6 w-4 h-3 bg-gray-400/80 rounded-sm" />
                    <div className="absolute bottom-1/4 left-1/3 w-3 h-5 bg-gray-300/60 rounded-sm" />
                    <div className="absolute bottom-1/4 right-1/3 w-5 h-3 bg-gray-400/70 rounded-sm" />
                  </div>
                  
                  {/* Location Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-red-500" />
                    </div>
                  </div>
                  
                  {/* Map Attribution */}
                  <div className="absolute bottom-2 right-2">
                    <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs text-gray-600 font-medium shadow-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>Location</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location Info */}
                <div className="flex items-center space-x-3 p-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-emerald-700">Location</div>
                    <div className="text-sm text-gray-600 truncate">{location}</div>
                  </div>
                  <motion.button
                    onClick={() => setLocation('')}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          )}

          {/* Character Count & Progress */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className={charCount > maxChars * 0.8 ? 'text-orange-500' : ''}>
                {charCount}/{maxChars}
              </span>
              {charCount > maxChars * 0.9 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1 text-orange-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Character limit approaching</span>
                </motion.div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  charCount > maxChars * 0.9 ? 'bg-red-500' : 
                  charCount > maxChars * 0.7 ? 'bg-orange-500' : 'bg-emerald-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Selected Images Preview */}
          <AnimatePresence>
            {selectedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {selectedImages.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group"
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-600">{file.name}</span>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-xl transition-all duration-200" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll Section */}
          <AnimatePresence>
            {isPollActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">Create Poll</h3>
                  </div>
                  <motion.button
                    onClick={() => setIsPollActive(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  {pollOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white/80 backdrop-blur-sm"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400">
                          {index + 1}
                        </div>
                      </div>
                      {pollOptions.length > 2 && (
                        <motion.button
                          onClick={() => removePollOption(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                  
                  {pollOptions.length < 4 && (
                    <motion.button
                      onClick={addPollOption}
                      className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium p-3 hover:bg-emerald-100 rounded-xl transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add option</span>
                    </motion.button>
                  )}
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Poll duration:</span>
                    <select
                      value={pollDuration}
                      onChange={(e) => setPollDuration(e.target.value)}
                      className="px-3 py-1 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      {pollDurations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Image Upload */}
              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors p-2 rounded-xl hover:bg-emerald-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Photo</span>
              </motion.button>

              {/* Video Upload */}
              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors p-2 rounded-xl hover:bg-emerald-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Video</span>
              </motion.button>

              {/* Poll */}
              <motion.button
                className={`flex items-center space-x-2 transition-colors p-2 rounded-xl ${
                  isPollActive 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPollActive(!isPollActive)}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Poll</span>
              </motion.button>

              {/* Emoji */}
              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors p-2 rounded-xl hover:bg-emerald-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEmojiPickerOpen(true)}
              >
                <Smile className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Mood</span>
              </motion.button>

              {/* Location */}
              <motion.button
                className={`flex items-center space-x-2 transition-colors p-2 rounded-xl ${
                  location 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLocationClick}
              >
                <MapPin className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Location</span>
              </motion.button>

              {/* Event */}
              <motion.button
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors p-2 rounded-xl hover:bg-emerald-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Event</span>
              </motion.button>
            </div>
            
            {/* Submit Button */}
            <motion.button 
              disabled={(!postText.trim() && selectedImages.length === 0) || isSubmitting || charCount > maxChars}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                postText.trim() || selectedImages.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              whileHover={(!postText.trim() && selectedImages.length === 0) || isSubmitting ? {} : { scale: 1.05 }}
              whileTap={(!postText.trim() && selectedImages.length === 0) || isSubmitting ? {} : { scale: 0.95 }}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Share</span>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Emoji Picker Modal */}
      <AnimatePresence>
        {isEmojiPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEmojiPickerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose Mood</h3>
                <button
                  onClick={() => setIsEmojiPickerOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emojis..."
                    value={emojiSearchQuery}
                    onChange={(e) => setEmojiSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                </div>

                {/* Category Tabs */}
                <div className="flex space-x-1 overflow-x-auto pb-2">
                  {Object.keys(emojiCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedEmojiCategory(category)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedEmojiCategory === category
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
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
                          setIsEmojiPickerOpen(false);
                        }}
                        className="w-10 h-10 text-xl hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Selection Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLocationModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Location</h3>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Current Location Button */}
                <motion.button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full flex items-center space-x-3 p-4 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {isGettingLocation ? 'Getting location...' : 'Use current location'}
                    </div>
                    <div className="text-sm text-gray-500">Automatically detect your location</div>
                  </div>
                  {isGettingLocation && (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin ml-auto" />
                  )}
                </motion.button>

                {/* Manual Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter location manually
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city, address, or place..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                </div>

                {/* Popular Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular locations
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {popularLocations.map((loc) => (
                      <motion.button
                        key={loc}
                        onClick={() => {
                          setLocation(loc);
                          setIsLocationModalOpen(false);
                        }}
                        className="p-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loc}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => setIsLocationModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => setIsLocationModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Location
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audience Selection Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Who can see this post?</h3>
              <div className="space-y-3">
                {audienceOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                      audience === option.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setAudience(option.value as any);
                      setIsExpanded(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <option.icon className={`w-5 h-5 ${
                      audience === option.value ? 'text-emerald-600' : 'text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    {audience === option.value && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto" />
                    )}
                  </motion.button>
                ))}
    </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreatePost;