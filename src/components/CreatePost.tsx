import React, { useState, useRef, useEffect } from 'react';
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('recent');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [addedEvent, setAddedEvent] = useState<null | { title: string; description: string; date: string; location: string }>(null);
  const { theme } = useTheme();
  const maxChars = 500;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map when location changes
  useEffect(() => {
    if (location && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView([location.lat, location.lng], 15);
      
      // Add tile layer based on theme
      const tileLayer = L.tileLayer(
        theme === 'dark' 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors',
          subdomains: 'abcd',
          maxZoom: 19
        }
      ).addTo(map);

      // Add marker
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      
      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else if (location && mapInstanceRef.current) {
      // Update existing map
      mapInstanceRef.current.setView([location.lat, location.lng], 15);
      markerRef.current?.setLatLng([location.lat, location.lng]);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [location, theme]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPostText(text);
    setCharCount(text.length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    setSelectedImages(prev => [...prev, ...imageFiles, ...videoFiles]);
  };

  const removeImage = (index: number) => {
    setTimeout(() => {
      setSelectedImages(prev => {
        const newImages = [...prev];
        newImages.splice(index, 1);
        return newImages;
      });
    }, 50);
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
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
          setLocation({
            address: data.display_name,
            lat: latitude,
            lng: longitude
          });
          setIsLocationModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && selectedImages.length === 0) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPostText('');
    setSelectedImages([]);
    setIsExpanded(false);
    setIsPollActive(false);
    setPollOptions(['', '']);
    setCharCount(0);
    setLocation(null);
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
    { value: '1 month', label: '1 month' },
  ];

  const popularLocations = [
    { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
    { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
    { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 }
  ];

  const handleManualLocationSubmit = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocation({
          address: display_name,
          lat: parseFloat(lat),
          lng: parseFloat(lon)
        });
        setIsLocationModalOpen(false);
      } else {
        setLocation({
          address: address,
          lat: 37.7749,
          lng: -122.4194
        });
        setIsLocationModalOpen(false);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setLocation({
        address: address,
        lat: 37.7749,
        lng: -122.4194
      });
      setIsLocationModalOpen(false);
    }
  };

  const emojiCategories = {
    recent: ['😊', '😂', '❤️', '🔥', '👍', '🎉', '✨', '💪', '😍', '🤔', '😎', '🥳', '💯', '🚀', '💖', '😌', '🤗', '😇', '🤩', '😋', '🥰', '😘', '🤗', '😊', '🥺', '😭', '😤', '😡', '🤬', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦋', '🐛', '🐌', '🐞', '🐜', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍷', '🥂', '🥃', '🍸', '🍹', '🧉', '🍾', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🤼‍♀️', '🤼', '🤸‍♀️', '🤸', '⛹️‍♀️', '⛹️', '🤺', '🤾‍♀️', '🤾', '🏌️‍♀️', '🏌️', '🏇', '🧘‍♀️', '🧘', '🏄‍♀️', '🏄', '🏊‍♀️', '🏊', '🤽‍♀️', '🤽', '🚣‍♀️', '🚣', '🏊‍♀️', '🏊', '🚴‍♀️', '🚴', '🚵‍♀️', '🚵', '🎯', '🎮', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎪', '🎟️', '🎫', '🎗️', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚜️', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🛵', '🛺', '🚲', '🛞', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🚧', '⛽', '🚏', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '��️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺', '🏔️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺', '🏔️', '🗻', '⛰️', '🌋', '🗾', '🏕️', '⛺'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🎮', '🎰', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '📺', '📻', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🪃', '🏹', '🛡️', '🪄', '🔮', '🧿', '🪬', '📿', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎀', '🪄', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚜️', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠', '🔰', '🔱', '⭕', '❌', '🚫', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '💢', '💯', '💢', '♨️', '💠'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🩹', '🩺', '🩻', '🩼', '🩽', '🩾', '🩿', '🪿', '🫁', '🫂', '🫃', '🫄', '🫅', '🫆', '🫇', '🫈', '🫉', '🫊', '🫋', '🫌', '🫍', '🫎', '🫏']
  };

  return (
    <>
      <motion.div 
        className={`rounded-2xl shadow-lg border p-4 sm:p-6 mb-6 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-800 shadow-gray-900/20' 
            : 'bg-white border-gray-200 shadow-gray-900/10'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          y: -2,
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="flex space-x-3 sm:space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
          <img
            src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="Your avatar"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Audience Selector */}
            <div className="mb-3">
              <motion.button
                className={`flex items-center space-x-2 transition-colors text-sm font-medium ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
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
              className={`w-full resize-none border-none outline-none text-lg leading-relaxed bg-transparent transition-all duration-200 ${
                theme === 'dark' 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              }`}
              rows={isExpanded ? 4 : 3}
              style={{ minHeight: isExpanded ? '120px' : '90px' }}
            />
        {/* Character Count & Progress */}
        <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm">
                <span className={`font-medium ${
                  charCount > maxChars * 0.8 
                    ? charCount > maxChars * 0.9 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                    : theme === 'dark' 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  {charCount}/{maxChars}
                </span>
                {charCount > maxChars * 0.9 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-1 text-red-500"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Character limit approaching</span>
                  </motion.div>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className={`w-24 h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  className={`h-full rounded-full ${
                    charCount > maxChars * 0.9 ? 'bg-red-500' : 
                    charCount > maxChars * 0.7 ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Location Display with Leaflet Map */}
            {location && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="mt-6 relative group"
              >
                <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-white border-gray-200'
                }`}>
                  {/* Leaflet Map Container */}
                  <div className={`relative h-36 overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                    <div 
                      ref={mapRef} 
                      className="w-full h-full"
                      style={{ zIndex: 1 }}
                    />
                    
                    {/* Map Attribution */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <div className={`px-2 py-1 backdrop-blur-sm rounded text-xs font-medium shadow-sm ${
                        theme === 'dark'
                          ? 'bg-gray-800/90 text-gray-300'
                          : 'bg-white/90 text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <MapPin className={`w-3 h-3 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`} />
                          <span>Leaflet Map</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Info */}
                  <div className="flex items-center space-x-5 p-6">
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                        theme === 'dark'
                          ? 'bg-gray-800'
                          : 'bg-gray-200'
                      }`}>
                        <MapPin className="w-7 h-7 text-gray-700 dark:text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Location</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{location.address}</div>
                    </div>
                    <motion.button
                      onClick={() => setLocation(null)}
                      className={`flex-shrink-0 p-2 rounded-full transition-all z-10 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selected Images Preview */}
            <AnimatePresence>
              {selectedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {selectedImages.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative group select-none cursor-pointer"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-24 sm:h-32 object-cover rounded-xl pointer-events-none"
                          draggable={false}
                        />
                      ) : (
                        <div className={`w-full h-24 sm:h-32 rounded-xl flex items-center justify-center pointer-events-none ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                        }`}>
                          <Video className={`w-8 h-8 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`ml-2 text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>{file.name}</span>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
                          theme === 'dark'
                            ? 'bg-gray-900/90 hover:bg-red-500 text-white'
                            : 'bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white'
                        } shadow-lg hover:shadow-xl`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                      
                      {/* Image Number Badge */}
                      <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium pointer-events-none ${
                        theme === 'dark'
                          ? 'bg-gray-900/90 text-white'
                          : 'bg-white/90 text-gray-700'
                      } shadow-lg`}>
                        {index + 1}
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none ${
                        theme === 'dark'
                          ? 'bg-black/0 group-hover:bg-black/30'
                          : 'bg-black/0 group-hover:bg-black/10'
                      }`} />
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
                  className={`mt-6 p-6 rounded-2xl border shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
                      : 'bg-gradient-to-br from-gray-50/80 to-gray-100/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <BarChart3 className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`} />
                      </div>
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Create Poll</h3>
                    </div>
                    <motion.button
                      onClick={() => setIsPollActive(false)}
                      className={`p-2 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                      }`}
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
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white/90 border-gray-200 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        {pollOptions.length > 2 && (
                          <motion.button
                            onClick={() => removePollOption(index)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              theme === 'dark'
                                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
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
                        className={`flex items-center space-x-2 text-sm font-medium p-3 rounded-xl transition-all ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add option</span>
                      </motion.button>
                    )}
                    
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'
                    }`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <Clock className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Poll duration</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {pollDurations.map(duration => (
                          <motion.button
                            key={duration.value}
                            onClick={() => setPollDuration(duration.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              pollDuration === duration.value
                                ? theme === 'dark'
                                  ? 'bg-gray-700 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-800 shadow-sm'
                                : theme === 'dark'
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {duration.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

                    {/* Event Display */}
      {addedEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="mt-6 relative group"
        >
          <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-5 p-6">
              <div className="flex-shrink-0">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-gray-200'
                }`}>
                  <Calendar className="w-7 h-7 text-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{addedEvent.title}</div>
                <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{addedEvent.description}</div>
                <div className="flex items-center space-x-3 text-xs font-medium">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{addedEvent.date ? new Date(addedEvent.date).toLocaleString() : ''}</span>
                  </div>
                  {addedEvent.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{addedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <motion.button
                onClick={() => setAddedEvent(null)}
                className={`flex-shrink-0 p-2 rounded-full transition-all z-10 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

          {/* Action Buttons */}
          <div className={`flex items-center justify-between mt-6 pt-6 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
          }`}>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Image Upload */}
              <motion.button
                className={`flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl ${
                  theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <Image className="w-5 h-5" />
                <span className="hidden sm:inline text-sm select-none">Photo</span>
              </motion.button>

              {/* Video Upload */}
              <motion.button
                className={`flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl ${
                  theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <Video className="w-5 h-5" />
                <span className="hidden sm:inline text-sm select-none">Video</span>
              </motion.button>

              {/* Poll */}
              <motion.button
                className={`flex items-center space-x-2 transition-colors p-2 rounded-xl ${
                  isPollActive 
                    ? theme === 'dark'
                      ? 'text-white bg-gray-700'
                      : 'text-gray-900 bg-gray-200'
                    : `text-gray-500 hover:text-gray-700 ${
                        theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                      }`
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
                className={`flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl ${
                  theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                }`}
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
                    ? theme === 'dark'
                      ? 'text-white bg-gray-700'
                      : 'text-gray-900 bg-gray-200'
                    : `text-gray-500 hover:text-gray-700 ${
                        theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                      }`
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
                className={`flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl ${
                  theme === 'dark' ? 'hover:bg-gray-800 hover:text-gray-200' : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEventModalOpen(true)}
                type="button"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline text-sm select-none">Event</span>
              </motion.button>
            </div>
            
                        {/* Submit Button */}
            <motion.button 
              disabled={(!postText.trim() && selectedImages.length === 0) || isSubmitting || charCount > maxChars}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                postText.trim() || selectedImages.length > 0
                  ? theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
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

                    {/* Ultra-Compact Emoji Picker Modal */}
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`rounded-2xl w-full max-w-lg shadow-2xl border overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Compact Header */}
              <div className={`flex items-center justify-between p-4 ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center space-x-2">
                  <Smile className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Emojis</h3>
                </div>
                <button
                  onClick={() => setIsEmojiPickerOpen(false)}
                  className={`p-1.5 rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compact Search Bar */}
              <div className="p-4 pb-3">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={emojiSearchQuery}
                    onChange={(e) => setEmojiSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/10 focus:border-gray-400 transition-all text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Compact Category Tabs */}
              <div className="px-4 pb-3">
                <div className="grid grid-cols-5 gap-1">
                  {Object.keys(emojiCategories).map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedEmojiCategory(category)}
                      className={`flex items-center justify-center px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedEmojiCategory === category
                          ? theme === 'dark'
                            ? 'bg-gray-700 text-white shadow-sm'
                            : 'bg-gray-200 text-gray-800 shadow-sm'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">
                        {category === 'recent' && '🕒'}
                        {category === 'smileys' && '😊'}
                        {category === 'nature' && '🌿'}
                        {category === 'food' && '🍕'}
                        {category === 'activities' && '⚽'}
                        {category === 'travel' && '✈️'}
                        {category === 'objects' && '💻'}
                        {category === 'symbols' && '❤️'}
                        {category === 'flags' && '🏁'}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Ultra-Compact Emoji Grid */}
              <div className="px-4 pb-4">
                <div className={`grid grid-cols-8 gap-1 rounded-xl p-3 ${
                  theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'
                }`}>
                  {emojiCategories[selectedEmojiCategory as keyof typeof emojiCategories]
                    .filter(emoji => 
                      emojiSearchQuery === '' || 
                      emoji.includes(emojiSearchQuery)
                    )
                    .slice(0, 48) // 6 rows x 8 columns for compact layout
                    .map((emoji, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setPostText(prev => prev + emoji);
                          setIsEmojiPickerOpen(false);
                        }}
                        className={`w-8 h-8 text-lg rounded-lg transition-all flex items-center justify-center ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-700 hover:scale-110' 
                            : 'hover:bg-white hover:scale-110'
                        }`}
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
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Add Location</h3>
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

              <div className="space-y-6">
                {/* Current Location Button */}
                                  <motion.button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className={`w-full flex items-center space-x-3 p-4 border rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'border-gray-600 hover:bg-gray-800'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <MapPin className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`} />
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isGettingLocation ? 'Getting location...' : 'Use current location'}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Automatically detect your location</div>
                  </div>
                                      {isGettingLocation && (
                      <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ml-auto ${
                        theme === 'dark' ? 'border-gray-400' : 'border-gray-500'
                      }`} />
                    )}
                </motion.button>

                {/* Manual Input */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Or enter location manually
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter city, address, or place..."
                      value={manualLocationInput}
                      onChange={(e) => setManualLocationInput(e.target.value)}
                      className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <motion.button
                      onClick={() => handleManualLocationSubmit(manualLocationInput)}
                      disabled={!manualLocationInput.trim()}
                      className={`px-4 py-3 rounded-xl transition-all ${
                        manualLocationInput.trim()
                          ? theme === 'dark'
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-800 text-white hover:bg-gray-900'
                          : theme === 'dark'
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={manualLocationInput.trim() ? { scale: 1.02 } : {}}
                      whileTap={manualLocationInput.trim() ? { scale: 0.98 } : {}}
                    >
                      Add
                    </motion.button>
                  </div>
                </div>

                {/* Popular Locations */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Popular locations
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {popularLocations.map((loc) => (
                      <motion.button
                        key={loc.name}
                        onClick={() => {
                          setLocation({
                            address: loc.name,
                            lat: loc.lat,
                            lng: loc.lng
                          });
                          setIsLocationModalOpen(false);
                        }}
                        className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm transition-all text-left group border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="font-medium truncate">{loc.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => setIsLocationModalOpen(false)}
                    className={`flex-1 px-4 py-3 border rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'text-gray-300 border-gray-600 hover:bg-gray-800'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => setIsLocationModalOpen(false)}
                    className={`flex-1 px-4 py-3 rounded-xl transition-all shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
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
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Who can see this post?</h3>
              <div className="space-y-4">
                {audienceOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                      audience === option.value
                        ? theme === 'dark'
                          ? 'border-gray-600 bg-gray-800 shadow-lg'
                          : 'border-gray-300 bg-gray-50 shadow-lg'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setAudience(option.value as any);
                      setIsExpanded(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                                        <div className={`p-2 rounded-lg ${
                      audience === option.value
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <option.icon className={`w-5 h-5 ${
                        audience === option.value 
                          ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{option.label}</div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{option.description}</div>
                    </div>
                    {audience === option.value && (
                      <CheckCircle className={`w-5 h-5 ml-auto ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`} />
                    )}
                  </motion.button>
                ))}
    </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEventModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-0 w-full max-w-md shadow-2xl border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Event</h3>
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-6 pb-4 pt-2">
                <div className="space-y-5">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Event Title</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={e => setEventTitle(e.target.value)}
                      placeholder="Enter event title"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <textarea
                      value={eventDescription}
                      onChange={e => setEventDescription(e.target.value)}
                      placeholder="Event description"
                      rows={2}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={e => setEventLocation(e.target.value)}
                      placeholder="Event location"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 left-0 right-0 bg-inherit px-6 pb-6 pt-4 z-10">
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setIsEventModalOpen(false)}
                    className={`flex-1 px-4 py-3 border rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'text-gray-300 border-gray-600 hover:bg-gray-800'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAddedEvent({
                        title: eventTitle,
                        description: eventDescription,
                        date: eventDate,
                        location: eventLocation,
                      });
                      setIsEventModalOpen(false);
                      setEventTitle('');
                      setEventDescription('');
                      setEventDate('');
                      setEventLocation('');
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl transition-all shadow-lg font-semibold ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-900'
                        : 'bg-gray-900 text-white hover:bg-black'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Event
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      </motion.div>
    </>
  );
};

export default CreatePost;