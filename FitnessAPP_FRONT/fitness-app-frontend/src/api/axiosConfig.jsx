import axios from 'axios';

const API_URL = 'http://localhost:5152'; // Adresa API-ului tău

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adaugare interceptor pentru a include token-ul în toate cererile
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pentru gestionarea erorilor de autentificare
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Dacă primim o eroare 401 (Unauthorized), deconectăm utilizatorul
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;