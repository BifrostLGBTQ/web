import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Calendar, Heart, Rabbit, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useApp } from '../contexts/AppContext';

interface AuthWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthWizard: React.FC<AuthWizardProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const { data, loading, defaultLanguage, setDefaultLanguage } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    birthDate: '',
    day: '',
    month: '',
    year: '',
    orientation: '',
    preferences: [] as string[]
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
      id: 'nickname',
      title: 'Choose a nickname',
      subtitle: 'How would you like others to call you?',
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

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    const minYear = new Date().getFullYear() - 80;
    const maxYear = new Date().getFullYear() - 18;

    if (newYear >= minYear && newYear <= maxYear) {
      setCurrentYear(newYear);
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const birthDate = selectedDate.day && selectedDate.month && selectedDate.year
        ? `${selectedDate.year}-${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`
        : '';

      const user = {
        id: Date.now().toString(),
        name: formData.nickname,
        nickname: formData.nickname,
        birthDate,
        orientation: formData.orientation,
        preferences: formData.preferences,
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      };
      login(user);
      onClose();
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

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePreference = (preference: string) => {
    const current = formData.preferences;
    if (current.includes(preference)) {
      updateFormData('preferences', current.filter(p => p !== preference));
    } else {
      updateFormData('preferences', [...current, preference]);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const canProceed = () => {
    switch (currentStepData.field) {
      case 'nickname':
        return formData.nickname.trim() !== '';
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
      case 'text':
        return (
          <input
            type="text"
            placeholder={currentStepData.placeholder}
            value={formData[currentStepData.field as keyof typeof formData] as string}
            onChange={(e) => updateFormData(currentStepData.field, e.target.value)}
            className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
              }`}
            autoFocus
          />
        );

      case 'date-picker': {
        // Calculate year range for decade navigation
        const minYear = new Date().getFullYear() - 80;
        const maxYear = new Date().getFullYear() - 18;
        // Month abbreviations
        const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                Object.entries(data.sexual_orientations).map(([key, translation]) => {
                  const label = translation[defaultLanguage] || translation.en; // defaultLanguage varsa onu kullan, yoksa en
                  const isSelected = formData.orientation === key;

                  return (
                    <motion.button
                      key={key}
                      onClick={() => updateFormData("orientation", key)}
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
                Object.values(data.fantasies).map((preference) => (
                  <motion.button
                    key={preference.id}
                    onClick={() => togglePreference(preference.id)}
                    className={`p-3 rounded-xl border transition-all text-left text-sm ${formData.preferences.includes(preference.id)
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
                    {preference.translations.en?.label || preference.category}
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
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
        >

          <div className="flex items-center justify-between p-6 pb-4">

            {/* Progress Bar */}
            <div className="flex-1 flex space-x-2 mr-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${index <= currentStep
                      ? theme === 'dark' ? 'bg-white' : 'bg-gray-900'
                      : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>

            {/* X Button */}
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <X className="w-4 h-4" />
            </button>

          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center px-6"
          >
            <currentStepData.icon className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} />
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              {currentStepData.title}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {currentStepData.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <div className="px-6 pb-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              {renderFormField()}
            </motion.div>

            {/* Actions */}
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <motion.button
                  onClick={handleBack}
                  className={`flex items-center justify-center px-4 py-3 rounded-2xl font-medium transition-colors ${theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </motion.button>
              )}

              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all ${canProceed()
                    ? theme === 'dark'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
              >
                {isLastStep ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>

              {currentStepData.field === 'preferences' && !isLastStep && (
                <motion.button
                  onClick={handleSkip}
                  className={`px-4 py-3 rounded-2xl font-medium transition-colors ${theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
