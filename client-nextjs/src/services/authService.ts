import { User, AuthResponse } from '@/types/auth';

// This is a MOCK service. In a real app, this would make API calls to your backend.

const FAKE_USER_DATA: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const FAKE_APP_TOKEN = 'fake-jwt-token-for-app-session';

/**
 * Exchanges a Google access token for your application's own session token (JWT).
 * @param googleAccessToken - The access token received from Google Sign-In.
 * @returns A promise that resolves with user data and an app token.
 */
const googleLogin = async (googleAccessToken: string): Promise<AuthResponse> => {
  console.log('Sending Google Access Token to backend:', googleAccessToken);
  // In a real app, you would POST this to your backend:
  // const response = await axios.post('/api/auth/google', { token: googleAccessToken });
  // return response.data;

  // For now, we'll just simulate a successful response.
  return Promise.resolve({ user: FAKE_USER_DATA, token: FAKE_APP_TOKEN });
};

/**
 * Logs in a user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with user data and an app token.
 */
const loginWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  console.log('Attempting to log in with email:', email);
  console.log(password);
  // In a real app, you would POST this to your backend:
  // const response = await axios.post('/api/auth/login', { email, password });
  // return response.data;

  // For now, we'll just simulate a successful response.
  return Promise.resolve({ user: { ...FAKE_USER_DATA, email }, token: FAKE_APP_TOKEN });
};

/**
 * Registers a new user with email and password.
 * @param name - The user's name.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with user data and an app token.
 */
const registerWithEmail = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  console.log('Attempting to register with:', { name, email });
  console.log(password);
  // In a real app, you would POST this to your backend:
  // const response = await axios.post('/api/auth/register', { name, email, password });
  // return response.data;

  // For now, we'll just simulate a successful response.
  return Promise.resolve({ user: { ...FAKE_USER_DATA, name, email }, token: FAKE_APP_TOKEN });
};

/**
 * Fetches the current user's data using the app's session token.
 * @param token - The application's session token (JWT).
 * @returns A promise that resolves with the user's data.
 */
const getMe = async (token: string): Promise<User> => {
  console.log('Verifying app token with backend:', token);
  // Simulate fetching user data with the token
  return Promise.resolve(FAKE_USER_DATA);
};

const authService = { googleLogin, loginWithEmail, registerWithEmail, getMe };

export default authService;