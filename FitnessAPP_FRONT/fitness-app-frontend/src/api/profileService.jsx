import api from './axiosConfig';

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Nu există profil pentru acest utilizator
      return null;
    }
    throw error.response?.data || error.message;
  }
};

export const createUserProfile = async (profileData) => {
  try {
    const response = await api.post('/api/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};