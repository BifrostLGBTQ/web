import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Heart,
  Search,
  Filter,
  Phone,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  ThumbsUp,
  Share2,
  Navigation,
  Verified
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Place {
  id: number;
  name: string;
  image: string;
  images?: string[];
  address: string;
  city: string;
  country: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  phone?: string;
  website?: string;
  hours: {
    [key: string]: string;
  };
  verified: boolean;
  distance?: string;
  category: string;
}

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  likes: number;
  helpful: boolean;
}

const PlacesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const countries = ['all', 'Turkey', 'USA', 'Germany', 'France', 'UK', 'Canada', 'Australia'];
  const cities = ['all', 'Istanbul', 'Ankara', 'New York', 'Los Angeles', 'Berlin', 'Paris', 'London', 'Toronto', 'Sydney'];
  const categories = ['all', 'Cafe', 'Bar', 'Restaurant', 'Bookstore', 'Community Center', 'Club', 'Hotel', 'Shop'];

  const places: Place[] = [
    {
      id: 1,
      name: 'Rainbow Cafe',
      image: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      images: [
        'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
      ],
      address: '123 Pride Street, City Center',
      city: 'Istanbul',
      country: 'Turkey',
      description: 'A cozy, inclusive cafe with rainbow vibes and great coffee. Perfect place for community gatherings and meaningful conversations.',
      tags: ['LGBTQ+ Friendly', 'Vegan Options', 'Free WiFi', 'Pet Friendly'],
      rating: 4.8,
      reviewCount: 127,
      priceRange: '$$',
      phone: '+90 212 555 0123',
      website: 'https://rainbowcafe.com',
      hours: {
        'Monday': '8:00 AM - 10:00 PM',
        'Tuesday': '8:00 AM - 10:00 PM',
        'Wednesday': '8:00 AM - 10:00 PM',
        'Thursday': '8:00 AM - 10:00 PM',
        'Friday': '8:00 AM - 11:00 PM',
        'Saturday': '9:00 AM - 11:00 PM',
        'Sunday': '9:00 AM - 9:00 PM'
      },
      verified: true,
      distance: '0.5 km',
      category: 'Cafe'
    },
    {
      id: 2,
      name: 'Equality Bar',
      image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      images: [
        'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
      ],
      address: '456 Freedom Avenue, Downtown',
      city: 'Istanbul',
      country: 'Turkey',
      description: 'The city\'s most vibrant LGBTQ+ bar with live music, drag shows, and an inclusive atmosphere for everyone.',
      tags: ['Live Music', 'Drag Shows', 'Cocktails', 'Dance Floor'],
      rating: 4.7,
      reviewCount: 89,
      priceRange: '$$$',
      phone: '+90 212 555 0456',
      website: 'https://equalitybar.com',
      hours: {
        'Monday': 'Closed',
        'Tuesday': 'Closed',
        'Wednesday': '7:00 PM - 2:00 AM',
        'Thursday': '7:00 PM - 2:00 AM',
        'Friday': '7:00 PM - 3:00 AM',
        'Saturday': '7:00 PM - 3:00 AM',
        'Sunday': '6:00 PM - 1:00 AM'
      },
      verified: true,
      distance: '1.2 km',
      category: 'Bar'
    },
    {
      id: 3,
      name: 'Open Arms Bookstore',
      image: 'https://images.pexels.com/photos/279222/pexels-photo-279222.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      images: [
        'https://images.pexels.com/photos/279222/pexels-photo-279222.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
      ],
      address: '789 Unity Boulevard, Midtown',
      city: 'Ankara',
      country: 'Turkey',
      description: 'A safe space bookstore specializing in queer literature, hosting regular events and book clubs.',
      tags: ['Queer Literature', 'Book Clubs', 'Events', 'Safe Space'],
      rating: 4.9,
      reviewCount: 156,
      priceRange: '$$',
      phone: '+90 312 555 0789',
      website: 'https://openarmsbookstore.com',
      hours: {
        'Monday': '10:00 AM - 8:00 PM',
        'Tuesday': '10:00 AM - 8:00 PM',
        'Wednesday': '10:00 AM - 8:00 PM',
        'Thursday': '10:00 AM - 9:00 PM',
        'Friday': '10:00 AM - 9:00 PM',
        'Saturday': '10:00 AM - 9:00 PM',
        'Sunday': '11:00 AM - 7:00 PM'
      },
      verified: true,
      distance: '2.1 km',
      category: 'Bookstore'
    },
    {
      id: 4,
      name: 'Pride Community Center',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      images: [
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
      ],
      address: '321 Community Lane, Uptown',
      city: 'New York',
      country: 'USA',
      description: 'A welcoming community center offering support groups, events, and resources for the LGBTQ+ community.',
      tags: ['Support Groups', 'Counseling', 'Events', 'Resources'],
      rating: 4.6,
      reviewCount: 203,
      priceRange: 'Free',
      phone: '+1 212 555 0321',
      website: 'https://pridecommunitycenter.org',
      hours: {
        'Monday': '9:00 AM - 9:00 PM',
        'Tuesday': '9:00 AM - 9:00 PM',
        'Wednesday': '9:00 AM - 9:00 PM',
        'Thursday': '9:00 AM - 9:00 PM',
        'Friday': '9:00 AM - 6:00 PM',
        'Saturday': '10:00 AM - 4:00 PM',
        'Sunday': 'Closed'
      },
      verified: true,
      distance: '3.5 km',
      category: 'Community Center'
    }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      user: {
        name: 'Alex Rivera',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: true
      },
      rating: 5,
      comment: 'Amazing place! The staff is incredibly welcoming and the atmosphere is perfect for our community. Highly recommend!',
      date: '2 days ago',
      likes: 12,
      helpful: true
    },
    {
      id: 2,
      user: {
        name: 'Jordan Kim',
        avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        verified: false
      },
      rating: 4,
      comment: 'Great coffee and friendly environment. Love coming here for meetings and casual hangouts.',
      date: '1 week ago',
      likes: 8,
      helpful: false
    }
  ];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry = selectedCountry === 'all' || place.country === selectedCountry;
    const matchesCity = selectedCity === 'all' || place.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    
    return matchesSearch && matchesCountry && matchesCity && matchesCategory;
  });

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'distance':
        return parseFloat(a.distance || '0') - parseFloat(b.distance || '0');
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      // Here you would typically send the review to your backend
      console.log('Submitting review:', newReview);
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: '' });
      setUserRating(0);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${size} ${
                star <= (interactive ? (hoveredRating || userRating) : rating)
                  ? 'text-yellow-400 fill-current'
                  : theme === 'dark'
                  ? 'text-gray-600'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
        theme === 'dark' ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  LGBTIQ+ Places
                </h1>
                <p className={`text-base mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Discover safe and welcoming spaces in your community
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border border-gray-700'
                    : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
                }`}>
                  {sortedPlaces.length} places
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search places, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Quick filters:
                </span>

                {/* Category Pills */}
                {categories.slice(1, 5).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? theme === 'dark'
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                    showFilters
                      ? theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                      : theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">More filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`rounded-2xl border-2 p-6 shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-800 shadow-black/20'
                      : 'bg-white border-gray-200 shadow-gray-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Advanced Filters
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCountry('all');
                        setSelectedCity('all');
                        setSelectedCategory('all');
                        setSortBy('rating');
                      }}
                      className={`text-sm font-medium transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Location Filters */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Location
                      </h4>

                      {/* Country */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Country
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        >
                          {countries.map(country => (
                            <option key={country} value={country}>
                              {country === 'all' ? 'All Countries' : country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* City */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          City
                        </label>
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        >
                          {cities.map(city => (
                            <option key={city} value={city}>
                              {city === 'all' ? 'All Cities' : city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category
                      </h4>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Place Type
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category === 'all' ? 'All Categories' : category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Sort By
                      </h4>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Order
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-gray-400'
                          }`}
                        >
                          <option value="rating">⭐ Highest Rated</option>
                          <option value="reviews">💬 Most Reviews</option>
                          <option value="distance">📍 Nearest</option>
                          <option value="name">🔤 Name A-Z</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter Summary */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Active Filters
                      </h4>
                      <div className="space-y-2">
                        {selectedCountry !== 'all' && (
                          <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span>Country: {selectedCountry}</span>
                            <button
                              onClick={() => setSelectedCountry('all')}
                              className={`ml-2 ${
                                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {selectedCity !== 'all' && (
                          <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span>City: {selectedCity}</span>
                            <button
                              onClick={() => setSelectedCity('all')}
                              className={`ml-2 ${
                                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {selectedCategory !== 'all' && (
                          <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span>Type: {selectedCategory}</span>
                            <button
                              onClick={() => setSelectedCategory('all')}
                              className={`ml-2 ${
                                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sortedPlaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-20 px-8 rounded-3xl border-2 border-dashed ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900/50'
                : 'border-gray-300 bg-gray-50/50'
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <MapPin className={`w-10 h-10 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No places found
            </h3>
            <p className={`text-lg mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your search terms or filters to discover more places
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('all');
                setSelectedCity('all');
                setSelectedCategory('all');
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sortedPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`group relative rounded-3xl overflow-hidden shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-600 shadow-black/20'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-gray-900/10'
                }`}
                onClick={() => setSelectedPlace(place)}
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    {/* Verified Badge */}
                    {place.verified && (
                      <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                        <Verified className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-white font-semibold">Verified</span>
                      </div>
                    )}

                    {/* Rating Badge */}
                    <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white font-bold">{place.rating}</span>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    {/* Distance */}
                    {place.distance && (
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
                        <Navigation className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-semibold">{place.distance}</span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite logic here
                      }}
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {place.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {place.city}, {place.country}
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 border border-gray-700'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {place.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {place.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {place.tags.length > 3 && (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        +{place.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {renderStars(place.rating, false, 'w-4 h-4')}
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {place.reviewCount} reviews
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {place.priceRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  theme === 'dark'
                    ? 'bg-gradient-to-t from-gray-900/20 to-transparent'
                    : 'bg-gradient-to-t from-white/20 to-transparent'
                }`} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Professional Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-800'
                  : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Header with Image Gallery */}
              <div className="relative h-80 overflow-hidden">
                {/* Main Image */}
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />

                {/* Professional Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Top Action Bar */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                  {/* Status Badges */}
                  <div className="flex items-center space-x-3">
                    {selectedPlace.verified && (
                      <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                        <Verified className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold text-sm">Verified Place</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                      <span className={`w-3 h-3 rounded-full ${
                        selectedPlace.category === 'Cafe' ? 'bg-green-400' :
                        selectedPlace.category === 'Bar' ? 'bg-purple-400' :
                        selectedPlace.category === 'Restaurant' ? 'bg-orange-400' :
                        'bg-blue-400'
                      }`} />
                      <span className="text-white font-medium text-sm">{selectedPlace.category}</span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="w-12 h-12 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 border border-white/20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    {/* Place Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-4xl font-bold text-white">{selectedPlace.name}</h1>
                        <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-xl px-3 py-1.5 rounded-full border border-yellow-500/30">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-lg">{selectedPlace.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-white/90">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">{selectedPlace.address}</span>
                        </div>
                        {selectedPlace.distance && (
                          <div className="flex items-center space-x-2">
                            <Navigation className="w-5 h-5" />
                            <span className="font-medium">{selectedPlace.distance} away</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-3">
                      <button className="w-14 h-14 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 border border-white/20">
                        <Heart className="w-6 h-6" />
                      </button>
                      <button className="w-14 h-14 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 border border-white/20">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Content Layout */}
              <div className="max-h-[calc(95vh-20rem)] overflow-y-auto">
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* About Section */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <h3 className={`text-xl font-bold mb-4 flex items-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className={`w-2 h-6 rounded-full mr-3 ${
                            selectedPlace.category === 'Cafe' ? 'bg-green-400' :
                            selectedPlace.category === 'Bar' ? 'bg-purple-400' :
                            selectedPlace.category === 'Restaurant' ? 'bg-orange-400' :
                            'bg-blue-400'
                          }`} />
                          About This Place
                        </h3>
                        <p className={`text-lg leading-relaxed ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {selectedPlace.description}
                        </p>
                      </div>

                      {/* Features & Amenities */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <h3 className={`text-xl font-bold mb-4 flex items-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="w-2 h-6 rounded-full bg-blue-400 mr-3" />
                          Features & Amenities
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedPlace.tags.map(tag => (
                            <div
                              key={tag}
                              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-green-400" />
                              <span className="font-medium">{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <h3 className={`text-xl font-bold mb-4 flex items-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="w-2 h-6 rounded-full bg-orange-400 mr-3" />
                          Operating Hours
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(selectedPlace.hours).map(([day, hours]) => {
                            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                            const isClosed = hours === 'Closed';

                            return (
                              <div
                                key={day}
                                className={`flex justify-between items-center p-3 rounded-xl ${
                                  isToday
                                    ? theme === 'dark'
                                      ? 'bg-gray-700 border border-gray-600'
                                      : 'bg-blue-50 border border-blue-200'
                                    : 'transparent'
                                }`}
                              >
                                <span className={`font-semibold ${
                                  isToday
                                    ? theme === 'dark' ? 'text-white' : 'text-blue-900'
                                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {day} {isToday && <span className="text-xs ml-2 opacity-75">(Today)</span>}
                                </span>
                                <span className={`font-medium ${
                                  isClosed
                                    ? 'text-red-500'
                                    : isToday
                                    ? theme === 'dark' ? 'text-white' : 'text-blue-900'
                                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {hours}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reviews Section */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className={`text-xl font-bold flex items-center ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            <div className="w-2 h-6 rounded-full bg-purple-400 mr-3" />
                            Reviews ({selectedPlace.reviewCount})
                          </h3>
                          <button
                            onClick={() => setShowReviewModal(true)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                              theme === 'dark'
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                          >
                            Write Review
                          </button>
                        </div>

                        <div className="space-y-4">
                          {reviews.map(review => (
                            <div
                              key={review.id}
                              className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start space-x-4">
                                <img
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className={`font-bold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {review.user.name}
                                      </span>
                                      {review.user.verified && (
                                        <Verified className="w-5 h-5 text-blue-400" />
                                      )}
                                    </div>
                                    <span className={`text-sm ${
                                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {review.date}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-2 mb-3">
                                    {renderStars(review.rating, false, 'w-5 h-5')}
                                  </div>

                                  <p className={`text-base leading-relaxed mb-4 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {review.comment}
                                  </p>

                                  <div className="flex items-center space-x-6">
                                    <button className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                                      review.helpful
                                        ? 'text-blue-500'
                                        : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                      <ThumbsUp className="w-4 h-4" />
                                      <span>Helpful ({review.likes})</span>
                                    </button>
                                    <button className={`text-sm font-medium transition-colors ${
                                      theme === 'dark'
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Professional Sidebar */}
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <h4 className={`text-lg font-bold mb-4 flex items-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="w-2 h-6 rounded-full bg-green-400 mr-3" />
                          Quick Info
                        </h4>

                        <div className="space-y-4">
                          {/* Rating */}
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Rating
                            </span>
                            <div className="flex items-center space-x-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className={`font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {selectedPlace.rating}/5
                              </span>
                            </div>
                          </div>

                          {/* Reviews */}
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Reviews
                            </span>
                            <span className={`font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {selectedPlace.reviewCount}
                            </span>
                          </div>

                          {/* Price Range */}
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Price Range
                            </span>
                            <span className={`font-bold text-lg ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {selectedPlace.priceRange}
                            </span>
                          </div>

                          {/* Distance */}
                          {selectedPlace.distance && (
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Distance
                              </span>
                              <span className={`font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {selectedPlace.distance}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className={`p-6 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50/50 border-gray-200'
                      }`}>
                        <h4 className={`text-lg font-bold mb-4 flex items-center ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="w-2 h-6 rounded-full bg-blue-400 mr-3" />
                          Contact Info
                        </h4>

                        <div className="space-y-4">
                          {selectedPlace.phone && (
                            <a
                              href={`tel:${selectedPlace.phone}`}
                              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200'
                              }`}
                            >
                              <Phone className="w-5 h-5 text-green-500" />
                              <span className="font-medium">{selectedPlace.phone}</span>
                            </a>
                          )}

                          {selectedPlace.website && (
                            <a
                              href={selectedPlace.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200'
                              }`}
                            >
                              <ExternalLink className="w-5 h-5 text-blue-500" />
                              <span className="font-medium">Visit Website</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <button className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 ${
                          theme === 'dark'
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}>
                          <Heart className="w-5 h-5 inline mr-3" />
                          Add to Favorites
                        </button>

                        <button className={`w-full py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-200 hover:scale-105 ${
                          theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}>
                          <Share2 className="w-5 h-5 inline mr-3" />
                          Share Place
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Write a Review
                  </h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className={`p-1 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderStars(userRating, true, 'w-6 h-6')}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value, rating: userRating })}
                      placeholder="Share your experience..."
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border resize-none ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className={`flex-1 py-2 rounded-lg font-medium border transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={!newReview.comment.trim() || userRating === 0}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        newReview.comment.trim() && userRating > 0
                          ? theme === 'dark'
                            ? 'bg-gray-800 text-white hover:bg-gray-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlacesScreen;