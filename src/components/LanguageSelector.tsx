// LanguageSelectorModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { X } from 'lucide-react';


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data, loading, defaultLanguage, setDefaultLanguage } = useApp();
  
  const { theme } = useTheme();

  const modalBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const selectedBg = theme === 'dark' ? 'bg-white text-gray-900' : 'bg-black text-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`${modalBg} rounded-3xl p-6 shadow-2xl w-50 relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat butonu */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className={`text-lg font-semibold mb-4 text-center ${textColor}`}>
              Select Language
            </h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {data && Object.values(data.languages).map((lang) => {
    const isSelected = defaultLanguage === lang.code;

    return (
      <motion.div
        key={lang.code}
        onClick={() => 
            {
                setDefaultLanguage(lang.code)
                onClose()
            }

        }
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        layout
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-medium transition-colors ${
          isSelected ? selectedBg : cardBg
        }`}
      >
        <span className="text-2xl">{lang.flag}</span>
        <span>{lang.name}</span>
      </motion.div>
    );
  })}
</div>
    
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageSelectorModal;