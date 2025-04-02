/* eslint-disable no-useless-catch */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser, 
  logoutUser as apiLogoutUser, 
  isUserLoggedIn, 
  getCurrentUser 
} from '../api/authService';

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

  // La încărcarea componentei, verificăm dacă utilizatorul este deja autentificat
  useEffect(() => {
    const checkLoggedIn = () => {
      if (isUserLoggedIn()) {
        setCurrentUser(getCurrentUser());
        setIsLoggedIn(true);
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
  };

  const value = {
    currentUser,
    isLoggedIn,
    isLoading,
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