// app/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 1. Define the shape of the context data
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// 2. Create the context with a safe default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create the custom hook with a runtime check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};