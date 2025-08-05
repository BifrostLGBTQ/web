import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Heart, 
  Search, 
  Filter, 
  Globe, 
  Clock, 
  Phone, 
  ExternalLink,
  ChevronDown,
  X,
  Send,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Camera,
  Navigation,
  Users,
  Calendar,
  Award,
  Verified,
  ArrowLeft,
  MoreHorizontal
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
            className="flex flex-col space-y-4"
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
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {sortedPlaces.length} places found
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search places, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400'
                  }`}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all duration-200 ${
                  showFilters
                    ? theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                    : theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-xl border p-4 ${
                    theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Country Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Country
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>
                            {country === 'all' ? 'All Countries' : country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {cities.map(city => (
                          <option key={city} value={city}>
                            {city === 'all' ? 'All Cities' : city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviews</option>
                        <option value="distance">Nearest</option>
                        <option value="name">Name A-Z</option>
                      </select>
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
            className="text-center py-16"
          >
            <MapPin className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No places found
            </h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Try adjusting your search terms or filters
            </p>
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
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlace(place)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-white font-semibold">{place.rating}</span>
                  </div>

                  {/* Verified Badge */}
                  {place.verified && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm p-1.5 rounded-full">
                      <Verified className="w-3 h-3 text-blue-400" />
                    </div>
                  )}

                  {/* Distance */}
                  {place.distance && (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Navigation className="w-3 h-3 text-white" />
                      <span className="text-xs text-white font-medium">{place.distance}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-bold line-clamp-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {place.name}
                    </h3>
                    <button className={`p-1 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Heart className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {place.city}, {place.country}
                    </span>
                  </div>

                  <p className={`text-sm line-clamp-2 mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {place.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {place.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-gray-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {place.tags.length > 2 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        +{place.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {renderStars(place.rating)}
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        ({place.reviewCount})
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {place.priceRange}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-2xl font-bold">{selectedPlace.name}</h2>
                        {selectedPlace.verified && (
                          <Verified className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{selectedPlace.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold">{selectedPlace.rating}</span>
                      </div>
                      <span className="text-sm opacity-90">({selectedPlace.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        About
                      </h3>
                      <p className={`leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selectedPlace.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Features
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              theme === 'dark'
                                ? 'bg-gray-800 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Hours
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(selectedPlace.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className={`font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {day}
                            </span>
                            <span className={`${
                              hours === 'Closed'
                                ? 'text-red-500'
                                : theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-600'
                            }`}>
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Reviews ({selectedPlace.reviewCount})
                        </h3>
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-white hover:bg-gray-700'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          Write Review
                        </button>
                      </div>

                      <div className="space-y-4">
                        {reviews.map(review => (
                          <div
                            key={review.id}
                            className={`p-4 rounded-xl border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {review.user.name}
                                  </span>
                                  {review.user.verified && (
                                    <Verified className="w-4 h-4 text-blue-400" />
                                  )}
                                  <span className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {review.date}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                  {renderStars(review.rating)}
                                </div>
                                <p className={`mb-3 ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {review.comment}
                                </p>
                                <div className="flex items-center space-x-4">
                                  <button className={`flex items-center space-x-1 text-sm transition-colors ${
                                    review.helpful
                                      ? 'text-blue-500'
                                      : theme === 'dark'
                                      ? 'text-gray-400 hover:text-white'
                                      : 'text-gray-500 hover:text-gray-700'
                                  }`}>
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{review.likes}</span>
                                  </button>
                                  <button className={`text-sm transition-colors ${
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

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className={`font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Contact
                      </h4>
                      <div className="space-y-3">
                        {selectedPlace.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <a
                              href={`tel:${selectedPlace.phone}`}
                              className={`text-sm hover:underline ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              {selectedPlace.phone}
                            </a>
                          </div>
                        )}
                        {selectedPlace.website && (
                          <div className="flex items-center space-x-3">
                            <ExternalLink className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <a
                              href={selectedPlace.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm hover:underline ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}>
                        <Heart className="w-4 h-4 inline mr-2" />
                        Add to Favorites
                      </button>
                      <button className={`w-full py-3 rounded-xl font-semibold border transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}>
                        <Share2 className="w-4 h-4 inline mr-2" />
                        Share
                      </button>
                    </div>

                    {/* Price Range */}
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Price Range
                      </h4>
                      <span className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selectedPlace.priceRange}
                      </span>
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