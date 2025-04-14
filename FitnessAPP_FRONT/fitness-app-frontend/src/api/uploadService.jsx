// api/uploadService.jsx
import { API_BASE_URL } from '../config/config';
import { getAuthHeaders } from './authService';

const uploadService = {
  /**
   * Încarcă o imagine pe server
   * @param {File} file - Fișierul imagine de încărcat
   * @returns {Promise<Object>} - Răspunsul serverului care conține URL-ul imaginii încărcate
   */
  uploadImage: async (file) => {
    try {
      if (!file) {
        throw new Error('Niciun fișier furnizat pentru încărcare');
      }

      // Verifică dacă fișierul este o imagine
      if (!file.type.startsWith('image/')) {
        throw new Error('Fișierul trebuie să fie o imagine');
      }

      // Creează un obiect FormData pentru a trimite fișierul
      const formData = new FormData();
      formData.append('image', file);

      // Obține header-ele de autorizare
      const headers = await getAuthHeaders();
      // Nu adăugăm Content-Type deoarece fetch îl va seta automat pentru FormData

      // Trimite cererea de încărcare
      const response = await fetch(`${API_BASE_URL}/Upload/Image`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Eroare de încărcare: ${response.status} ${response.statusText}`);
      }

      // Returnează răspunsul cu URL-ul imaginii
      return await response.json();
    } catch (error) {
      console.error('Eroare la încărcarea imaginii:', error);
      throw error;
    }
  },

  /**
   * Validează un fișier imagine înainte de încărcare
   * @param {File} file - Fișierul de validat
   * @param {Object} options - Opțiuni de validare
   * @param {number} options.maxSizeInMB - Dimensiune maximă în MB
   * @param {Array<string>} options.allowedTypes - Tipuri MIME permise
   * @returns {Object} - Rezultatul validării {valid: boolean, message: string}
   */
  validateImageFile: (file, options = {}) => {
    const maxSizeInMB = options.maxSizeInMB || 5; // 5MB implicit
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Verifică dacă fișierul există
    if (!file) {
      return { valid: false, message: 'Niciun fișier selectat' };
    }

    // Verifică dimensiunea fișierului
    if (file.size > maxSizeInBytes) {
      return { 
        valid: false, 
        message: `Fișierul este prea mare. Dimensiunea maximă permisă este de ${maxSizeInMB} MB.` 
      };
    }

    // Verifică tipul fișierului
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        message: `Tip de fișier neacceptat. Tipurile permise sunt: ${allowedTypes.map(type => type.replace('image/', '')).join(', ')}.` 
      };
    }

    return { valid: true, message: 'Fișierul este valid' };
  },

  /**
   * Creează un URL de previzualizare pentru o imagine
   * @param {File} file - Fișierul pentru care se creează previzualizarea
   * @returns {Promise<string>} - URL-ul de previzualizare
   */
  createImagePreview: (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Fișierul nu este o imagine validă'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};

export default uploadService;