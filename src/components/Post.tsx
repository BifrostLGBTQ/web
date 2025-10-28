import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, MapPin, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PostReply from './PostReply';

// API data structure interfaces
interface ApiPost {
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
  author: {
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
  };
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
  poll?: {
    id: string;
    post_id: string;
    contentable_id: string;
    contentable_type: string;
    question: {
      en: string;
    };
    duration: number;
    created_at: string;
    updated_at: string;
    choices: Array<{
      id: string;
      poll_id: string;
      label: {
        en: string;
      };
      vote_count: number;
      voters?: Array<{
        id: string;
        username: string;
        displayname: string;
      }>;
    }>;
  };
  event?: {
    id: string;
    post_id: string; 
    title: {
      en: string;
    };
    description: {
      en: string;
    };
    start_time: string;
    location: {
      id: string;
      contentable_id: string;
      contentable_type: string;
      country_code: string | null;
      address: string;
      display: string | null;
      latitude: number;
      longitude: number;
      location_point: {
        lng: number;
        lat: number;
      };
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    type: string;
    created_at: string;
    updated_at: string;
    attendees?: Array<{
      id: string;
      username: string;
      displayname: string;
      status: 'going' | 'not_going' | 'maybe';
    }>;
  };
  location?: {
    id: string;
    contentable_id: string;
    contentable_type: string;
    country_code: string | null;
    address: string;
    display: string | null;
    latitude: number;
    longitude: number;
    location_point: {
      lng: number;
      lat: number;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

interface PostProps {
  post: ApiPost;
  onPostClick?: (postId: string) => void;
  onProfileClick?: (username: string) => void;
  isDetailView?: boolean;
}

const Post: React.FC<PostProps> = ({ post, onPostClick, onProfileClick, isDetailView }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedPollChoice, setSelectedPollChoice] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<'going' | 'not_going' | 'maybe' | null>(null);
  const [showReply, setShowReply] = useState(isDetailView || false);
  const { theme } = useTheme();

  // Handle profile click
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click
    onProfileClick?.(post.author.username);
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return postDate.toLocaleDateString();
  };

  // Helper function to format event time
  const formatEventTime = (timestamp: string) => {
    const eventDate = new Date(timestamp);
    return eventDate.toLocaleString();
  };

  // Calculate total votes for poll
  const getTotalVotes = () => {
    if (!post.poll) return 0;
    return post.poll.choices.reduce((total, choice) => total + choice.vote_count, 0);
  };

  // Calculate percentage for poll choice
  const getChoicePercentage = (voteCount: number) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((voteCount / total) * 100);
  };

  const handlePollVote = (choiceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click
    if (selectedPollChoice) return; // Already voted
    setSelectedPollChoice(choiceId);
    // TODO: Send vote to API
  };

  return (
    <div 
      className={`overflow-hidden ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      } ${onPostClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/30 hover:shadow-sm' : ''} transition-all duration-300 ease-out`}
      onClick={() => {
        if (onPostClick) {
          onPostClick(post.id);
        }
      }}
    >
      {/* Post Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleProfileClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {post.author.displayname.charAt(0).toUpperCase()}
            </span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleProfileClick}
                className={`font-semibold hover:underline transition-colors duration-200 ${
                  theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                {post.author.displayname}
              </button>
              <button 
                onClick={handleProfileClick}
                className={`text-sm hover:underline transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                }`}
              >
                @{post.author.username}
              </button>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>·</span>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{formatTimestamp(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button className={`p-2 rounded-full transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-gray-800' 
            : 'hover:bg-gray-100'
        }`}>
          <MoreHorizontal className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <div className={`leading-relaxed text-[15px] ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`} style={{
          color: theme === 'dark' ? '#ffffff' : '#111827'
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: post.content.en }} 
            style={{
              color: theme === 'dark' ? '#ffffff' : '#111827'
            }}
            className={`prose prose-sm max-w-none ${
              theme === 'dark' 
                ? 'prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-a:text-blue-400 prose-code:text-white' 
                : 'prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-em:text-gray-900 prose-a:text-blue-600 prose-code:text-gray-900'
            }`}
          />
        </div>
      </div>

      {/* Post Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="px-4 pb-3">
          {post.attachments.map((attachment, index) => (
            <div key={index} className="w-full overflow-hidden">
              {attachment.file.mime_type.startsWith('image/') ? (
                <img
                  src={attachment.file.url}
                  alt="Post attachment"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              ) : (
                <div className={`w-full h-48 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {attachment.file.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Poll Section */}
      {post.poll && (
        <div className="px-4 py-3">
          <div className="py-4">
            <h4 className={`font-bold mb-4 text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {post.poll.question.en}
            </h4>
            <div className="space-y-3">
              {post.poll.choices.map((choice) => {
                const percentage = getChoicePercentage(choice.vote_count);
                const isSelected = selectedPollChoice === choice.id;
                
                return (
                  <div
                    key={choice.id}
                    className={`relative p-3 rounded-xl border transition-all duration-200 ${
                      isSelected 
                        ? theme === 'dark' 
                          ? 'border-white bg-white/10' 
                          : 'border-gray-900 bg-gray-50'
                        : theme === 'dark' 
                          ? 'border-gray-700 hover:border-gray-600 hover:bg-white/5' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${selectedPollChoice !== null ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={(e) => handlePollVote(choice.id, e)}
                  >
                    {isSelected && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                      }`}>
                        ✓
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {choice.label.en}
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          isSelected 
                            ? theme === 'dark' ? 'bg-white' : 'bg-gray-900'
                            : theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {/* Voters Avatars */}
                    {choice.voters && choice.voters.length > 0 && (
                      <div className="flex items-center -space-x-2 mt-2">
                        {choice.voters.slice(0, 5).map((voter, idx) => (
                          <div 
                            key={voter.id} 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              theme === 'dark' ? 'border-black bg-gray-800 text-white' : 'border-white bg-gray-100 text-gray-900'
                            }`}
                            style={{ zIndex: 5 - idx }}
                            title={voter.displayname}
                          >
                            {voter.displayname.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {choice.voters.length > 5 && (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            theme === 'dark' ? 'border-black bg-gray-700 text-gray-300' : 'border-white bg-gray-200 text-gray-600'
                          }`}>
                            +{choice.voters.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Vote count and percentage on same line */}
                    <div className={`flex justify-between items-center mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {choice.vote_count} vote{choice.vote_count !== 1 ? 's' : ''}
                      </span>
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {getTotalVotes() > 0 && (
              <div className={`text-sm mt-6 pt-4 border-t text-center ${
                theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-gray-500 border-gray-100'
              }`}>
                {getTotalVotes()} total vote{getTotalVotes() !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Section */}
      {post.event && (
        <div className="px-4 py-3">
          <div className="py-4">
            <div className="flex items-start space-x-4">
              <div className={`p-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Calendar className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-xl mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.event.title.en}
                </h4>
                <p className={`text-lg mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {post.event.description.en}
                </p>
                <div className={`text-base font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  📅 {formatEventTime(post.event.start_time)}
                </div>
                {post.event.location && (
                  <div className={`text-base flex items-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <MapPin className="w-5 h-5 mr-2" />
                    {post.event.location.address}
                  </div>
                )}
                
                {/* Event Attendance Buttons */}
                <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEventStatus(eventStatus === 'going' ? null : 'going')}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                      eventStatus === 'going'
                        ? theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        : theme === 'dark'
                          ? 'border border-gray-600 hover:bg-white/10'
                          : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Going
                  </button>
                  <button
                    onClick={() => setEventStatus(eventStatus === 'not_going' ? null : 'not_going')}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                      eventStatus === 'not_going'
                        ? theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        : theme === 'dark'
                          ? 'border border-gray-600 hover:bg-white/10'
                          : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Not Going
                  </button>
                  <button
                    onClick={() => setEventStatus(eventStatus === 'maybe' ? null : 'maybe')}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                      eventStatus === 'maybe'
                        ? theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white'
                        : theme === 'dark'
                          ? 'border border-gray-600 hover:bg-white/10'
                          : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Maybe
                  </button>
                </div>

                {/* Attendees */}
                {post.event.attendees && post.event.attendees.length > 0 && (
                  <div className="mt-4">
                    <div className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Attendees ({post.event.attendees.length})
                    </div>
                    <div className="flex items-center -space-x-2">
                      {post.event.attendees.slice(0, 10).map((attendee, idx) => (
                        <div 
                          key={attendee.id} 
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            attendee.status === 'going' 
                              ? theme === 'dark' ? 'border-white bg-gray-800 text-white' : 'border-gray-900 bg-gray-100 text-gray-900'
                              : attendee.status === 'not_going'
                              ? theme === 'dark' ? 'border-gray-500 bg-gray-700 text-gray-400' : 'border-gray-400 bg-gray-200 text-gray-600'
                              : theme === 'dark' ? 'border-gray-300 bg-gray-600 text-gray-300' : 'border-gray-500 bg-gray-300 text-gray-700'
                          }`}
                          style={{ zIndex: 10 - idx }}
                          title={`${attendee.displayname} (${attendee.status === 'going' ? 'Going' : attendee.status === 'not_going' ? 'Not Going' : 'Maybe'})`}
                        >
                          {attendee.displayname.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {post.event.attendees.length > 10 && (
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
                        }`}>
                          +{post.event.attendees.length - 10}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Section */}
      {post.location && !post.event && (
        <div className="px-4 py-3">
          <div className="py-3">
            <div className="flex items-center space-x-3">
              <MapPin className={`w-6 h-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {post.location.address}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 -ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-opacity-10 ${
                isLiked 
                  ? theme === 'dark' ? 'text-red-500 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-500/10'
                  : theme === 'dark' ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {isLiked ? 1 : 0}
              </span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowReply(!showReply);
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-opacity-10 ${
                theme === 'dark' ? 'text-gray-400 hover:text-blue-500 hover:bg-blue-500/10' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-500/10'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>0</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-opacity-10 ${
                theme === 'dark' ? 'text-gray-400 hover:text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:text-green-500 hover:bg-green-500/10'
              }`}
            >
              <Share className="w-5 h-5" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>0</span>
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-opacity-10 ${
              isBookmarked 
                ? theme === 'dark' ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-yellow-600 hover:bg-yellow-500/10'
                : theme === 'dark' ? 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10' : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

      {/* Reply Section */}
      {showReply && (
        <PostReply 
          isOpen={true}
          onClose={() => setShowReply(false)}
          onReply={(content) => {
            console.log('Reply posted:', content);
            setShowReply(false);
          }}
        />
      )}
    </div>
  );
};

export default Post;