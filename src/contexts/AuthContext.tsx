import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../interfaces/user';



interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token:string | null;
  login: (token:string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token,setToken] = useState<string | null>(null)
  const login = (token:string, userData: User) => {
    setToken(token)
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken("")
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{
        user,
        isAuthenticated: !!token,
        token,
        login,
        logout,
        updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
