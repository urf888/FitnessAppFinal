// api/recipeService.jsx
import { API_BASE_URL } from '../config/config';
import { getAuthHeaders } from './authService';

// Obiectul serviciului pentru rețete
const recipeService = {
  // Obține toate rețetele (cu filtre)
  getRecipes: async (filters = {}) => {
    try {
      // Construim parametrii de query din filtre
      const queryParams = new URLSearchParams();
      
      if (filters.dietType) queryParams.append('DietType', filters.dietType);
      if (filters.objective) queryParams.append('Objective', filters.objective);
      if (filters.proteinContent) queryParams.append('ProteinContent', filters.proteinContent);
      if (filters.maxCalories) queryParams.append('MaxCalories', filters.maxCalories);
      if (filters.minProtein) queryParams.append('MinProtein', filters.minProtein);
      if (filters.maxPrepTime) queryParams.append('MaxPrepTime', filters.maxPrepTime);
      if (filters.searchTerm) queryParams.append('SearchTerm', filters.searchTerm);
      if (filters.favoritesOnly) queryParams.append('FavoritesOnly', 'true');
      
      // Dacă avem filtre adăugăm '?' urmat de parametrii de query
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Obținem header-ele de autorizare dacă utilizatorul este logat
      let headers = null;
      try {
        headers = await getAuthHeaders();
      } catch (error) {
        console.warn('Nu s-au putut obține header-ele de autorizare:', error);
      }
      
      const requestOptions = headers ? { headers } : {};
      const apiUrl = `${API_BASE_URL}/Recipe${queryString}`;
      console.log('Fetching recipes from:', apiUrl);
      
      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-au putut obține rețetele');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare getRecipes:', error);
      throw error;
    }
  },

  // Obține o rețetă după ID
  getRecipeById: async (id) => {
    try {
      // Obținem header-ele de autorizare dacă utilizatorul este logat pentru a primi informații despre favorite
      let headers = null;
      try {
        headers = await getAuthHeaders();
      } catch (error) {
        console.warn('Nu s-au putut obține header-ele de autorizare:', error);
      }
      
      const requestOptions = headers ? { headers } : {};
      const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a găsit rețeta cu ID-ul ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare getRecipeById(${id}):`, error);
      throw error;
    }
  },

  // Obține rețete recomandate pentru utilizatorul curent
  getRecommendedRecipes: async (count = 3) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(
        `${API_BASE_URL}/Recipe/Recommended?count=${count}`, 
        { headers }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-au putut obține rețetele recomandate');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare getRecommendedRecipes:', error);
      throw error;
    }
  },

  // Căutare rețete după termen
  searchRecipes: async (term) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Recipe/Search?term=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-au putut căuta rețetele');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare searchRecipes(${term}):`, error);
      throw error;
    }
  },

  // Obține rețete după tipul dietei
  getRecipesByDietType: async (dietType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Recipe/DietType/${dietType}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-au putut obține rețetele pentru dieta ${dietType}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare getRecipesByDietType(${dietType}):`, error);
      throw error;
    }
  },

  // Obține rețete după obiectiv
  getRecipesByObjective: async (objective) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Recipe/Objective/${objective}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-au putut obține rețetele pentru obiectivul ${objective}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare getRecipesByObjective(${objective}):`, error);
      throw error;
    }
  },

  // Obține rețete după conținut proteic
  getRecipesByProteinContent: async (proteinContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Recipe/ProteinContent/${proteinContent}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-au putut obține rețetele pentru conținutul proteic ${proteinContent}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare getRecipesByProteinContent(${proteinContent}):`, error);
      throw error;
    }
  },

  // Creează o rețetă nouă (necesită autentificare de admin)
  createRecipe: async (recipeData) => {
    try {
      const headers = await getAuthHeaders();
      headers.append('Content-Type', 'application/json');
      
      const response = await fetch(`${API_BASE_URL}/Recipe`, {
        method: 'POST',
        headers,
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-a putut crea rețeta');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare createRecipe:', error);
      throw error;
    }
  },

  // Actualizează o rețetă existentă (necesită autentificare de admin)
  updateRecipe: async (id, recipeData) => {
    try {
      const headers = await getAuthHeaders();
      headers.append('Content-Type', 'application/json');
      
      const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a putut actualiza rețeta cu ID-ul ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare updateRecipe(${id}):`, error);
      throw error;
    }
  },

  // Șterge o rețetă (necesită autentificare de admin)
  deleteRecipe: async (id) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/Recipe/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a putut șterge rețeta cu ID-ul ${id}`);
      }
      
      return true; // Returnăm true dacă s-a șters cu succes
    } catch (error) {
      console.error(`Eroare deleteRecipe(${id}):`, error);
      throw error;
    }
  },

  // Adaugă o rețetă la favorite
  addToFavorites: async (recipeId) => {
    try {
      const headers = await getAuthHeaders();
      
      // Folosim endpoint-ul corect pentru adăugarea la favorite
      const response = await fetch(`${API_BASE_URL}/Recipe/favorite/${recipeId}`, {
        method: 'POST',
        headers
      });
      
      console.log(`Calling: ${API_BASE_URL}/Recipe/favorite/${recipeId} [POST]`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a putut adăuga rețeta cu ID-ul ${recipeId} la favorite`);
      }
      
      return true;
    } catch (error) {
      console.error(`Eroare addToFavorites(${recipeId}):`, error);
      throw error;
    }
  },

  // Elimină o rețetă din favorite
  removeFromFavorites: async (recipeId) => {
    try {
      const headers = await getAuthHeaders();
      
      // Folosim endpoint-ul corect pentru eliminarea din favorite
      const response = await fetch(`${API_BASE_URL}/Recipe/favorite/${recipeId}`, {
        method: 'DELETE',
        headers
      });
      
      console.log(`Calling: ${API_BASE_URL}/Recipe/favorite/${recipeId} [DELETE]`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a putut elimina rețeta cu ID-ul ${recipeId} din favorite`);
      }
      
      return true;
    } catch (error) {
      console.error(`Eroare removeFromFavorites(${recipeId}):`, error);
      throw error;
    }
  },

  // Obține rețetele favorite ale utilizatorului
  getFavoriteRecipes: async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Folosim endpoint-ul corect pentru obținerea rețetelor favorite
      const response = await fetch(`${API_BASE_URL}/Recipe/favorites`, {
        headers
      });
      
      console.log(`Calling: ${API_BASE_URL}/Recipe/favorites [GET]`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-au putut obține rețetele favorite');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare getFavoriteRecipes:', error);
      throw error;
    }
  },

  // Verifică dacă o rețetă este favorită
  isFavorite: async (recipeId) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/Recipe/${recipeId}/isFavorite`, {
        headers
      });
      
      if (!response.ok) {
        // Dacă primim 401 înseamnă că utilizatorul nu este autentificat, deci nu poate avea favorite
        if (response.status === 401) {
          return false;
        }
        
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || `Nu s-a putut verifica dacă rețeta cu ID-ul ${recipeId} este favorită`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Eroare isFavorite(${recipeId}):`, error);
      return false; // În caz de eroare, presupunem că nu este favorită
    }
  },

  // Încarcă o imagine
  uploadImage: async (file) => {
    try {
      const headers = await getAuthHeaders();
      // Nu adăugăm Content-Type pentru că fetch va seta automat cu boundary pentru FormData
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/Upload/Image`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData || 'Nu s-a putut încărca imaginea');
      }
      
      return await response.json(); // Presupunem că serverul returnează URL-ul imaginii
    } catch (error) {
      console.error('Eroare uploadImage:', error);
      throw error;
    }
  }
};

export default recipeService;