import axios from 'axios';

// API base URL for the backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

interface UsersResponse {
  users: User[];
  page: number;
  totalPages: number;
}

interface UpdateProfileData {
  name: string;
  email: string;
}

// Helper function to handle axios errors properly
const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Network error';
  }
  return error instanceof Error ? error.message : 'Unknown error';
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`
});

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (token: string, page = 1, limit = 10, search = ''): Promise<UsersResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/users?${params}`, {
      headers: getAuthHeaders(token)
    });

    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to fetch users:', errorMessage);
    throw new Error(errorMessage || 'Failed to fetch users');
  }
};

/**
 * Update user role (Admin only)
 */
const updateUserRole = async (userId: string, role: string, token: string): Promise<User> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}/role`,
      { role },
      { headers: getAuthHeaders(token) }
    );

    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to update user role:', errorMessage);
    throw new Error(errorMessage || 'Failed to update user role');
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (userId: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders(token)
    });
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to delete user:', errorMessage);
    throw new Error(errorMessage || 'Failed to delete user');
  }
};

/**
 * Get current user profile
 */
const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(token)
    });

    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to get profile:', errorMessage);
    throw new Error(errorMessage || 'Failed to get profile');
  }
};

/**
 * Update user profile
 */
const updateProfile = async (profileData: UpdateProfileData, token: string): Promise<User> => {
  try {
    // Note: Backend doesn't have this endpoint yet, will need to add it
    const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
      headers: getAuthHeaders(token)
    });

    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    console.error('Failed to update profile:', errorMessage);
    throw new Error(errorMessage || 'Failed to update profile');
  }
};

const userService = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getProfile,
  updateProfile,
};

export default userService;
export type { User, UsersResponse, UpdateProfileData };