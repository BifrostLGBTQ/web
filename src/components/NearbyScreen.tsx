import React, { useState, useMemo } from 'react';
import { Filter, Search, Users, Grid, List, Square, ChevronDown, RefreshCw, MapPin, Users2, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { UserCard } from './UserCard';
import { AnimatePresence, motion } from 'framer-motion';

interface NearbyUser {
  id: number;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  sexualOrientation: string;
  country: string;
  city: string;
  ethnicity: string;
  position: string;
  eyeColor: string;
  skinColor: string;
  smoking: string;
  alcohol: string;
  bodyType: string;
  distance: string;
  avatar: string;
  isOnline: boolean;
  interests: string[];
}

interface Filters {
  minAge: number;
  maxAge: number;
  minHeight: number;
  maxHeight: number;
  minWeight: number;
  maxWeight: number;
  sexualOrientation: string[];
  country: string;
  city: string;
  ethnicity: string[];
  position: string[];
  eyeColor: string[];
  skinColor: string[];
  smoking: string;
  alcohol: string;
  bodyType: string[];
}

const NearbyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { viewMode, setViewMode } = useSettings();
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    minAge: 18,
    maxAge: 99,
    minHeight: 150,
    maxHeight: 220,
    minWeight: 45,
    maxWeight: 120,
    sexualOrientation: [],
    country: 'All Countries',
    city: 'All Cities',
    ethnicity: [],
    position: [],
    eyeColor: [],
    skinColor: [],
    smoking: 'all',
    alcohol: 'all',
    bodyType: [],
  });
  
  // Major countries with common cities
  const countries = ['All Countries', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Belgium', 'Switzerland', 'Austria', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Turkey', 'Brazil', 'Argentina', 'Mexico', 'Chile', 'Colombia', 'South Africa', 'Japan', 'South Korea', 'China', 'India', 'Thailand', 'Philippines', 'Indonesia', 'Malaysia', 'Singapore', 'New Zealand'];
  
  const citiesByCountry: Record<string, string[]> = {
    'United States': ['All Cities', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Miami', 'Seattle', 'Boston', 'Portland'],
    'Canada': ['All Cities', 'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Victoria'],
    'United Kingdom': ['All Cities', 'London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds', 'Edinburgh', 'Bristol', 'Sheffield', 'Cardiff'],
    'Australia': ['All Cities', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Hobart'],
    'Germany': ['All Cities', 'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen'],
    'France': ['All Cities', 'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux'],
    'Spain': ['All Cities', 'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Málaga', 'Murcia', 'Palma', 'Las Palmas'],
    'Italy': ['All Cities', 'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari'],
  };

  const allUsers: NearbyUser[] = [
    { id: 1, name: 'Alex Rivera', age: 26, height: 180, weight: 75, sexualOrientation: 'Gay', country: 'United States', city: 'New York', ethnicity: 'Hispanic', position: 'Top', eyeColor: 'Brown', skinColor: 'Medium', smoking: 'No', alcohol: 'Sometimes', bodyType: 'Athletic', distance: '0.5 km', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: true, interests: ['Art', 'Music'] },
    { id: 2, name: 'Jordan Kim', age: 24, height: 175, weight: 68, sexualOrientation: 'Bisexual', country: 'United States', city: 'Los Angeles', ethnicity: 'Asian', position: 'Bottom', eyeColor: 'Dark Brown', skinColor: 'Light', smoking: 'Never', alcohol: 'Yes', bodyType: 'Slim', distance: '1.2 km', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: false, interests: ['Tech', 'Books'] },
    { id: 3, name: 'Sam Chen', age: 28, height: 178, weight: 72, sexualOrientation: 'Gay', country: 'United States', city: 'San Francisco', ethnicity: 'Asian', position: 'Versatile', eyeColor: 'Brown', skinColor: 'Medium', smoking: 'No', alcohol: 'Sometimes', bodyType: 'Average', distance: '2.1 km', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: true, interests: ['Yoga', 'Travel'] },
    { id: 4, name: 'Casey Morgan', age: 25, height: 165, weight: 58, sexualOrientation: 'Lesbian', country: 'Canada', city: 'Toronto', ethnicity: 'Caucasian', position: 'Top', eyeColor: 'Blue', skinColor: 'Fair', smoking: 'No', alcohol: 'Yes', bodyType: 'Slim', distance: '3.5 km', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: true, interests: ['Photography', 'Nature'] },
    { id: 5, name: 'Riley Thompson', age: 27, height: 170, weight: 65, sexualOrientation: 'Pansexual', country: 'United Kingdom', city: 'London', ethnicity: 'Caucasian', position: 'Bottom', eyeColor: 'Green', skinColor: 'Fair', smoking: 'Sometimes', alcohol: 'Yes', bodyType: 'Average', distance: '4.2 km', avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: false, interests: ['Fitness', 'Cooking'] },
    { id: 6, name: 'Taylor Davis', age: 23, height: 172, weight: 70, sexualOrientation: 'Gay', country: 'United States', city: 'Chicago', ethnicity: 'African American', position: 'Versatile', eyeColor: 'Brown', skinColor: 'Dark', smoking: 'No', alcohol: 'No', bodyType: 'Muscular', distance: '5.8 km', avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: true, interests: ['Music', 'Art'] },
    { id: 7, name: 'Jamie Wilson', age: 29, height: 168, weight: 62, sexualOrientation: 'Lesbian', country: 'United States', city: 'Boston', ethnicity: 'Caucasian', position: 'Top', eyeColor: 'Hazel', skinColor: 'Light', smoking: 'No', alcohol: 'Sometimes', bodyType: 'Average', distance: '0.8 km', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: true, interests: ['Dance', 'Theater'] },
    { id: 8, name: 'Morgan Lee', age: 25, height: 176, weight: 73, sexualOrientation: 'Bisexual', country: 'Australia', city: 'Sydney', ethnicity: 'Mixed', position: 'Versatile', eyeColor: 'Brown', skinColor: 'Medium', smoking: 'Sometimes', alcohol: 'Yes', bodyType: 'Athletic', distance: '2.5 km', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2', isOnline: false, interests: ['Writing', 'Poetry'] },
  ];

  // Filter users based on current filters
  const nearbyUsers = allUsers.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAge = user.age >= filters.minAge && user.age <= filters.maxAge;
    const matchesHeight = user.height >= filters.minHeight && user.height <= filters.maxHeight;
    const matchesWeight = user.weight >= filters.minWeight && user.weight <= filters.maxWeight;
    const matchesSexualOrientation = filters.sexualOrientation.length === 0 || filters.sexualOrientation.includes(user.sexualOrientation);
    const matchesCountry = filters.country === 'All Countries' || user.country === filters.country;
    const matchesCity = filters.city === 'All Cities' || filters.city === 'all' || user.city === filters.city;
    const matchesEthnicity = filters.ethnicity.length === 0 || filters.ethnicity.includes(user.ethnicity);
    const matchesPosition = filters.position.length === 0 || filters.position.includes(user.position);
    const matchesEyeColor = filters.eyeColor.length === 0 || filters.eyeColor.includes(user.eyeColor);
    const matchesSkinColor = filters.skinColor.length === 0 || filters.skinColor.includes(user.skinColor);
    const matchesSmoking = filters.smoking === 'all' || user.smoking === filters.smoking;
    const matchesAlcohol = filters.alcohol === 'all' || user.alcohol === filters.alcohol;
    const matchesBodyType = filters.bodyType.length === 0 || filters.bodyType.includes(user.bodyType);
    
    return matchesSearch && matchesAge && matchesHeight && matchesWeight && 
           matchesSexualOrientation && matchesCountry && matchesCity && 
           matchesEthnicity && matchesPosition && matchesEyeColor && 
           matchesSkinColor && matchesSmoking && matchesAlcohol && matchesBodyType;
  });

  const availableCities = filters.country === 'All Countries' || filters.country === 'all' 
    ? ['All Cities'] 
    : citiesByCountry[filters.country] || ['All Cities'];

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sexualOrientation.length > 0) count += filters.sexualOrientation.length;
    if (filters.country !== 'All Countries') count++;
    if (filters.city !== 'All Cities' && filters.city !== 'all') count++;
    if (filters.ethnicity.length > 0) count += filters.ethnicity.length;
    if (filters.position.length > 0) count += filters.position.length;
    if (filters.eyeColor.length > 0) count += filters.eyeColor.length;
    if (filters.skinColor.length > 0) count += filters.skinColor.length;
    if (filters.bodyType.length > 0) count += filters.bodyType.length;
    if (filters.smoking !== 'all') count++;
    if (filters.alcohol !== 'all') count++;
    if (filters.minAge !== 18 || filters.maxAge !== 99) count++;
    if (filters.minHeight !== 150 || filters.maxHeight !== 220) count++;
    if (filters.minWeight !== 45 || filters.maxWeight !== 120) count++;
    return count;
  }, [filters]);

  return (
    <div className={`w-full min-h-screen scrollbar-hide max-h-[100dvh] overflow-y-auto ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header - Sticky */}
      <div className={`sticky top-0 z-50 border-b ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-black/95' 
          : 'border-gray-200/50 bg-white/95'
      }`}>
        <div className="w-full px-4 lg:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Nearby People
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {nearbyUsers.length} people nearby
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    setIsRefreshing(false);
                  }, 1000);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-black/10 text-gray-500 hover:text-gray-900'
                }`}
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Search, Filter and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-2 pb-4">
            <div className="flex-1 relative group">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                theme === 'dark' ? 'text-gray-400 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-gray-600'
              }`} />
              <input
                type="text"
                placeholder="Search by name or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-9 py-2 rounded-xl text-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-700 focus:bg-gray-900 focus:ring-1 focus:ring-gray-700'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200'
                }`}
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.button>
              )}
            </div>
            
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className={`flex rounded-xl p-1 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-200'}`}>
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white'
                      : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white'
                      : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('card')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    viewMode === 'card'
                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white'
                      : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Card View"
                >
                  <Square className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  showFilters
                    ? theme === 'dark'
                      ? 'bg-white text-black'
                      : 'bg-gray-900 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
                    : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-3.5 h-3.5 inline-block mr-1.5" />
                Filters
                {activeFiltersCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      theme === 'dark' ? 'bg-white text-black' : 'bg-gray-900 text-white'
                    }`}
                  >
                    {activeFiltersCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto max-w-7xl px-4 md:px-6 py-4">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-4 mb-4 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {nearbyUsers.length}
                </p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>People nearby</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <Users2 className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {nearbyUsers.filter(u => u.isOnline).length}
                </p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Online now</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <MapPin className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  10km
                </p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Search radius</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
        <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className={`rounded-2xl p-5 md:p-6 ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Age Range: {filters.minAge} - {filters.maxAge} years
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="18"
                        max="99"
                        value={filters.minAge}
                        onChange={(e) => setFilters({...filters, minAge: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minAge - 18) / 81) * 100}%, #000 ${((filters.minAge - 18) / 81) * 100}%, #000 ${((filters.maxAge - 18) / 81) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxAge - 18) / 81) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                      <input
                        type="range"
                        min="18"
                        max="99"
                        value={filters.maxAge}
                        onChange={(e) => setFilters({...filters, maxAge: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minAge - 18) / 81) * 100}%, #000 ${((filters.minAge - 18) / 81) * 100}%, #000 ${((filters.maxAge - 18) / 81) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxAge - 18) / 81) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Height Range */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Height: {filters.minHeight} - {filters.maxHeight} cm
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="150"
                        max="220"
                        value={filters.minHeight}
                        onChange={(e) => setFilters({...filters, minHeight: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minHeight - 150) / 70) * 100}%, #000 ${((filters.minHeight - 150) / 70) * 100}%, #000 ${((filters.maxHeight - 150) / 70) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxHeight - 150) / 70) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                      <input
                        type="range"
                        min="150"
                        max="220"
                        value={filters.maxHeight}
                        onChange={(e) => setFilters({...filters, maxHeight: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minHeight - 150) / 70) * 100}%, #000 ${((filters.minHeight - 150) / 70) * 100}%, #000 ${((filters.maxHeight - 150) / 70) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxHeight - 150) / 70) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Weight Range */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Weight: {filters.minWeight} - {filters.maxWeight} kg
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="45"
                        max="120"
                        value={filters.minWeight}
                        onChange={(e) => setFilters({...filters, minWeight: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minWeight - 45) / 75) * 100}%, #000 ${((filters.minWeight - 45) / 75) * 100}%, #000 ${((filters.maxWeight - 45) / 75) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxWeight - 45) / 75) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                      <input
                        type="range"
                        min="45"
                        max="120"
                        value={filters.maxWeight}
                        onChange={(e) => setFilters({...filters, maxWeight: parseInt(e.target.value)})}
                        className="flex-1 h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
                        style={{
                          background: `linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#d1d5db'} 0%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.minWeight - 45) / 75) * 100}%, #000 ${((filters.minWeight - 45) / 75) * 100}%, #000 ${((filters.maxWeight - 45) / 75) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} ${((filters.maxWeight - 45) / 75) * 100}%, ${theme === 'dark' ? '#374151' : '#d1d5db'} 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Sexual Orientation */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Sexual Orientation
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer'].map(orient => (
                        <motion.button
                          key={orient}
                          onClick={() => {
                            if (filters.sexualOrientation.includes(orient)) {
                              setFilters({...filters, sexualOrientation: filters.sexualOrientation.filter(o => o !== orient)});
                            } else {
                              setFilters({...filters, sexualOrientation: [...filters.sexualOrientation, orient]});
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            filters.sexualOrientation.includes(orient)
                              ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                              : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {orient}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Country & City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Country
                      </label>
                      <select
                        value={filters.country}
                        onChange={(e) => setFilters({...filters, country: e.target.value, city: 'All Cities'})}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border border-gray-700 text-white hover:border-gray-600 focus:border-gray-500' 
                            : 'bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-black/20`}
                      >
                        {countries.map(country => (
                          <option key={country} value={country === 'All Countries' ? 'All Countries' : country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        City
                      </label>
                      <select
                        value={filters.city}
                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border border-gray-700 text-white hover:border-gray-600 focus:border-gray-500' 
                            : 'bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-black/20`}
                      >
                        {availableCities.map(city => (
                          <option key={city} value={city === 'All Cities' ? 'All Cities' : city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ethnicity */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Ethnicity
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Caucasian', 'Hispanic', 'Asian', 'African American', 'Mixed'].map(ethnicity => (
                        <motion.button
                          key={ethnicity}
                          onClick={() => {
                            if (filters.ethnicity.includes(ethnicity)) {
                              setFilters({...filters, ethnicity: filters.ethnicity.filter(e => e !== ethnicity)});
                            } else {
                              setFilters({...filters, ethnicity: [...filters.ethnicity, ethnicity]});
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            filters.ethnicity.includes(ethnicity)
                              ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                              : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {ethnicity}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Position
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Top', 'Bottom', 'Versatile'].map(position => (
                        <motion.button
                          key={position}
                          onClick={() => {
                            if (filters.position.includes(position)) {
                              setFilters({...filters, position: filters.position.filter(p => p !== position)});
                            } else {
                              setFilters({...filters, position: [...filters.position, position]});
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            filters.position.includes(position)
                              ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                              : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {position}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-800'
                          : 'bg-gray-100'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Advanced Filters
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    </motion.button>
                  </div>

                  {/* Advanced Filters Content */}
                  <AnimatePresence>
                    {showAdvancedFilters && (
        <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {/* Eye Color */}
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Eye Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Brown', 'Blue', 'Green', 'Hazel', 'Dark Brown'].map(color => (
          <motion.button
                                  key={color}
                                  onClick={() => {
                                    if (filters.eyeColor.includes(color)) {
                                      setFilters({...filters, eyeColor: filters.eyeColor.filter(c => c !== color)});
                                    } else {
                                      setFilters({...filters, eyeColor: [...filters.eyeColor, color]});
                                    }
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    filters.eyeColor.includes(color)
                                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                                  }`}
                                >
                                  {color}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Skin Color */}
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Skin Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Fair', 'Light', 'Medium', 'Dark'].map(color => (
                                <motion.button
                                  key={color}
                                  onClick={() => {
                                    if (filters.skinColor.includes(color)) {
                                      setFilters({...filters, skinColor: filters.skinColor.filter(c => c !== color)});
                                    } else {
                                      setFilters({...filters, skinColor: [...filters.skinColor, color]});
                                    }
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    filters.skinColor.includes(color)
                                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                                  }`}
                                >
                                  {color}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Smoking */}
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Smoking
                            </label>
                            <select
                              value={filters.smoking}
                              onChange={(e) => setFilters({...filters, smoking: e.target.value})}
                              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                theme === 'dark' 
                                  ? 'bg-gray-800 border border-gray-700 text-white hover:border-gray-600 focus:border-gray-500' 
                                  : 'bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-gray-500'
                              } focus:outline-none focus:ring-2 focus:ring-black/20`}
                            >
                              <option value="all">All Options</option>
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                              <option value="Sometimes">Sometimes</option>
                            </select>
                          </div>

                          {/* Alcohol */}
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Alcohol
                            </label>
                            <select
                              value={filters.alcohol}
                              onChange={(e) => setFilters({...filters, alcohol: e.target.value})}
                              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              theme === 'dark'
                                  ? 'bg-gray-800 border border-gray-700 text-white hover:border-gray-600 focus:border-gray-500' 
                                  : 'bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:border-gray-500'
                              } focus:outline-none focus:ring-2 focus:ring-black/20`}
                            >
                              <option value="all">All Options</option>
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                              <option value="Sometimes">Sometimes</option>
                            </select>
                          </div>

                          {/* Body Type */}
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Body Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Slim', 'Average', 'Athletic', 'Muscular'].map(type => (
                                <motion.button
                                  key={type}
                                  onClick={() => {
                                    if (filters.bodyType.includes(type)) {
                                      setFilters({...filters, bodyType: filters.bodyType.filter(t => t !== type)});
                                    } else {
                                      setFilters({...filters, bodyType: [...filters.bodyType, type]});
                                    }
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    filters.bodyType.includes(type)
                                      ? theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                                      : theme === 'dark' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'
                                  }`}
                                >
                                  {type}
          </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
        </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Clear Filters */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      onClick={() => setFilters({
                        minAge: 18, maxAge: 99,
                        minHeight: 150, maxHeight: 220,
                        minWeight: 45, maxWeight: 120,
                        sexualOrientation: [],
                        country: 'All Countries', city: 'All Cities',
                        ethnicity: [], position: [],
                        eyeColor: [], skinColor: [],
                        smoking: 'all', alcohol: 'all',
                        bodyType: []
                      })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      Clear All Filters
                    </motion.button>
                  </div>
                </div>
              </div>
      </motion.div>
          )}
        </AnimatePresence>

        {/* Users - Different layouts based on viewMode */}
        {nearbyUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-12 md:p-16 text-center ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}
          >
            <div className="max-w-md mx-auto">
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <Users className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                No matches found
              </h3>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery || activeFiltersCount > 0
                  ? 'Try adjusting your search or filters to find more people.'
                  : 'Be the first to join the community nearby!'}
              </p>
              {(searchQuery || activeFiltersCount > 0) && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      minAge: 18, maxAge: 99,
                      minHeight: 150, maxHeight: 220,
                      minWeight: 45, maxWeight: 120,
                      sexualOrientation: [],
                      country: 'All Countries', city: 'All Cities',
                      ethnicity: [], position: [],
                      eyeColor: [], skinColor: [],
                      smoking: 'all', alcohol: 'all',
                      bodyType: []
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-2xl font-medium text-sm ${
                    theme === 'dark'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {nearbyUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserCard user={user} viewMode={'compact'} />
                  </motion.div>
                ))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-3">
                {nearbyUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <UserCard user={user} viewMode={'list'} />
                  </motion.div>
                ))}
              </div>
            )}
            
            {viewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {nearbyUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserCard user={user} viewMode={'card'} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NearbyScreen;