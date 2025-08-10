import { User, AuthResponse, RegisterResponse } from '@/types/auth';
import axios from 'axios';

// API base URL for the backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Helper function to handle axios errors properly
const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Network error';
  }
  return error instanceof Error ? error.message : 'Unknown error';
};

/**
 * Exchanges a Google ID token for your application's own session token (JWT).
 * @param googleIdToken - The ID token received from Google Sign-In.
 * @returns A promise that resolves with user data and an app token.
 */
const googleLogin = async (googleIdToken: string): Promise<AuthResponse> => {
  try {
    console.log('Sending Google ID Token to backend for authentication');
    const response = await axios.post(`${API_BASE_URL}/auth/google`, { 
      token: googleIdToken 
    });
    
    // Get user data from the token
    const userData = await getMe(response.data.token);
    
    return { 
      user: userData, 
      token: response.data.token 
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Google login failed:', errorMessage);
    throw new Error(errorMessage || 'Google login failed');
  }
};

/**
 * Logs in a user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with user data and an app token.
 */
const loginWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Attempting to log in with email:', email);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { 
      email, 
      password 
    });

    // Get user data from the token
    const userData = await getMe(response.data.token);
    
    return { 
      user: userData, 
      token: response.data.token 
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Email login failed:', errorMessage);
    throw new Error(errorMessage || 'Login failed');
  }
};

/**
 * Registers a new user with email and password.
 * @param name - The user's name.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with user data and an app token.
 */
const registerWithEmail = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    console.log('Attempting to register with:', { name, email });
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { 
      name, 
      email, 
      password 
    });

    // Check if this is the new email verification flow
    if (response.data.emailSent) {
      return {
        message: response.data.message,
        emailSent: response.data.emailSent
      };
    }
    
    // Old flow - get user data from token (fallback)
    if (response.data.token) {
      const userData = await getMe(response.data.token);
      return { 
        user: userData, 
        token: response.data.token 
      };
    }
    
    // Return raw response if neither case matches
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Registration failed:', errorMessage);
    throw new Error(errorMessage || 'Registration failed');
  }
};

/**
 * Fetches the current user's data using the app's session token.
 * @param token - The application's session token (JWT).
 * @returns A promise that resolves with the user's data.
 */
const getMe = async (token: string): Promise<User> => {
  try {
    console.log('Fetching user data from backend');
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      isAdmin: response.data.isAdmin || false,
      emailVerified: response.data.emailVerified || false
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to fetch user data:', errorMessage);
    throw new Error(errorMessage || 'Failed to fetch user data');
  }
};

/**
 * Sends a password reset email to the user.
 * @param email - The user's email address.
 * @returns A promise that resolves with a success message.
 */
const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    console.log('Sending password reset request for email:', email);
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { 
      email 
    });
    
    return { message: response.data.message };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Forgot password failed:', errorMessage);
    throw new Error(errorMessage || 'Failed to send password reset email');
  }
};

const authService = { googleLogin, loginWithEmail, registerWithEmail, getMe, forgotPassword };

export default authService;