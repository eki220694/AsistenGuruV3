import api from './apiService';

// Google login
export const googleLogin = async (tokenId: string) => {
  const response = await api.post('/auth/google', { tokenId });
  return response.data;
};

// Get teacher profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Set token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};