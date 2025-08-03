import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageCircle, 
  Users, 
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
  Flag,
  Globe,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  Star,
  Volume2,
  VolumeX,
  Settings,
  Info
} from 'lucide-react';

const MessagesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'groups' | 'private'>('groups');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  const selectedGroupChat = groupChats.find(chat => chat.id === selectedChat);
  const selectedPrivateChat = privateChats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
      setIsTyping(false);
      // Here you would typically send the message to your backend
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className={`h-[calc(100dvh-176px)] ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="h-full max-w-7xl mx-auto">
        <div className="flex h-full">
          {/* Sidebar - Hidden on mobile when chat is selected */}
          <div className={`w-80 border-r ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          } ${selectedChat ? 'hidden lg:block' : 'block'}`}>
            {/* Header */}
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Messages</h1>
              
              {/* Search */}
              <div className="mt-4 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'groups'
                    ? theme === 'dark'
                      ? 'text-white border-b-2 border-gray-300'
                      : 'text-gray-900 border-b-2 border-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Groups
              </button>
              <button
                onClick={() => setActiveTab('private')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'private'
                    ? theme === 'dark'
                      ? 'text-white border-b-2 border-gray-300'
                      : 'text-gray-900 border-b-2 border-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Private
              </button>
            </div>

            {/* Chat List */}
            <div className="h-[calc(100%-140px)] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === 'groups' ? (
                  <motion.div
                    key="groups"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-1"
                  >
                    {groupChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedChat === chat.id
                            ? theme === 'dark'
                              ? 'bg-gray-800'
                              : 'bg-gray-100'
                            : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{chat.flag}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-semibold truncate ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{chat.name}</h3>
                                {chat.pinned && (
                                  <Star className="w-3 h-3 text-yellow-500" />
                                )}
                              </div>
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{chat.lastTime}</span>
                            </div>
                            <p className={`text-sm truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{chat.lastMessage}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}>{chat.members} members • {chat.online} online</span>
                              {chat.unread > 0 && (
                                <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
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
                    className="space-y-1"
                  >
                    {privateChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedChat === chat.id
                            ? theme === 'dark'
                              ? 'bg-gray-800'
                              : 'bg-gray-100'
                            : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-12 h-12 rounded-full object-cover"
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
                              <h3 className={`font-semibold truncate ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{chat.name}</h3>
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{chat.lastTime}</span>
                            </div>
                            <p className={`text-sm truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                              <div className="flex justify-end mt-1">
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
          <div className="flex-1 flex flex-col h-full">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Mobile back button */}
                      <button 
                        onClick={() => setSelectedChat(null)}
                        className="lg:hidden p-2 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      {activeTab === 'groups' && selectedGroupChat ? (
                        <>
                          <div className="text-2xl">{selectedGroupChat.flag}</div>
                          <div>
                            <h2 className={`font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{selectedGroupChat.name}</h2>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{selectedGroupChat.members} members • {selectedGroupChat.online} online</p>
                          </div>
                        </>
                      ) : selectedPrivateChat ? (
                        <>
                          <div className="relative">
                            <img
                              src={selectedPrivateChat.avatar}
                              alt={selectedPrivateChat.name}
                              className="w-10 h-10 rounded-full object-cover"
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
                          <div>
                            <h2 className={`font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{selectedPrivateChat.name}</h2>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{selectedPrivateChat.online ? 'Online' : 'Offline'}</p>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}>
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}>
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}>
                        <Video className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}>
                        <Info className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 scrollbar-hide ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="space-y-4">
                    {/* Sample messages */}
                    <div className="flex justify-end">
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                      }`}>
                        <p>Hello! How are you doing? 😊</p>
                        <div className="flex items-center justify-end mt-1">
                          <span className="text-xs opacity-70">2:30 PM</span>
                          <CheckCheck className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                      }`}>
                        <p>I'm doing great! Thanks for asking. How about you?</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs opacity-70">2:32 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                      }`}>
                        <p>Amazing! The community is so supportive here! 🏳️‍🌈</p>
                        <div className="flex items-center justify-end mt-1">
                          <span className="text-xs opacity-70">2:35 PM</span>
                          <CheckCheck className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs opacity-70">typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className={`p-4 border-t ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Image className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className={`w-full pl-4 pr-12 py-2 rounded-xl border ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                            : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                      }`}>
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={`p-2 rounded-lg transition-colors ${
                        message.trim()
                          ? theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-900 hover:bg-gray-800'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Welcome Screen */
              <div className={`flex-1 flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <div className="text-center">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesScreen; 