// app/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react'; // 1. Import useCallback
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

// Define the shape of the decoded token
interface DecodedToken extends User {
  iat: number;
  exp: number;
}

// Define the shape of the context data
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      localStorage.removeItem('token'); // Clear invalid token
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Wrap the login function in useCallback
  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);
    setToken(newToken);
    setUser({ id: decoded.id, name: decoded.name, role: decoded.role });
  }, []);

  // 3. Wrap the logout function in useCallback
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};