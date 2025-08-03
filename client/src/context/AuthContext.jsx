import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { AuthContext } from '../hooks/useAuth'; // Import context from its new single source

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token) {
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
    verifyUserSession();
  }, []); // Run only once on initial mount to check for existing session

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  // We render children only after the initial loading is complete to avoid flicker
  return (
    <AuthContext.Provider value={ value }>
      { !loading && children }
    </AuthContext.Provider>
  );
};
