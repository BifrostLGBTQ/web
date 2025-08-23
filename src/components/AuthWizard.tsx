import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Calendar, Heart, Rabbit, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext.tsx';

interface AuthWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthWizard: React.FC<AuthWizardProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const orientations = [
    'Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Asexual', 'Demisexual', 'Queer', 'Questioning', 'Other'
  ];

  const sexualPreferences = [
    'Vanilla sex', 'Kissing', 'Oral sex', 'Anal sex', 'Rough sex', 'Slow sex',
    'Role play', 'BDSM', 'Bondage', 'Spanking', 'Dirty talk', 'Outdoor',
    'Threesome', 'Group sex', 'Fetish', 'Lingerie', 'Massage', 'Tantra'
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

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.day === day && 
                        selectedDate.month === currentMonth + 1 && 
                        selectedDate.year === currentYear;
      
      days.push(
        <motion.button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
            isSelected
              ? theme === 'dark'
                ? 'bg-white text-gray-900'
                : 'bg-gray-900 text-white'
              : theme === 'dark'
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-900 hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
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
            className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:border-opacity-100 transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
            }`}
            autoFocus
          />
        );

      case 'date-picker':
        return (
          <div className="space-y-4">
            {/* Selected Date Display */}
            {selectedDate.day && selectedDate.month && selectedDate.year && (
              <div className={`text-center p-4 rounded-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}>
                <div className="text-lg font-semibold">
                  {selectedDate.day} {months[selectedDate.month - 1]} {selectedDate.year}
                </div>
              </div>
            )}

            {/* Calendar */}
            <div className={`p-4 rounded-2xl border ${
              theme === 'dark' 
                ? 'bg-gray-800/30 border-gray-700' 
                : 'bg-gray-50/30 border-gray-200'
            }`}>
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  onClick={() => navigateMonth('prev')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center space-x-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {months[currentMonth]}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => navigateYear('prev')}
                      className={`p-1 rounded transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </motion.button>
                    
                    <span className={`text-lg font-semibold min-w-[60px] text-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentYear}
                    </span>
                    
                    <motion.button
                      onClick={() => navigateYear('next')}
                      className={`p-1 rounded transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={() => navigateMonth('next')}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className={`text-center text-xs font-medium py-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="grid grid-cols-2 gap-3">
            {orientations.map(orientation => (
              <motion.button
                key={orientation}
                onClick={() => updateFormData('orientation', orientation)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.orientation === orientation
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
                <span className="font-medium text-sm">{orientation}</span>
              </motion.button>
            ))}
          </div>
        );

      case 'multi-select':
        return (
          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {sexualPreferences.map(preference => (
                <motion.button
                  key={preference}
                  onClick={() => togglePreference(preference)}
                  className={`p-3 rounded-xl border transition-all text-left text-sm ${
                    formData.preferences.includes(preference)
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
                  {preference}
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
          className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Progress */}
            <div className="flex space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index <= currentStep
                      ? theme === 'dark' ? 'bg-white' : 'bg-gray-900'
                      : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <currentStepData.icon className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} />
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {currentStepData.title}
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentStepData.subtitle}
              </p>
            </motion.div>
          </div>

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
                  className={`flex items-center justify-center px-4 py-3 rounded-2xl font-medium transition-colors ${
                    theme === 'dark'
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
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all ${
                  canProceed()
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
                  className={`px-4 py-3 rounded-2xl font-medium transition-colors ${
                    theme === 'dark'
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
