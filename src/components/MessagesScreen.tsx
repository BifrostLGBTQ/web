import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageCircle, 
  User, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  Smile,
  Paperclip,
  Mic,
  Globe,
  Check,
  CheckCheck,
  ArrowLeft,
  Star,
  Volume2,
  Info,
  Menu,
  X
} from 'lucide-react';

const MessagesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'groups' | 'private'>('groups');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (!selectedChat && isMobile) {
      setShowSidebar(true);
    }
    if (selectedChat && isMobile) {
      setShowSidebar(false);
    }
  }, [selectedChat, isMobile]);

  const groupChats = [
    {
      id: 'taiwan',
      name: 'Taiwan Pride Community',
      flag: '🇹🇼',
      members: 1247,
      lastMessage: 'Happy Pride everyone! 🏳️‍🌈',
      lastTime: '2m',
      unread: 3,
      online: 89,
      pinned: true
    },
    {
      id: 'thailand',
      name: 'Thailand LGBTQ+ Network',
      flag: '🇹🇭',
      members: 892,
      lastMessage: 'Great event yesterday!',
      lastTime: '15m',
      unread: 0,
      online: 45,
      pinned: false
    },
    {
      id: 'turkey',
      name: 'Türkiye Pride Community',
      flag: '🇹🇷',
      members: 2156,
      lastMessage: 'Supporting each other! 💪',
      lastTime: '1h',
      unread: 7,
      online: 156,
      pinned: true
    },
    {
      id: 'japan',
      name: 'Japan Rainbow Network',
      flag: '🇯🇵',
      members: 678,
      lastMessage: 'Beautiful day for celebration!',
      lastTime: '2h',
      unread: 0,
      online: 34,
      pinned: false
    },
    {
      id: 'china',
      name: 'China Pride Alliance',
      flag: '🇨🇳',
      members: 1890,
      lastMessage: 'Love is love! ❤️',
      lastTime: '3h',
      unread: 12,
      online: 203,
      pinned: false
    }
  ];

  const privateChats = [
    {
      id: 'alex',
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'Thanks for the support!',
      lastTime: '5m',
      unread: 2,
      online: true,
      verified: true
    },
    {
      id: 'sam',
      name: 'Sam Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'See you at the event!',
      lastTime: '1h',
      unread: 0,
      online: false,
      verified: false
    },
    {
      id: 'jordan',
      name: 'Jordan Lee',
      avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'Amazing community!',
      lastTime: '2h',
      unread: 1,
      online: true,
      verified: true
    }
  ];

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '🏳️‍🌈', '💪', '😍', '🤔', '😭', '😡', '🤗', '👏', '🙏', '💖', '💕', '💔', '😎', '🤩', '😴', '🤯', '🥳', '😇', '🤠', '👻', '🤖', '👽', '👾'];

  const selectedGroupChat = groupChats.find(chat => chat.id === selectedChat);
  const selectedPrivateChat = privateChats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      setMessage('');
      setSelectedFiles([]);
      setIsTyping(false);
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowSidebar(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="h-full w-full flex-1 overflow-hidden flex">
        <div className="flex h-full w-full flex-1 overflow-hidden">
          {/* Sidebar - Responsive Design */}
          <div className={`absolute lg:relative inset-0 z-40 lg:z-auto w-full lg:w-80 border-r ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          } ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            {/* Header */}
            <div className={`p-3 sm:p-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h1 className={`text-lg sm:text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Messages</h1>
                <motion.button 
                  onClick={() => setShowSidebar(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="lg:hidden p-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Search */}
              <div className="mt-3 sm:mt-4 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <motion.button
                onClick={() => setActiveTab('groups')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-sm font-medium transition-colors ${
                  activeTab === 'groups'
                    ? theme === 'dark'
                      ? 'text-white border-b-2 border-gray-300'
                      : 'text-gray-900 border-b-2 border-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Groups
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('private')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-sm font-medium transition-colors ${
                  activeTab === 'private'
                    ? theme === 'dark'
                      ? 'text-white border-b-2 border-gray-300'
                      : 'text-gray-900 border-b-2 border-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Private
              </motion.button>
            </div>

            {/* Chat List */}
            <div className="h-[calc(100%-120px)] sm:h-[calc(100%-140px)] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === 'groups' ? (
                  <motion.div
                    key="groups"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-0"
                  >
                    {groupChats.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-center p-8">
                        No group chats found.
                      </div>
                    ) : groupChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`p-3 sm:p-4 cursor-pointer transition-colors border-b ${
                          theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                        } ${
                          selectedChat === chat.id
                            ? theme === 'dark'
                              ? 'bg-gray-800'
                              : 'bg-gray-100'
                            : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="text-xl sm:text-2xl flex-shrink-0">{chat.flag}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                                <h3 className={`font-semibold truncate text-sm sm:text-base ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{chat.name}</h3>
                                {chat.pinned && (
                                  <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <span className={`text-xs flex-shrink-0 ml-1 sm:ml-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{chat.lastTime}</span>
                            </div>
                            <p className={`text-xs sm:text-sm truncate mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{chat.lastMessage}</p>
                            <div className="flex items-center justify-between mt-1 sm:mt-2">
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}>{chat.members} members • {chat.online} online</span>
                              {chat.unread > 0 && (
                                <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-0"
                  >
                    {privateChats.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-center p-8">
                        No private chats found.
                      </div>
                    ) : privateChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`p-3 sm:p-4 cursor-pointer transition-colors border-b ${
                          theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                        } ${
                          selectedChat === chat.id
                            ? theme === 'dark'
                              ? 'bg-gray-800'
                              : 'bg-gray-100'
                            : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            {chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            {chat.verified && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 border-2 border-white rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-semibold truncate text-sm sm:text-base ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{chat.name}</h3>
                              <span className={`text-xs flex-shrink-0 ml-1 sm:ml-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{chat.lastTime}</span>
                            </div>
                            <p className={`text-xs sm:text-sm truncate mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                              <div className="flex justify-end mt-1 sm:mt-2">
                                <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                                  {chat.unread}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full w-full relative z-10">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className={`p-3 sm:p-4 border-b relative z-[60] ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      {/* Mobile menu button */}
                      <motion.button 
                        onClick={() => setShowSidebar(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="lg:hidden p-2 rounded-lg flex-shrink-0"
                      >
                        <Menu className="w-5 h-5" />
                      </motion.button>
                      
                      {activeTab === 'groups' && selectedGroupChat ? (
                        <>
                          <div className="text-xl sm:text-2xl flex-shrink-0">{selectedGroupChat.flag}</div>
                          <div className="min-w-0 flex-1">
                            <h2 className={`font-semibold truncate text-sm sm:text-base ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{selectedGroupChat.name}</h2>
                            <p className={`text-xs sm:text-sm truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{selectedGroupChat.members} members • {selectedGroupChat.online} online</p>
                          </div>
                        </>
                      ) : selectedPrivateChat ? (
                        <>
                          <div className="relative flex-shrink-0">
                            <img
                              src={selectedPrivateChat.avatar}
                              alt={selectedPrivateChat.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                            {selectedPrivateChat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            {selectedPrivateChat.verified && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 border-2 border-white rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className={`font-semibold truncate text-sm sm:text-base ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{selectedPrivateChat.name}</h2>
                            <p className={`text-xs sm:text-sm truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{selectedPrivateChat.online ? 'Online' : 'Offline'}</p>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Info className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-hide ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900' 
                    : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'
                }`}>
                  <div className="space-y-1.5 sm:space-y-2 max-w-4xl mx-auto">
                    {/* Sample messages */}
                    <div className="flex justify-end group">
                      <div className={`max-w-[75%] sm:max-w-xs md:max-w-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                        theme === 'dark' 
                          ? 'bg-[#3390ec] text-white' 
                          : 'bg-[#3390ec] text-white'
                      }`}>
                        <p className="text-sm leading-relaxed mb-0.5">Hello! How are you doing? 😊</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          <span className="text-[10px] opacity-75">2:30 PM</span>
                          <CheckCheck className="w-3 h-3 opacity-75" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start group">
                      <div className={`max-w-[75%] sm:max-w-xs md:max-w-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                        theme === 'dark' 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-white text-gray-900'
                      } shadow-sm`}>
                        <p className="text-sm leading-relaxed mb-0.5">I'm doing great! Thanks for asking. How about you?</p>
                        <div className="flex items-center mt-1">
                          <span className="text-[10px] opacity-75">2:32 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end group">
                      <div className={`max-w-[75%] sm:max-w-xs md:max-w-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                        theme === 'dark' 
                          ? 'bg-[#3390ec] text-white' 
                          : 'bg-[#3390ec] text-white'
                      }`}>
                        <p className="text-sm leading-relaxed mb-0.5">Amazing! The community is so supportive here! 🏳️‍🌈</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          <span className="text-[10px] opacity-75">2:35 PM</span>
                          <CheckCheck className="w-3 h-3 opacity-75" />
                        </div>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className={`max-w-[75%] sm:max-w-xs md:max-w-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
                          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        } shadow-sm`}>
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                              }`}></div>
                              <div className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                              }`} style={{ animationDelay: '0.2s' }}></div>
                              <div className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                              }`} style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className={`p-3 sm:p-4 border-t relative z-[60] ${
                    theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <Paperclip className="w-4 h-4" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm truncate ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{file.name}</p>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => removeFile(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1 rounded ${
                              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className={`p-3 sm:p-4 border-t relative z-[60] ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    <motion.button 
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <Paperclip className="w-4 h-4" />
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <motion.button 
                      onClick={() => imageInputRef.current?.click()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <Image className="w-4 h-4" />
                    </motion.button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className={`w-full pl-4 pr-12 py-2 sm:py-3 rounded-xl border text-sm ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <motion.button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                        }`}
                      >
                        <Smile className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!message.trim() && selectedFiles.length === 0}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        (message.trim() || selectedFiles.length > 0)
                          ? theme === 'dark'
                            ? 'bg-gray-800'
                            : 'bg-gray-900'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className={`mt-2 p-3 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="grid grid-cols-8 gap-2">
                        {emojis.map((emoji, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 text-lg rounded ${
                              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !isMobile ? (
                <div className={`flex-1 flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="text-center px-4">
                    <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <h2 className={`text-xl font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Select a conversation</h2>
                    <p className={`${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Choose a group or private chat to start messaging</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesScreen; 