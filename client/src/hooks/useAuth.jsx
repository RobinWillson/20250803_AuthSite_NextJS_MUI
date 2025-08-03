import { createContext, useContext } from 'react';

// Define and export the context from this file, making it the single source of truth.
export const AuthContext = createContext(null);

// A custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext); // This now refers to the context in this same file.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};