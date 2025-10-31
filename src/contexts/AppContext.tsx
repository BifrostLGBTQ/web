import React, { createContext, useContext, useState, useEffect } from "react";
import { Actions } from "../services/actions";
import { api } from "../services/api";
import i18n from "../i18n";


interface FantasyTranslation {
  id: string;
  fantasy_id: string;
  language: string;
  label: string;
  description: string;
}

interface Fantasy {
  id: string;
  category: string;
  translations: FantasyTranslation[];
}

interface OrientationTranslation {
  id: string;
  orientation_id: string;
  language: string;
  label: string;
}

interface SexualOrientation {
  id: string;
  key: string;
  order: number;
  translations: OrientationTranslation[];
}

interface InterestItem {
  id: string;
  interest_id: string;
  name: Record<string, string>; // örn: { en: "Big bookworm", jp: "大の本好き" }
  emoji?: string;
}

interface Interest {
  id: string;
  name: Record<string, string>; // örn: { en: "Reading and books", jp: "読書" }
  items: InterestItem[];
}

export interface LocalizedString {
  [langCode: string]: string;
}

export interface AttributeItem {
  id: string;
  name: LocalizedString;
  display_order: number;
}

export interface GroupedAttribute {
  category: string;
  attributes: AttributeItem[];
}

interface InitialData {
  fantasies: Fantasy[];
  countries: Record<string, any>;
  interests: Interest[];
  sexual_orientations: SexualOrientation[];
  languages: Record<string, any>;
  attributes: GroupedAttribute[];
  status: string;
}

interface AppContextType {
  data: InitialData | null;
  refresh: () => Promise<void>;
  loading: boolean;
  defaultLanguage: string; // ✅ eklendi
  setDefaultLanguage: (lang: string) => void; // opsiyonel olarak değiştirmek için
}

const AppContext = createContext<AppContextType>({
  data: null,
  refresh: async () => { },
  loading: true,
  defaultLanguage: "en",
  setDefaultLanguage: () => { },

});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<InitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
  const [defaultLanguage, setDefaultLanguage] = useState<string>(storedLang || i18n.language || "en"); // default language from localStorage or i18n


  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.call<InitialData>(Actions.SYSTEM_INITIAL_SYNC);
    
      setData(res);
    } catch (err) {
      console.error("Initial sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh(); // uygulama açıldığında ilk senkron
  }, []);

  // i18n language değiştiğinde defaultLanguage'i güncelle
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDefaultLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <AppContext.Provider value={{ data, refresh, loading, defaultLanguage, setDefaultLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);