/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
// Importăm configurațiile
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGES } from '../../config/config';
import './ProgramImage.css';

// Cache pentru imagini verificate
const imageCache = new Map();

const ProgramImage = ({ program, className, alt }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Verifică dacă o imagine există fără a folosi cereri fetch
  const verifyImageUrl = async (imageUrl) => {
    if (!imageUrl) return null;
    
    // Verifică dacă imaginea e deja în cache
    if (imageCache.has(imageUrl)) {
      return imageCache.get(imageUrl);
    }
    
    // Curăță și normalizează URL-ul
    let normalizedUrl = imageUrl;
    
    // Verifică dacă e o cale de fișier Windows sau Linux
    if (normalizedUrl.includes(':\\') || normalizedUrl.includes('/')) {
      // Este o cale de fișier, extragem doar numele fișierului
      const parts = normalizedUrl.split(/[\\\/]/);
      const filename = parts[parts.length - 1];
      normalizedUrl = `/images/programs/${filename}`;
    }
    
    // Verifică dacă URL-ul este absolut sau relativ
    const isAbsoluteUrl = normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://');
    
    // Construiește URL-ul complet
    const fullUrl = isAbsoluteUrl ? normalizedUrl : `${IMAGE_BASE_URL}${normalizedUrl.startsWith('/') ? '' : '/'}${normalizedUrl}`;
    
    try {
      // Testăm dacă imaginea poate fi încărcată
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          // Imaginea s-a încărcat cu succes
          imageCache.set(imageUrl, fullUrl);
          resolve(fullUrl);
        };
        
        img.onerror = () => {
          // Imaginea nu a putut fi încărcată
          console.warn(`Imaginea nu a fost găsită sau nu poate fi încărcată: ${fullUrl}`);
          imageCache.set(imageUrl, null);
          resolve(null);
        };
        
        // Setăm sursa imaginii pentru a declanșa încărcarea
        img.src = fullUrl;
      });
    } catch (error) {
      console.warn(`Eroare la verificarea imaginii ${fullUrl}. Folosim placeholder.`);
      imageCache.set(imageUrl, null);
      return null;
    }
  };

  // Returnează URL-ul imaginii placeholder în funcție de tipul de program și gen
  const getProgramPlaceholderImage = (program) => {
    if (!program) return `${IMAGE_BASE_URL}${PLACEHOLDER_IMAGES.DEFAULT}`;
    
    try {
      // Determinăm tipul programului
      const type = program.programType?.toLowerCase() || '';
      // Determinăm genul
      const gender = program.gender?.toLowerCase() || '';
      const isMale = gender.includes('barbat') || gender.includes('masculin');
      
      let placeholderPath;
      
      if (type.includes('slabit')) {
        placeholderPath = isMale ? PLACEHOLDER_IMAGES.WEIGHT_LOSS.MALE : PLACEHOLDER_IMAGES.WEIGHT_LOSS.FEMALE;
      } else if (type.includes('masa')) {
        placeholderPath = isMale ? PLACEHOLDER_IMAGES.MUSCLE.MALE : PLACEHOLDER_IMAGES.MUSCLE.FEMALE;
      } else if (type.includes('fit')) {
        placeholderPath = isMale ? PLACEHOLDER_IMAGES.FITNESS.MALE : PLACEHOLDER_IMAGES.FITNESS.FEMALE;
      } else {
        // Folosim imaginea implicită de gen
        placeholderPath = isMale ? PLACEHOLDER_IMAGES.MALE : PLACEHOLDER_IMAGES.FEMALE;
      }
      
      // Construim URL-ul complet pentru placeholder
      return `${IMAGE_BASE_URL}${placeholderPath}`;
    } catch (error) {
      console.warn('Eroare la obținerea imaginii placeholder:', error);
      return `${IMAGE_BASE_URL}${PLACEHOLDER_IMAGES.DEFAULT}`;
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);
    
    const loadImage = async () => {
      try {
        if (program?.imageUrl) {
          // Verifică dacă imaginea poate fi încărcată
          const validUrl = await verifyImageUrl(program.imageUrl);
          
          if (validUrl && isMounted) {
            setImgSrc(validUrl);
            setLoading(false);
          } else if (isMounted) {
            // Dacă nu putem încărca imaginea, folosim placeholder direct
            const placeholderUrl = getProgramPlaceholderImage(program);
            setImgSrc(placeholderUrl);
            setError(true);
            setLoading(false);
          }
        } else if (isMounted) {
          // Nu avem URL, folosim placeholder direct
          const placeholderUrl = getProgramPlaceholderImage(program);
          setImgSrc(placeholderUrl);
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.warn('Eroare la încărcarea imaginii programului, folosim placeholder:', error);
          const placeholderUrl = getProgramPlaceholderImage(program);
          setImgSrc(placeholderUrl);
          setError(true);
          setLoading(false);
        }
      }
    };
    
    loadImage();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [program?.id, program?.imageUrl]);
  
  return (
    <div className={`program-image-container ${className || ''}`}>
      {loading ? (
        <div className="image-skeleton-loader"></div>
      ) : (
        <img 
          src={imgSrc || getProgramPlaceholderImage(program)} 
          alt={alt || program?.name || 'Program imagine'} 
          className="program-image"
          onError={() => {
            // Fallback în caz de eroare la încărcare, folosim placeholder-ul default
            console.warn("Eroare la încărcarea imaginii, folosim placeholder");
            setImgSrc(`${IMAGE_BASE_URL}${PLACEHOLDER_IMAGES.DEFAULT}`);
          }}
        />
      )}
    </div>
  );
};

export default ProgramImage;