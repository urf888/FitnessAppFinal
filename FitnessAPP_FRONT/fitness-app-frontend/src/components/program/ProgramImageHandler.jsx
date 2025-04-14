/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

// Importă imaginile statice pentru a fi folosite ca fallback
// (Acestea trebuie să existe în directorul public)
const fallbackImages = {
  default: '/placeholders/default-program.jpg',
  weightLoss: {
    male: '/placeholders/weight-loss-male.jpg',
    female: '/placeholders/weight-loss-female.jpg'
  },
  muscle: {
    male: '/placeholders/muscle-male.jpg',
    female: '/placeholders/muscle-female.jpg'
  },
  fitness: {
    male: '/placeholders/fitness-male.jpg',
    female: '/placeholders/fitness-female.jpg'
  }
};

const ProgramImage = ({ program, className }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Resetăm starea imaginii când programul se schimbă
    setLoading(true);
    setError(false);
    
    // Decidem dacă să folosim imaginea din DB sau una implicită
    if (program?.imageUrl) {
      // Verificăm dacă URL-ul începe cu http sau https
      // Dacă nu, presupunem că este un path relativ la API
      let imageUrl = program.imageUrl;
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        // Corectăm URL-ul adăugând baseUrl-ul
        const apiBaseUrl = process.env.REACT_APP_API_URL || '';
        imageUrl = `${apiBaseUrl}${imageUrl}`;
      }
      
      // Verificăm dacă imaginea există și poate fi încărcată
      const img = new Image();
      img.onload = () => {
        setImgSrc(imageUrl);
        setLoading(false);
      };
      img.onerror = () => {
        console.warn(`Failed to load image from URL: ${imageUrl}`);
        setError(true);
        setLoading(false);
        // Va folosi fallback prin efectul următor
      };
      img.src = imageUrl;
    } else {
      // Nu avem URL pentru imagine, vom folosi fallback
      setError(true);
      setLoading(false);
    }
  }, [program?.id, program?.imageUrl]);

  // Efect pentru a stabili imaginea de fallback
  useEffect(() => {
    if (error || !imgSrc) {
      // Alegem imaginea implicită potrivită în funcție de tipul programului și gen
      let fallbackImage = fallbackImages.default;
      
      if (program) {
        // Determinăm tipul programului
        const type = program.programType?.toLowerCase() || '';
        // Determinăm genul
        const gender = program.gender?.toLowerCase() || '';
        const isMale = gender.includes('barbat') || gender.includes('masculin');
        
        if (type.includes('slabit')) {
          fallbackImage = isMale ? fallbackImages.weightLoss.male : fallbackImages.weightLoss.female;
        } else if (type.includes('masa')) {
          fallbackImage = isMale ? fallbackImages.muscle.male : fallbackImages.muscle.female;
        } else if (type.includes('fit')) {
          fallbackImage = isMale ? fallbackImages.fitness.male : fallbackImages.fitness.female;
        } else {
          // Folosim imaginea implicită de gen
          fallbackImage = isMale ? '/placeholders/male.jpg' : '/placeholders/female.jpg';
        }
      }
      
      setImgSrc(fallbackImage);
      setLoading(false);
    }
  }, [error, imgSrc, program]);

  return (
    <div className={`program-image-container ${className || ''}`}>
      {loading ? (
        <div className="image-skeleton-loader"></div>
      ) : (
        <img 
          src={imgSrc} 
          alt={program?.name || 'Program imagine'} 
          className="program-image"
          onError={() => {
            console.warn("Error loading image even after fallback");
            // Încercăm ultima șansă cu imaginea default
            if (imgSrc !== fallbackImages.default) {
              setImgSrc(fallbackImages.default);
            }
          }}
        />
      )}
    </div>
  );
};

export default ProgramImage;