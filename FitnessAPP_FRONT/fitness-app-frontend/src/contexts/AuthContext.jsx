/* eslint-disable no-useless-catch */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser, 
  logoutUser as apiLogoutUser, 
  isUserLoggedIn, 
  getCurrentUser,
  getToken // Noua funcție adăugată
} from '../api/authService.jsx';

// Creăm contextul de autentificare
export const AuthContext = createContext();

// Hook pentru accesarea contextului
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider-ul contextului
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(''); // Adăugăm token în state

  // La încărcarea componentei, verificăm dacă utilizatorul este deja autentificat
  useEffect(() => {
    const checkLoggedIn = () => {
      if (isUserLoggedIn()) {
        setCurrentUser(getCurrentUser());
        setIsLoggedIn(true);
        // Setăm și token-ul
        setToken(getToken());
      }
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Funcția de autentificare
  const login = async (email, password) => {
    try {
      const userData = await apiLoginUser(email, password);
      setCurrentUser(userData.user);
      setIsLoggedIn(true);
      // Setăm token-ul
      setToken(userData.token);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Funcția de înregistrare
  const register = async (username, email, password) => {
    try {
      const userData = await apiRegisterUser(username, email, password);
      setCurrentUser(userData.user);
      setIsLoggedIn(true);
      // Setăm token-ul
      setToken(userData.token);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Funcția de delogare
  const logout = () => {
    apiLogoutUser();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setToken(''); // Resetăm token-ul
  };

  const value = {
    currentUser,
    isLoggedIn,
    isLoading,
    token, // Expunem token-ul în context
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};