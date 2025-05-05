import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import recipeService from '../../api/recipeService';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteChange, isAdmin, onEdit, onClick }) => {
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);
  const [isToggling, setIsToggling] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Adăugăm un useEffect pentru a actualiza starea când proprietatea recipe se schimbă
  useEffect(() => {
    setIsFavorite(recipe.isFavorite || false);
  }, [recipe.isFavorite]);

  // Conversia tipului de dietă în text afișabil
  const getDietTypeLabel = (dietType) => {
    switch (dietType?.toLowerCase()) {
      case 'carnivor': return 'Carnivor';
      case 'vegetarian': return 'Vegetarian';
      case 'vegan': return 'Vegan';
      default: return dietType || 'Mix';
    }
  };

  // Conversia obiectivului în text afișabil
  const getObjectiveLabel = (objective) => {
    switch (objective?.toLowerCase()) {
      case 'masă': return 'Masă musculară';
      case 'slăbit': return 'Slăbit';
      case 'fit': return 'Fitness';
      default: return objective || 'General';
    }
  };

  // Handler pentru editare - disponibil doar pentru admin
  const handleEditClick = (e) => {
    e.stopPropagation(); // Împiedică propagarea către card
    if (onEdit) {
      onEdit(recipe);
    }
  };

  // Handler pentru click pe card - afișează detaliile rețetei
  const handleCardClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  // Handler pentru adăugare/eliminare din favorite
  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Împiedică propagarea către card pentru a nu deschide detaliile
    
    if (!isLoggedIn || isToggling) return;

    setIsToggling(true);
    
    try {
      if (isFavorite) {
        await recipeService.removeFromFavorites(recipe.id);
      } else {
        await recipeService.addToFavorites(recipe.id);
      }
      
      // Actualizăm starea locală
      setIsFavorite(!isFavorite);
      
      // Notificăm componenta părinte despre schimbare
      if (onFavoriteChange) {
        onFavoriteChange(recipe.id, !isFavorite);
      }
    } catch (error) {
      console.error('Eroare la actualizarea favoritelor:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Funcție pentru a genera un placeholder pentru imagine
  const getPlaceholderImage = () => {
    // Selectăm culoarea bazată pe tipul de obiectiv
    const objectiveType = recipe.objective?.toLowerCase() || 'fit';
    
    // Mapăm obiectivele la culori
    const colorMap = {
      'masă': '#dbeafe', // albastru deschis
      'slăbit': '#fee2e2', // roșu deschis
      'fit': '#d1fae5', // verde deschis
    };
    
    const backgroundColor = colorMap[objectiveType] || '#f3f4f6';
    
    // Generăm o iconiță bazată pe obiectiv
    const emojiMap = {
      'masă': '🍗',
      'slăbit': '🥗',
      'fit': '🥑',
    };
    
    const emoji = emojiMap[objectiveType] || '🍳';
    
    return (
      <div 
        style={{
          backgroundColor,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '1rem'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{emoji}</div>
        <div style={{ 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#333',
          fontSize: '0.9rem',
          wordBreak: 'break-word'
        }}>
          {recipe.title}
        </div>
      </div>
    );
  };

  // CSS class pentru card bazat pe tipul de obiectiv
  const cardClass = `recipe-card ${recipe.objective?.toLowerCase()}-card`;

  return (
    <div 
      className={cardClass}
      onClick={handleCardClick}
    >
      <div className="recipe-image-container">
        {imageError || !recipe.imageUrl ? (
          getPlaceholderImage()
        ) : (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="recipe-image"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Buton de favorite - doar pentru utilizatori logați */}
        {isLoggedIn && (
          <button 
            className={`favorite-button ${isFavorite ? 'is-favorite' : ''} ${isToggling ? 'toggling' : ''}`}
            onClick={handleToggleFavorite}
            disabled={isToggling}
            aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
        
        {/* Buton de editare - doar pentru administratori */}
        {isAdmin && (
          <button 
            className="edit-button"
            onClick={handleEditClick}
            aria-label="Editează rețeta"
          >
            ✎
          </button>
        )}
      </div>
      
      <h3 className="recipe-title">{recipe.title}</h3>
      
      <p className="recipe-description">
        {recipe.description && recipe.description.length > 120
          ? `${recipe.description.substring(0, 120)}...`
          : recipe.description || 'O rețetă delicioasă și sănătoasă.'}
      </p>
      
      <div className="recipe-meta">
        <div className="recipe-meta-item">
          <span className="meta-icon">⏱️</span>
          <span>{recipe.prepTime || 'N/A'} min</span>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-icon">🔥</span>
          <span>{recipe.calories || 'N/A'} kcal</span>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-icon">🥩</span>
          <span>{recipe.protein || 'N/A'}g proteină</span>
        </div>
      </div>
      
      <div className="recipe-tags">
        {recipe.dietType && (
          <span className={`recipe-tag diet-tag ${recipe.dietType?.toLowerCase()}`}>
            {getDietTypeLabel(recipe.dietType)}
          </span>
        )}
        
        {recipe.objective && (
          <span className={`recipe-tag objective-tag ${recipe.objective?.toLowerCase()}`}>
            {getObjectiveLabel(recipe.objective)}
          </span>
        )}
        
        {recipe.proteinContent === 'ridicat' && (
          <span className="recipe-tag protein-tag">
            Proteină ridicată
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;