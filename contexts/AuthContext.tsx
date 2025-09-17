import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, isAuthenticated, removeAuthToken } from '../services/authService';
import type { Teacher } from '../types';

interface AuthContextType {
  teacher: Teacher | null;
  isLoggedIn: boolean;
  login: (teacher: Teacher) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await getProfile();
          setTeacher(response.teacher);
          setIsLoggedIn(true);
        } catch (error) {
          // Token is invalid, remove it
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (teacherData: Teacher) => {
    setTeacher(teacherData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setTeacher(null);
    setIsLoggedIn(false);
    removeAuthToken();
  };

  const value = {
    teacher,
    isLoggedIn,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};