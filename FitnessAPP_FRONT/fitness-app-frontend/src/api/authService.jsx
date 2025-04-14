import api from './axiosConfig';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    
    // Salvăm token-ul și informațiile utilizatorului în localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    
    // Salvăm token-ul și informațiile utilizatorului în localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const isUserAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Adăugăm funcția getAuthHeaders necesară pentru încărcarea imaginilor și operațiuni cu rețetele
export const getAuthHeaders = async () => {
  const token = getToken();
  const headers = new Headers();
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  return headers;
};