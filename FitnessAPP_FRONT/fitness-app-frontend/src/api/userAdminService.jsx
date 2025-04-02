import api from './axiosConfig';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/user/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/api/user/${id}`);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetUserPassword = async (id, newPassword) => {
  try {
    const response = await api.post(`/api/user/ResetPassword/${id}`, { newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserStats = async () => {
  try {
    const response = await api.get('/api/user/Stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Returnează valori implicite în caz de eroare
    return {
      totalUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
      usersWithProfiles: 0,
      usersWithoutProfiles: 0
    };
  }
};