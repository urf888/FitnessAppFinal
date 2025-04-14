import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/config';
import './ImageUploader.css';

/**
 * ImageUploader - Un component React pentru încărcarea și gestionarea imaginilor
 * 
 * Caracteristici principale:
 * - Previzualizare imagine
 * - Validare dimensiune și tip de fișier
 * - Încărcare pe server
 * - Gestionare erori
 * 
 * @param {Object} props - Proprietățile componentei
 * @param {Function} props.onImageUpload - Callback pentru actualizarea URL-ului imaginii
 * @param {string} [props.currentImage=''] - URL-ul imaginii curente
 * @param {string} [props.className=''] - Clase CSS suplimentare
 * @param {number} [props.maxSizeMB=5] - Dimensiunea maximă a fișierului în MB
 */
const ImageUploader = ({ 
  onImageUpload, 
  currentImage = '', 
  className = '', 
  maxSizeMB = 5 
}) => {
  // State pentru previzualizarea imaginii
  const [preview, setPreview] = useState(currentImage);
  
  // State pentru mesajele de eroare
  const [errorMessage, setErrorMessage] = useState('');
  
  // Referință pentru input-ul de fișier
  const fileInputRef = useRef(null);

  /**
   * Gestionează schimbarea fișierului selectat
   * @param {Event} event - Evenimentul de schimbare a fișierului
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    // Validare inițială - verificăm dacă s-a selectat un fișier
    if (!file) {
      setErrorMessage('');
      return;
    }

    // Verificare dimensiune fișier
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
      setErrorMessage(`Dimensiunea maximă a fișierului este de ${maxSizeMB} MB`);
      return;
    }

    // Verificare tip fișier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Format de fișier neacceptat. Alege JPG, PNG, GIF sau WEBP.');
      return;
    }

    // Generare previzualizare locală
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Pregătim datele pentru încărcare
      const formData = new FormData();
      formData.append('file', file);

      // Trimitem imaginea către server
      const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Apelăm callback-ul cu URL-ul imaginii uploadate
      onImageUpload(response.data.url);
      setErrorMessage('');
    } catch (error) {
      console.error('Eroare la încărcarea imaginii:', error);
      setErrorMessage('Nu s-a putut încărca imaginea. Încearcă din nou.');
      // Resetăm previzualizarea la imaginea curentă în caz de eroare
      setPreview(currentImage);
    }
  };

  /**
   * Declanșează selectorul de fișiere
   */
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  /**
   * Șterge imaginea curentă
   */
  const clearImage = () => {
    setPreview('');
    setErrorMessage('');
    onImageUpload('');
    // Resetăm input-ul de fișier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-uploader ${className}`}>
      {/* Input ascuns pentru selectarea fișierelor */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />
      
      <div className="image-upload-container">
        {preview ? (
          // Mod previzualizare cu imagine
          <div className="image-preview-wrapper">
            <img 
              src={preview} 
              alt="Previzualizare imagine" 
              className="image-preview" 
            />
            <div className="image-actions">
              <button 
                type="button" 
                onClick={triggerFileInput} 
                className="change-image-btn"
              >
                Schimbă imaginea
              </button>
              <button 
                type="button" 
                onClick={clearImage} 
                className="clear-image-btn"
              >
                Șterge imaginea
              </button>
            </div>
          </div>
        ) : (
          // Mod fără imagine
          <div className="no-image-placeholder">
            <p>Nicio imagine selectată</p>
            <button 
              type="button" 
              onClick={triggerFileInput} 
              className="upload-image-btn"
            >
              Încarcă imagine
            </button>
          </div>
        )}
      </div>
      
      {/* Afișare mesaj de eroare */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;