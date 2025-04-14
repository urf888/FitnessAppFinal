/* eslint-disable no-undef */
// Serviciu pentru gestionarea și încărcarea optimizată a imaginilor
import React from 'react';
import { API_BASE_URL } from '../config/config';

// Cache pentru imagini verificate
const imageCache = new Map();

/**
 * Verifică dacă o imagine poate fi încărcată și returnează URL-ul corect
 * @param {string} imageUrl - URL-ul imaginii care trebuie verificată
 * @returns {Promise<string>} - URL-ul corect al imaginii sau null dacă imaginea nu poate fi încărcată
 */
export const verifyImageUrl = async (imageUrl) => {
  if (!imageUrl) return null;
  
  // Verifică dacă imaginea e deja în cache
  if (imageCache.has(imageUrl)) {
    return imageCache.get(imageUrl);
  }
  
  // Verifică dacă URL-ul este absolut sau relativ
  const isAbsoluteUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
  
  // Construiește URL-ul complet
  const fullUrl = isAbsoluteUrl ? imageUrl : `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  
  try {
    // Încearcă să verifice imaginea prin fetch pentru a evita cors issues
    const response = await fetch(fullUrl, { method: 'HEAD' });
    
    if (response.ok) {
      // Imaginea există și poate fi încărcată
      imageCache.set(imageUrl, fullUrl);
      return fullUrl;
    } else {
      console.warn(`Image not found or cannot be loaded: ${fullUrl}`);
      imageCache.set(imageUrl, null);
      return null;
    }
  } catch (error) {
    console.error(`Error verifying image ${fullUrl}:`, error);
    imageCache.set(imageUrl, null);
    return null;
  }
};

/**
 * Preîncarcă imaginile pentru o listă de programe pentru a îmbunătăți experiența utilizatorului
 * @param {Array} programs - Lista de programe cu URL-uri de imagini
 */
export const preloadProgramImages = (programs) => {
  if (!programs || !Array.isArray(programs)) return;
  
  // Preîncarcă primele 10 imagini pentru a evita supraîncărcarea
  const imagesToPreload = programs.slice(0, 10)
    .filter(program => program?.imageUrl)
    .map(program => program.imageUrl);
    
  // Folosește requestIdleCallback pentru a nu afecta performanța
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      imagesToPreload.forEach(imageUrl => {
        verifyImageUrl(imageUrl).then(validUrl => {
          if (validUrl) {
            const img = new Image();
            img.src = validUrl;
          }
        });
      });
    });
  } else {
    // Fallback pentru browsere care nu suportă requestIdleCallback
    setTimeout(() => {
      imagesToPreload.forEach(imageUrl => {
        verifyImageUrl(imageUrl).then(validUrl => {
          if (validUrl) {
            const img = new Image();
            img.src = validUrl;
          }
        });
      });
    }, 1000); // Așteaptă 1 secundă după încărcarea inițială
  }
};

/**
 * Returnează URL-ul imaginii placeholder în funcție de tipul de program și gen
 * @param {Object} program - Programul pentru care se returnează imaginea placeholder
 * @returns {string} - URL-ul imaginii placeholder
 */
export const getProgramPlaceholderImage = (program) => {
  if (!program) return '/placeholders/default-program.jpg';
  
  // Determinăm tipul programului
  const type = program.programType?.toLowerCase() || '';
  // Determinăm genul
  const gender = program.gender?.toLowerCase() || '';
  const isMale = gender.includes('barbat') || gender.includes('masculin');
  
  if (type.includes('slabit')) {
    return isMale ? '/placeholders/weight-loss-male.jpg' : '/placeholders/weight-loss-female.jpg';
  } else if (type.includes('masa')) {
    return isMale ? '/placeholders/muscle-male.jpg' : '/placeholders/muscle-female.jpg';
  } else if (type.includes('fit')) {
    return isMale ? '/placeholders/fitness-male.jpg' : '/placeholders/fitness-female.jpg';
  } else {
    // Folosim imaginea implicită de gen
    return isMale ? '/placeholders/male.jpg' : '/placeholders/female.jpg';
  }
};

// Componentă pentru afișarea imaginilor programelor
export const ProgramImage = ({ program, className, alt }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  React.useEffect(() => {
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
            // Dacă nu putem încărca imaginea, setăm o eroare
            setError(true);
            setLoading(false);
          }
        } else if (isMounted) {
          // Nu avem URL, setăm eroare direct
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading program image:', error);
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
  
  // Efect pentru a folosi imaginea placeholder dacă avem eroare
  React.useEffect(() => {
    if (error && program) {
      const placeholderUrl = getProgramPlaceholderImage(program);
      setImgSrc(placeholderUrl);
    }
  }, [error, program]);
  
  return (
    <div className={`program-image-container ${className || ''}`}>
      {loading ? (
        <div className="image-skeleton-loader"></div>
      ) : (
        <img 
          src={imgSrc} 
          alt={alt || program?.name || 'Program imagine'} 
          className="program-image"
          onError={() => {
            // Dacă avem eroare la încărcare, folosim placeholder-ul default
            setImgSrc('/placeholders/default-program.jpg');
          }}
        />
      )}
    </div>
  );
};

export default {
  verifyImageUrl,
  preloadProgramImages,
  getProgramPlaceholderImage,
  ProgramImage
};