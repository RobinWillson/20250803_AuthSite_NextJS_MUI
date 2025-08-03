import axios from 'axios';

const API_URL = '/api/users';
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
};

export default userService;

