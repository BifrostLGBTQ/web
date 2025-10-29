import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Calendar, Heart, Rabbit, X, ChevronLeft, ChevronRight, ChevronDown, LocateFixed, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api.tsx';

interface AuthWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthWizard: React.FC<AuthWizardProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data, defaultLanguage } = useApp();


  const [formData, setFormData] = useState<{
    name: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    birthDate: string;
    day: string;
    month: string;
    year: string;
    orientation: string;
    location: {
      country_code: string;
      country_name: string;
      city: string;
      region?: string;
      lat: number;
      lng: number;
      timezone?: string;
      display: string;
    } | null;
    fantasies: string[];
  }>({
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    day: '',
    month: '',
    year: '',
    orientation: '',
    location: null,
    fantasies: []
  });

  // Date picker state
  const [selectedDate, setSelectedDate] = useState({
    day: 0,
    month: 0,
    year: 0
  });

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear() - 25);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [decadeStart, setDecadeStart] = useState(Math.floor((new Date().getFullYear() - 25) / 10) * 10);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];




  const steps = [
    {
      id: 'auth-mode',
      title: 'Welcome to Bifrost',
      subtitle: 'Choose how you\'d like to get started',
      icon: Heart,
      field: 'authMode',
      placeholder: '',
      type: 'auth-mode'
    },
    {
      id: 'location',
      title: 'Enable Location Services',
      subtitle: 'To find amazing people near you and create meaningful connections, we need access to your location.',
      icon: MapPin,
      field: 'location',
      placeholder: '',
      type: 'location'
    },
    {
      id: 'login-form',
      title: 'Sign In',
      subtitle: 'Enter your credentials to continue',
      icon: User,
      field: 'loginForm',
      placeholder: '',
      type: 'login-form'
    },
    {
      id: 'nickname',
      title: 'Create Your Account',
      subtitle: 'Choose a nickname and secure password',
      icon: User,
      field: 'nickname',
      placeholder: 'Enter your nickname',
      type: 'text'
    },
    {
      id: 'birthdate',
      title: 'When were you born?',
      subtitle: 'This helps us create better matches',
      icon: Calendar,
      field: 'birthDate',
      placeholder: '',
      type: 'date-picker'
    },
    {
      id: 'orientation',
      title: 'Sexual Orientation',
      subtitle: 'How do you identify?',
      icon: Heart,
      field: 'orientation',
      placeholder: '',
      type: 'select'
    },
    {
      id: 'preferences',
      title: 'Sexual Preferences',
      subtitle: 'What are you interested in? (Optional)',
      icon: Rabbit,
      field: 'preferences',
      placeholder: '',
      type: 'multi-select'
    }
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate({ day, month: currentMonth + 1, year: currentYear });
    updateFormData('day', day.toString());
    updateFormData('month', (currentMonth + 1).toString());
    updateFormData('year', currentYear.toString());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };


  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.day === day &&
        selectedDate.month === currentMonth + 1 &&
        selectedDate.year === currentYear;
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      days.push(
        <motion.button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected
              ? (theme === 'dark'
                ? 'bg-white text-gray-900 ring-2 ring-black/50'
                : 'bg-gray-900 text-white ring-2 ring-black/50')
              : (theme === 'dark'
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-900 hover:bg-gray-100')
            }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative justify-center flex flex-col items-center w-full h-full">
            <span>{day}</span>
            {isToday && (
              <span
                className={`mt-0.5 w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-black/80' : 'bg-black/80'
                  }`}
              />
            )}
          </span>
        </motion.button>
      );
    }
    return days;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Auth mode seçildikten sonra lokasyon adımına git
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Lokasyon adımından sonra auth mode'a göre yönlendir
      if (authMode === 'login') {
        setCurrentStep(2); // Login form
      } else {
        setCurrentStep(3); // Register form (nickname)
      }
    } else if (currentStep === 2 && authMode === 'login') {
      // Login işlemi
      setIsLoading(true);
      setError('');
      api.handleLogin({
        nickname: formData.nickname,
        password: formData.password
      })
      .then(response => {
        login(response.token, response.user);
        onClose();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Register işlemi
      const birthDate = selectedDate.day && selectedDate.month && selectedDate.year
        ? `${selectedDate.year}-${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`
        : '';

      const user = {
        name: formData.nickname,
        nickname: formData.nickname,
        password: formData.password,
        birthDate: birthDate,
        location: formData.location,
        orientation: formData.orientation,
        fantasies: formData.fantasies
      };

      setIsLoading(true);
      setError('');
      api.handleRegister(user)
        .then(response => {
          login(response.token, response.user);
          onClose();
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Registration failed. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = <T extends keyof typeof formData>(field: T, value: typeof formData[T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePreference = (fantasy: string) => {
    const current = formData.fantasies;
    if (current.includes(fantasy)) {
      updateFormData('fantasies', current.filter(p => p !== fantasy));
    } else {
      updateFormData('fantasies', [...current, fantasy]);
    }
  };

  const currentStepData = steps[currentStep];
  
  // Login için step sayısı: auth-mode (0) + location (1) + login-form (2) = 3
  // Register için step sayısı: auth-mode (0) + location (1) + nickname (3) + birthdate (4) + orientation (5) + preferences (6) = 6
  const getTotalSteps = () => {
    if (authMode === 'login') {
      return 3; // auth-mode, location, login-form
    } else if (authMode === 'register') {
      return 6; // auth-mode, location, nickname, birthdate, orientation, preferences
    }
    return steps.length;
  };
  
  const getCurrentStepIndex = () => {
    if (authMode === 'login') {
      if (currentStep === 0) return 0; // auth-mode
      if (currentStep === 1) return 1; // location
      if (currentStep === 2) return 2; // login-form
    } else if (authMode === 'register') {
      if (currentStep === 0) return 0; // auth-mode
      if (currentStep === 1) return 1; // location
      if (currentStep === 3) return 2; // nickname
      if (currentStep === 4) return 3; // birthdate
      if (currentStep === 5) return 4; // orientation
      if (currentStep === 6) return 5; // preferences
    }
    return currentStep;
  };
  
  const isLastStep = () => {
    if (authMode === 'login') {
      return currentStep === 2; // login-form
    } else if (authMode === 'register') {
      return currentStep === 6; // preferences
    }
    return currentStep === steps.length - 1;
  };

  const canProceed = () => {
    switch (currentStepData.field) {
      case 'authMode':
        return authMode !== null;
      case 'location':
        return !!formData.location;
      case 'loginForm':
        return formData.nickname.trim() !== '' && formData.password.trim() !== '';
      case 'nickname':
        return formData.nickname.trim() !== '' && 
               formData.password.trim() !== '' && 
               formData.confirmPassword.trim() !== '' &&
               formData.password === formData.confirmPassword;
      case 'birthDate':
        return selectedDate.day && selectedDate.month && selectedDate.year;
      case 'orientation':
        return formData.orientation !== '';
      case 'preferences':
        return true;
      default:
        return false;
    }
  };

  const renderFormField = () => {
    switch (currentStepData.type) {
      case 'auth-mode':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <motion.button
                onClick={() => setAuthMode('login')}
                className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all w-full ${
                  authMode === 'login'
                    ? theme === 'dark'
                      ? 'bg-white text-gray-900 border-white shadow-md'
                      : 'bg-gray-900 text-white border-gray-900 shadow-md'
                    : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">I have an account</h3>
                <p className="text-xs sm:text-sm opacity-80">Sign in with your existing credentials</p>
              </motion.button>

              <motion.button
                onClick={() => setAuthMode('register')}
                className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all w-full ${
                  authMode === 'register'
                    ? theme === 'dark'
                      ? 'bg-white text-gray-900 border-white shadow-md'
                      : 'bg-gray-900 text-white border-gray-900 shadow-md'
                    : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Create account</h3>
                <p className="text-xs sm:text-sm opacity-80">Join our community and find matches</p>
              </motion.button>
            </div>
          </div>
        );

      case 'login-form':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Nickname
              </label>
              <input
                type="text"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChange={(e) => updateFormData('nickname', e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                  }`}
                autoFocus
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                  }`}
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border ${theme === 'dark' 
                  ? 'bg-red-900/20 border-red-700 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
                  }`}
              >
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Nickname
              </label>
              <input
                type="text"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChange={(e) => updateFormData('nickname', e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                  }`}
                autoFocus
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                  }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
                  }`}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                  Passwords do not match
                </p>
              )}
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ Passwords match
                </p>
              )}
            </div>
          </div>
        );

      case 'location':
        const handleLocationRequest = async () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                  // Reverse geocoding isteği
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                  );
                  const data = await res.json();

                  const address = data.address || {};

                  const newLocation: {
                    country_code: string;
                    country_name: string;
                    city: string;
                    region: string;
                    lat: number;
                    lng: number;
                    timezone: string;
                    display: string;
                  } = {
                    country_code: address.country_code?.toUpperCase() || '',
                    country_name: address.country || '',
                    city: address.city || address.town || address.village || '',
                    region: address.state || '',
                    lat: lat,
                    lng: lng,
                    timezone: '', // opsiyonel, IP veya başka API ile alabilirsin
                    display: `${address.city || address.town || address.village || lat.toFixed(3)}, ${address.country || ''}`
                  };

                  updateFormData('location', newLocation);
                } catch (err) {
                  console.error("Reverse geocoding failed", err);

                  // Eğer API başarısız olursa koordinatları kullan
                  const fallbackLocation = {
                    country_code: '',
                    country_name: '',
                    city: '',
                    region: '',
                    lat,
                    lng,
                    timezone: '',
                    display: `${lat.toFixed(3)}, ${lng.toFixed(3)}`
                  };

                  updateFormData('location', fallbackLocation);
                }
              },
              (error) => {
                console.error("Location access denied", error);
              }
            );
          } else {
            console.error("Geolocation not supported");
          }
        };
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <LocateFixed className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            
            {!formData.location && (
              <motion.button
                onClick={handleLocationRequest}
                className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Allow Location Access
              </motion.button>
            )}
            
            {formData.location && (
              <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    Location saved: {formData.location.display}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 'date-picker': {
        // Calculate year range for decade navigation
        const minYear = new Date().getFullYear() - 80;
        const maxYear = new Date().getFullYear() - 18;

        // Decade block for year view
        const decadeYears: number[] = [];
        for (let y = decadeStart; y < decadeStart + 10; y++) {
          if (y >= minYear && y <= maxYear) {
            decadeYears.push(y);
          }
        }
        // For grid: fill to 10 years if possible
        while (decadeYears.length < 10) {
          decadeYears.push(NaN);
        }

        // Calendar Header: separate month and year buttons, highlight active
        return (
          <div className="space-y-4">
            {/* Selected Date Display */}
            {selectedDate.day && selectedDate.month && selectedDate.year && (
              <div className={`text-center p-4 rounded-2xl border ${theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}>
                <div className="text-lg font-semibold">
                  {selectedDate.day} {months[selectedDate.month - 1]} {selectedDate.year}
                </div>
              </div>
            )}
            {/* Calendar */}
            <div className={`p-4 rounded-2xl border ${theme === 'dark'
              ? 'bg-gray-800/30 border-gray-700'
              : 'bg-gray-50/30 border-gray-200'
              }`}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                {/* Left/Right for year or decade navigation */}
                {viewMode === 'day' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                )}
                {viewMode === 'month' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => setCurrentYear(currentYear - 1)}
                    disabled={currentYear - 1 < minYear}
                  >
                    <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${currentYear - 1 < minYear ? 'opacity-30' : ''}`} />
                  </button>
                )}
                {viewMode === 'year' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => setDecadeStart(ds => Math.max(ds - 10, minYear))}
                    disabled={decadeStart - 10 < minYear}
                  >
                    <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${decadeStart - 10 < minYear ? 'opacity-30' : ''}`} />
                  </button>
                )}
                {/* Month and Year buttons */}
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-semibold transition-colors
                      ${viewMode === 'month'
                        ? (theme === 'dark'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-indigo-100 text-indigo-900')
                        : (theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
                      }`}
                    onClick={() => setViewMode('month')}
                    style={{ minWidth: 80 }}
                  >
                    {months[currentMonth]}
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${viewMode === 'month' ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-semibold transition-colors
                      ${viewMode === 'year'
                        ? (theme === 'dark'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-indigo-100 text-indigo-900')
                        : (theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
                      }`}
                    onClick={() => setViewMode('year')}
                    style={{ minWidth: 60 }}
                  >
                    {currentYear}
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${viewMode === 'year' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {viewMode === 'day' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                )}
                {viewMode === 'month' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => setCurrentYear(currentYear + 1)}
                    disabled={currentYear + 1 > maxYear}
                  >
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${currentYear + 1 > maxYear ? 'opacity-30' : ''}`} />
                  </button>
                )}
                {viewMode === 'year' && (
                  <button
                    type="button"
                    className="rounded-full p-1.5 transition-colors"
                    onClick={() => setDecadeStart(ds => Math.min(ds + 10, maxYear - 9))}
                    disabled={decadeStart + 10 > maxYear}
                  >
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${decadeStart + 10 > maxYear ? 'opacity-30' : ''}`} />
                  </button>
                )}
              </div>
              {/* AnimatePresence for view modes */}
              <AnimatePresence mode="wait" initial={false}>
                {viewMode === 'year' && (
                  <motion.div
                    key="year"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {decadeYears.map((y, idx) =>
                        isNaN(y) ? (
                          <div key={idx} />
                        ) : (
                          <button
                            type="button"
                            key={y}
                            onClick={() => {
                              setCurrentYear(y);
                              setViewMode('month');
                            }}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors
                              ${currentYear === y
                                ? (theme === 'dark'
                                  ? 'bg-white text-gray-900'
                                  : 'bg-gray-900 text-white')
                                : (theme === 'dark'
                                  ? 'text-white hover:bg-gray-700'
                                  : 'text-gray-900 hover:bg-gray-100')
                              }`}
                          >
                            {y}
                          </button>
                        )
                      )}
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-1">
                      {decadeStart} – {decadeStart + 9}
                    </div>
                  </motion.div>
                )}
                {viewMode === 'month' && (
                  <motion.div
                    key="month"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {months.map((m, idx) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            setCurrentMonth(idx);
                            setViewMode('day');
                          }}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors
                            ${currentMonth === idx
                              ? (theme === 'dark'
                                ? 'bg-white text-gray-900'
                                : 'bg-gray-900 text-white')
                              : (theme === 'dark'
                                ? 'text-white hover:bg-gray-700'
                                : 'text-gray-900 hover:bg-gray-100')
                            }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {viewMode === 'day' && (
                  <motion.div
                    key="day"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className={`text-center text-xs font-medium py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {day}
                        </div>
                      ))}
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      }

      case 'select':
        return (
          <div className="space-y-3 ">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Select your orientation
            </label>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide p-2">
              {data &&
                data.sexual_orientations.map((sexual_orientation: any) => {
                  const label =
                    sexual_orientation.translations[defaultLanguage] ||
                    sexual_orientation.translations.en;
                  const isSelected = formData.orientation === sexual_orientation.id;

                  return (
                    <motion.button
                      key={sexual_orientation.id}
                      onClick={() => updateFormData("orientation", sexual_orientation.id)}
                      className={`p-4 rounded-2xl border-2 text-sm font-medium transition-all text-center ${isSelected
                        ? theme === "dark"
                          ? "bg-white text-gray-900 border-white shadow-md"
                          : "bg-gray-900 text-white border-gray-900 shadow-md"
                        : theme === "dark"
                          ? "bg-gray-800 border-gray-700 text-white hover:border-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
            </div>
          </div>
        );

      case 'multi-select':
        return (
          <div className="max-h-64 overflow-y-auto  scrollbar-hide p-2">
            <div className="grid grid-cols-2 gap-2">
              {data &&
                Object.values(data.fantasies).map((fantasy) => (
                  <motion.button
                    key={fantasy.id}
                    onClick={() => togglePreference(fantasy.id)}
                    className={`p-3 rounded-xl border transition-all text-left text-sm ${formData.fantasies.includes(fantasy.id)
                      ? theme === 'dark'
                        ? 'bg-white text-gray-900 border-white'
                        : 'bg-gray-900 text-white border-gray-900'
                      : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Label'ı varsayılan olarak İngilizce alıyoruz */}
                    {fantasy.translations.en?.label || fantasy.category}
                  </motion.button>
                ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border ${theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
            }`}
        >

          <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-800">

            {/* Progress Bar */}
            <div className="flex-1 flex space-x-1 sm:space-x-2 mr-3 sm:mr-6">
              {Array.from({ length: getTotalSteps() }, (_, index) => (
                <div
                  key={index}
                  className={`h-1.5 sm:h-2 flex-1 rounded-full transition-all duration-300 ${index <= getCurrentStepIndex()
                    ? theme === 'dark' ? 'bg-white shadow-sm' : 'bg-gray-900 shadow-sm'
                    : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>

            {/* X Button */}
            <button
              onClick={onClose}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center px-4 sm:px-8 py-4 sm:py-6"
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center ${theme === 'dark' 
              ? 'bg-gray-800' 
              : 'bg-gray-100'
              }`}>
              <currentStepData.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              {currentStepData.title}
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {currentStepData.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 sm:mb-8"
            >
              {renderFormField()}
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {currentStep > 0 && (
                <motion.button
                  onClick={handleBack}
                  className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-200 ${theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Back
                </motion.button>
              )}

              <motion.button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className={`flex-1 flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 ${canProceed() && !isLoading
                  ? theme === 'dark'
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-white/25'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-gray-900/25'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                whileHover={canProceed() && !isLoading ? { scale: 1.02 } : {}}
                whileTap={canProceed() && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2`} />
                    <span className="text-sm sm:text-base">{authMode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">{currentStep === 2 && authMode === 'login' ? 'Sign In' : 
                     isLastStep() ? 'Complete Registration' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </>
                )}
              </motion.button>

              {currentStepData.field === 'preferences' && !isLastStep() && (
                <motion.button
                  onClick={handleSkip}
                  className={`px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-200 ${theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthWizard;
