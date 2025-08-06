'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';
import { AuthContext } from '@/hooks/useAuth';
import { User, AuthContextType } from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize token from localStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      
      // If we're on client side and no token exists, immediately stop loading
      if (!storedToken) {
        setLoading(false);
      }
    } else {
      // If we're on server side, immediately stop loading
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token && typeof window !== 'undefined') {
        try {
          // If a token exists, try to fetch the user data
          const userData = await authService.getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to verify token, logging out:', error);
          // If token is invalid, clear it from state and storage
          logout();
        }
      }
      setLoading(false);
    };

    // Only run verification if we have a token and we're on client side
    if (token && typeof window !== 'undefined') {
      verifyUserSession();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData: User, userToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', userToken);
    }
    setToken(userToken);
    setUser(userData);
    setLoading(false); // Immediately stop loading when login is called
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  // Always render children to prevent blocking
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};