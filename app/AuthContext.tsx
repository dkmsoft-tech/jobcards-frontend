// app/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface DecodedToken extends User { iat: number; exp: number; }

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean; // <-- ADD THIS
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // <-- ADD THIS

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setToken(storedToken);
        setUser({ id: decoded.id, name: decoded.name, role: decoded.role });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false); // <-- ADD THIS
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);
    setToken(newToken);
    setUser({ id: decoded.id, name: decoded.name, role: decoded.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};