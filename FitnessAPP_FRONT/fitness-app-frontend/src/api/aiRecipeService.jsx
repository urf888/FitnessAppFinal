/* eslint-disable no-unused-vars */
import { API_BASE_URL } from '../config/config';

/**
 * Serviciu pentru gestionarea interacțiunilor cu API-ul de rețete AI
 */
const aiRecipeService = {
  /**
   * Generează o rețetă personalizată bazată pe ingrediente și profilul utilizatorului
   * @param {string} ingredients - Lista de ingrediente pentru rețetă
   * @param {string} token - Token-ul de autentificare
   * @returns {Promise<Object>} - Rețeta generată
   */
  async generateRecipe(ingredients, token) {
    try {
      // Verifică dacă există token în localStorage dacă nu a fost furnizat
      if (!token) {
        token = localStorage.getItem('authToken'); // Folosim cheia corectă din localStorage
        console.log('Token încărcat din localStorage:', !!token);
      }
      
      // Verifică din nou dacă avem token
      if (!token) {
        console.error('Nu s-a găsit niciun token de autentificare');
        throw new Error('Nu ești autentificat. Te rugăm să te conectezi pentru a genera o rețetă.');
      }
      
      if (!ingredients?.trim()) {
        throw new Error('Te rugăm să specifici cel puțin un ingredient.');
      }

      // Construim calea corectă către API
      // Verificăm dacă API_BASE_URL include deja '/api' la sfârșit
      const baseUrl = API_BASE_URL.endsWith('/api') 
        ? API_BASE_URL 
        : `${API_BASE_URL}${API_BASE_URL.endsWith('/') ? '' : '/'}api`;
      
      console.log(`Trimit cerere către: ${baseUrl}/AIRecipe/Recommend`);
      console.log('Folosesc token:', token.substring(0, 10) + '...');

      const response = await fetch(`${baseUrl}/AIRecipe/Recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ingredients })
      });

      console.log('Răspuns primit:', response.status, response.statusText);

      // Verifică dacă cererea a fost realizată cu succes
      if (!response.ok) {
        // Încearcă să extragă detaliile eroarei din răspuns
        const responseText = await response.text();
        console.log('Text răspuns eroare:', responseText);
        
        let errorMessage;
        try {
          // Încearcă să parseze ca JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.title || `Eroare ${response.status}: Nu s-a putut genera rețeta.`;
        } catch (parseError) {
          // Dacă nu este JSON valid, folosește textul brut
          errorMessage = responseText || `Eroare ${response.status}: Nu s-a putut genera rețeta.`;
        }
        
        throw new Error(errorMessage);
      }

      // Procesează răspunsul
      const responseText = await response.text();
      console.log('Text răspuns:', responseText ? 'Conține date' : 'Gol');
      
      // Asigură-te că răspunsul nu este gol înainte de a-l parsa ca JSON
      if (!responseText) {
        throw new Error('Serverul a returnat un răspuns gol. Te rugăm să încerci din nou.');
      }
      
      try {
        const data = JSON.parse(responseText);
        return data;
      } catch (parseError) {
        console.error('Eroare la parsarea răspunsului JSON:', parseError, 'Text original:', responseText);
        throw new Error('A apărut o eroare la procesarea datelor primite de la server.');
      }
    } catch (error) {
      console.error('Eroare la generarea rețetei:', error);
      throw error;
    }
  },

  /**
   * Salvează o rețetă generată în baza de date
   * @param {string} recipeText - Textul rețetei generate
   * @param {string} token - Token-ul de autentificare
   * @returns {Promise<Object>} - Rețeta salvată
   */
  async saveRecipe(recipeText, token) {
    try {
      // Verifică dacă există token în localStorage dacă nu a fost furnizat
      if (!token) {
        token = localStorage.getItem('authToken');
      }
      
      // Verifică din nou dacă avem token
      if (!token) {
        throw new Error('Nu ești autentificat. Te rugăm să te conectezi pentru a salva rețeta.');
      }
      
      if (!recipeText?.trim()) {
        throw new Error('Textul rețetei nu poate fi gol.');
      }

      // Construim calea către API
      const baseUrl = API_BASE_URL.endsWith('/api') 
        ? API_BASE_URL 
        : `${API_BASE_URL}${API_BASE_URL.endsWith('/') ? '' : '/'}api`;
      
      console.log(`Trimit cerere de salvare către: ${baseUrl}/AIRecipe/Save`);

      const response = await fetch(`${baseUrl}/AIRecipe/Save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipeText })
      });

      // Verifică dacă cererea a fost realizată cu succes
      if (!response.ok) {
        const responseText = await response.text();
        
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.title || `Eroare ${response.status}: Nu s-a putut salva rețeta.`;
        } catch (parseError) {
          errorMessage = responseText || `Eroare ${response.status}: Nu s-a putut salva rețeta.`;
        }
        
        throw new Error(errorMessage);
      }

      // Procesează răspunsul
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Eroare la salvarea rețetei:', error);
      throw error;
    }
  }
};

export default aiRecipeService;