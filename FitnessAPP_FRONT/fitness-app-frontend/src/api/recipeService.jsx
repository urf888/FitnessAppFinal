/* eslint-disable no-unused-vars */
// api/recipeService.jsx
import { API_BASE_URL } from '../config/config';
import { getAuthHeaders } from './authService';

/**
 * Serviciu pentru gestionarea operațiunilor legate de rețete
 */
const recipeService = {
  /**
   * Obține toate rețetele sau rețetele filtrate
   * @param {Object} filters - Filtrele pentru rețete
   * @returns {Promise<Array>} - Lista de rețete
   */
  async getRecipes(filters = {}) {
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
      let headers = {};
      try {
        headers = await getAuthHeaders();
      } catch (error) {
        console.warn('Nu s-au putut obține header-ele de autorizare:', error);
      }
      
      const requestOptions = { headers };
      const apiUrl = `${API_BASE_URL}/Recipe${queryString}`;
      console.log('Fetching recipes from:', apiUrl);
      
      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received recipes:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },
  
  /**
   * Obține o rețetă după ID
   * @param {number} id - ID-ul rețetei
   * @returns {Promise<Object>} - Rețeta
   */
  async getRecipeById(id) {
    try {
      // Obținem header-ele de autorizare dacă utilizatorul este logat pentru a primi informații despre favorite
      let headers = {};
      try {
        headers = await getAuthHeaders();
      } catch (error) {
        console.warn('Nu s-au putut obține header-ele de autorizare:', error);
      }
      
      const requestOptions = { headers };
      const url = `${API_BASE_URL}/Recipe/${id}`;
      console.log('Fetching recipe from:', url);
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received recipe:', data.title || data.id);
      return data;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Obține rețete recomandate pentru utilizatorul curent
   * @param {number} count - Numărul de rețete recomandate
   * @returns {Promise<Array>} - Lista de rețete recomandate
   */
  async getRecommendedRecipes(count = 3) {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/Recommended?count=${count}`;
      console.log('Fetching recommended recipes');
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended recipes:', error);
      throw error;
    }
  },
  
  /**
   * Căutare rețete după termen
   * @param {string} term - Termenul de căutare
   * @returns {Promise<Array>} - Lista de rețete care corespund termenului
   */
  async searchRecipes(term) {
    try {
      const url = `${API_BASE_URL}/Recipe/Search?term=${encodeURIComponent(term)}`;
      console.log('Searching recipes with term:', term);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },
  
  /**
   * Crează o rețetă nouă
   * @param {Object} recipeData - Datele rețetei
   * @returns {Promise<Object>} - Rețeta creată
   */
  async createRecipe(recipeData) {
    try {
      const headers = await getAuthHeaders();
      headers.append('Content-Type', 'application/json');
      
      // Formatăm datele și validăm înainte de trimitere
      const formattedData = this.formatRecipeData(recipeData);
      const validation = this.validateRecipe(formattedData);
      
      if (!validation.valid) {
        throw new Error(`Erori de validare: ${validation.errors.join(', ')}`);
      }
      
      const url = `${API_BASE_URL}/Recipe`;
      console.log('Creating recipe:', formattedData.title);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Recipe created successfully with ID:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },
  
  /**
   * Actualizează o rețetă existentă
   * @param {number} id - ID-ul rețetei
   * @param {Object} recipeData - Datele actualizate ale rețetei
   * @returns {Promise<Object>} - Rețeta actualizată
   */
  async updateRecipe(id, recipeData) {
    try {
      const headers = await getAuthHeaders();
      headers.append('Content-Type', 'application/json');
      
      // Formatăm datele și validăm înainte de trimitere
      const formattedData = this.formatRecipeData(recipeData);
      const validation = this.validateRecipe(formattedData);
      
      if (!validation.valid) {
        throw new Error(`Erori de validare: ${validation.errors.join(', ')}`);
      }
      
      const url = `${API_BASE_URL}/Recipe/${id}`;
      console.log('Updating recipe:', id, formattedData.title);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Recipe updated successfully:', id);
      return data;
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Șterge o rețetă
   * @param {number} id - ID-ul rețetei
   * @returns {Promise<boolean>} - True dacă ștergerea a reușit
   */
  async deleteRecipe(id) {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/${id}`;
      console.log('Deleting recipe:', id);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Recipe deleted successfully:', id);
      return true;
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Adaugă o rețetă la favorite
   * @param {number} recipeId - ID-ul rețetei
   * @returns {Promise<boolean>} - True dacă operațiunea a reușit
   */
  async addToFavorites(recipeId) {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/favorite/${recipeId}`;
      console.log('Adding recipe to favorites:', recipeId);
      
      const response = await fetch(url, {
        method: 'POST',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Recipe added to favorites successfully:', recipeId);
      return true;
    } catch (error) {
      console.error(`Error adding recipe ${recipeId} to favorites:`, error);
      throw error;
    }
  },
  
  /**
   * Elimină o rețetă din favorite
   * @param {number} recipeId - ID-ul rețetei
   * @returns {Promise<boolean>} - True dacă operațiunea a reușit
   */
  async removeFromFavorites(recipeId) {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/favorite/${recipeId}`;
      console.log('Removing recipe from favorites:', recipeId);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Recipe removed from favorites successfully:', recipeId);
      return true;
    } catch (error) {
      console.error(`Error removing recipe ${recipeId} from favorites:`, error);
      throw error;
    }
  },
  
  /**
   * Verifică dacă o rețetă este favorită
   * @param {number} recipeId - ID-ul rețetei
   * @returns {Promise<boolean>} - True dacă rețeta este favorită
   */
  async isFavorite(recipeId) {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/${recipeId}/isFavorite`;
      
      const response = await fetch(url, {
        headers
      });
      
      if (!response.ok) {
        // Dacă primim 401 înseamnă că utilizatorul nu este autentificat, deci nu poate avea favorite
        if (response.status === 401) {
          return false;
        }
        
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error checking if recipe ${recipeId} is favorite:`, error);
      return false; // În caz de eroare, presupunem că nu este favorită
    }
  },
  
  /**
   * Obține rețetele favorite ale utilizatorului
   * @returns {Promise<Array>} - Lista de rețete favorite
   */
  async getFavoriteRecipes() {
    try {
      const headers = await getAuthHeaders();
      
      const url = `${API_BASE_URL}/Recipe/favorites`;
      console.log('Fetching favorite recipes');
      
      const response = await fetch(url, {
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      throw error;
    }
  },
  
  /**
   * Încarcă o imagine pentru rețetă
   * @param {File} file - Fișierul imagine
   * @returns {Promise<Object>} - Rezultatul încărcării (URL-ul)
   */
  async uploadImage(file) {
    try {
      const headers = await getAuthHeaders();
      // Nu adăugăm Content-Type pentru că fetch va seta automat cu boundary pentru FormData
      
      const formData = new FormData();
      formData.append('image', file);
      
      const url = `${API_BASE_URL}/Upload/Image`;
      console.log('Uploading image...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Image uploaded successfully');
      return data; // Presupunem că serverul returnează URL-ul imaginii
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  /**
   * Generează un id unic temporar pentru rețetele noi (pentru interfață)
   * @returns {string} - Id-ul temporar
   */
  generateTempId() {
    return `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  },
  
  /**
   * Validează datele unei rețete înainte de trimitere
   * @param {Object} recipeData - Datele rețetei
   * @returns {Object} - Obiect cu validarea {valid: boolean, errors: []}
   */
  validateRecipe(recipeData) {
    const errors = [];
    
    // Verifică câmpurile obligatorii
    if (!recipeData.title?.trim()) {
      errors.push('Titlul este obligatoriu');
    }
    
    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      errors.push('Trebuie să adaugi cel puțin un ingredient');
    }
    
    if (!recipeData.steps || recipeData.steps.length === 0) {
      errors.push('Trebuie să adaugi cel puțin un pas de preparare');
    }
    
    // Verifică valorile numerice
    if (recipeData.prepTime <= 0) {
      errors.push('Timpul de preparare trebuie să fie mai mare decât 0');
    }
    
    if (recipeData.servings <= 0) {
      errors.push('Numărul de porții trebuie să fie mai mare decât 0');
    }
    
    if (recipeData.calories < 0) {
      errors.push('Numărul de calorii nu poate fi negativ');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Formatează datele unei rețete pentru trimitere către API
   * @param {Object} recipeData - Datele rețetei
   * @returns {Object} - Datele formatate
   */
  formatRecipeData(recipeData) {
    // Omitem câmpurile care nu trebuie trimise către server
    const { isFavorite, matchedIngredients, matchedVariations, score, ...dataToSend } = recipeData;
    
    // Asigură-te că avem array-uri goale în loc de null pentru colecții
    return {
      ...dataToSend,
      ingredients: dataToSend.ingredients || [],
      steps: dataToSend.steps || [],
      tips: dataToSend.tips || []
    };
  }
};

export default recipeService;