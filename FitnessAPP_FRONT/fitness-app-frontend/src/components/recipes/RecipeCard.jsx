import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import recipeService from '../../api/recipeService';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteChange, isAdmin, onEdit, onClick }) => {
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(recipe.isFavorite || false);
  const [isToggling, setIsToggling] = React.useState(false);

  // Adăugăm un useEffect pentru a actualiza starea când proprietatea recipe se schimbă
  useEffect(() => {
    setIsFavorite(recipe.isFavorite || false);
  }, [recipe.isFavorite]);

  // Adăugăm un log pentru a verifica dacă butonul de editare ar trebui să fie vizibil
  useEffect(() => {
    console.log('Admin status in RecipeCard:', isAdmin, 'Recipe ID:', recipe.id);
  }, [isAdmin, recipe.id]);

  // Conversia tipului de dietă în text afișabil
  const getDietTypeLabel = (dietType) => {
    switch (dietType?.toLowerCase()) {
      case 'carnivor': return 'Carnivor';
      case 'vegetarian': return 'Vegetarian';
      case 'vegan': return 'Vegan';
      default: return dietType;
    }
  };

  // Conversia obiectivului în text afișabil
  const getObjectiveLabel = (objective) => {
    switch (objective?.toLowerCase()) {
      case 'masă': return 'Masă musculară';
      case 'slăbit': return 'Slăbit';
      case 'fit': return 'Fitness';
      default: return objective;
    }
  };

  // Handler pentru editare
  const handleEditClick = (e) => {
    e.stopPropagation(); // Împiedică propagarea către card
    console.log('Edit button clicked for recipe:', recipe.id);
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

    console.log('Toggle favorite pentru rețeta:', recipe.id, 'Status actual:', isFavorite);
    setIsToggling(true);
    
    try {
      if (isFavorite) {
        console.log('Removing from favorites');
        await recipeService.removeFromFavorites(recipe.id);
      } else {
        console.log('Adding to favorites');
        await recipeService.addToFavorites(recipe.id);
      }
      
      // Actualizăm starea locală
      setIsFavorite(!isFavorite);
      console.log('New favorite state:', !isFavorite);
      
      // Notificăm componenta părinte despre schimbare
      if (onFavoriteChange) {
        onFavoriteChange(recipe.id, !isFavorite);
      }
    } catch (error) {
      console.error('Eroare la actualizarea favoritelor:', error);
      // Aici am putea afișa o notificare
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div 
      className={`recipe-card ${recipe.objective?.toLowerCase()}-card`}
      onClick={handleCardClick}
    >
      <div className="recipe-image-container">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
        ) : (
          <div className="recipe-image-placeholder">
            <span>Fără imagine</span>
          </div>
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
        
        {/* Buton de editare - doar pentru administratori cu stiluri inline pentru vizibilitate */}
        {isAdmin === true && (
          <button 
            className="edit-button"
            onClick={handleEditClick}
            aria-label="Editează rețeta"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'white',
              color: '#4b5563',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 100
            }}
          >
            ✎
          </button>
        )}
      </div>
      
      <h3 className="recipe-title">{recipe.title}</h3>
      
      <p className="recipe-description">
        {recipe.description && recipe.description.length > 120
          ? `${recipe.description.substring(0, 120)}...`
          : recipe.description}
      </p>
      
      <div className="recipe-meta">
        <div className="recipe-meta-item">
          <span className="meta-icon">⏱️</span>
          <span>{recipe.prepTime} min</span>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-icon">🔥</span>
          <span>{recipe.calories} kcal</span>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-icon">🥩</span>
          <span>{recipe.protein}g proteină</span>
        </div>
      </div>
      
      <div className="recipe-tags">
        <span className={`recipe-tag diet-tag ${recipe.dietType?.toLowerCase()}`}>
          {getDietTypeLabel(recipe.dietType)}
        </span>
        <span className={`recipe-tag objective-tag ${recipe.objective?.toLowerCase()}`}>
          {getObjectiveLabel(recipe.objective)}
        </span>
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