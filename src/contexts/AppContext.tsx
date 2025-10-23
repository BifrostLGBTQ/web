import React, { createContext, useContext, useState, useEffect } from "react";
import { Actions } from "../services/actions";
import { api } from "../services/api";

interface InitialData {
  fantasies: Record<string, any>;
  countries: Record<string, any>;
  sexual_orientations:Record<string, any>;
  languages: Record<string, any>;
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
  refresh: async () => {},
  loading: true,
  defaultLanguage: "en",
  setDefaultLanguage: () => {},

});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<InitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState<string>("en"); // default language

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

  return (
    <AppContext.Provider value={{ data, refresh, loading, defaultLanguage, setDefaultLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);