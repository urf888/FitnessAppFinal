// Configurări globale pentru aplicație
import React from 'react';

// În Vite, variabilele de mediu sunt expuse prin import.meta.env, nu prin process.env
// URL-ul de bază pentru API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5152/api';

// URL-uri pentru imagini (în cazul în care folosim un CDN sau un serviciu separat)
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5152';

// Setări implicite pentru placeholders de imagini
export const PLACEHOLDER_IMAGES = {
  DEFAULT: '/images/placeholders/default-program.jpg',
  MALE: '/images/placeholders/male.jpg',
  FEMALE: '/images/placeholders/female.jpg',
  WEIGHT_LOSS: {
    MALE: '/images/placeholders/weight-loss-male.jpg',
    FEMALE: '/images/placeholders/weight-loss-female.jpg'
  },
  MUSCLE: {
    MALE: '/images/placeholders/muscle-male.jpg',
    FEMALE: '/images/placeholders/muscle-female.jpg' 
  },
  FITNESS: {
    MALE: '/images/placeholders/fitness-male.jpg',
    FEMALE: '/images/placeholders/fitness-female.jpg'
  }
};

// Configurări pentru caching și optimizări
export const CACHE_CONFIG = {
  ENABLED: true,
  MAX_AGE: 3600, // în secunde (1 oră)
  STORAGE_KEY: 'fitness_app_cache'
};

// Alte configurări
export const APP_CONFIG = {
  DEFAULT_LANGUAGE: 'ro',
  IMAGE_RETRY_ATTEMPTS: 3,
  USE_LOCAL_STORAGE: true
};

export default {
  API_BASE_URL,
  IMAGE_BASE_URL,
  PLACEHOLDER_IMAGES,
  CACHE_CONFIG,
  APP_CONFIG
};