import React, { useState } from 'react';
import './RecipeDetailModal.css';

const RecipeDetailModal = ({ isOpen, onClose, recipe }) => {
  // State pentru a urmări dacă imaginea nu s-a încărcat
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !recipe) return null;

  // Format time (minutes to hours and minutes)
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    
    if (minutes < 60) {
      return `${minutes} minute`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'oră' : 'ore'}`;
    }
    
    return `${hours} ${hours === 1 ? 'oră' : 'ore'} și ${remainingMinutes} minute`;
  };

  // Format macronutrients
  const formatMacro = (value, unit = 'g') => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}${unit}`;
  };

  // Determine recipe difficulty level
  const getDifficulty = () => {
    // Simple heuristic
    const { prepTime, steps } = recipe;
    
    if (!prepTime) return 'Medie';
    
    if (prepTime < 20 && steps?.length < 5) return 'Ușoară';
    if (prepTime > 60 || steps?.length > 10) return 'Dificilă';
    return 'Medie';
  };

  // Funcție pentru a genera un placeholder pentru imagine
  const getImagePlaceholder = () => {
    const dietType = recipe.dietType || 'carnivor';
    const backgroundColor = dietType === 'vegan' ? '#C5E1A5' : 
                           dietType === 'vegetarian' ? '#AED581' : '#9CCC65';
    
    const emoji = dietType === 'vegan' ? '🥑' : 
                 dietType === 'vegetarian' ? '🥦' : '🍗';
    
    return (
      <div 
        className="recipe-placeholder-container" 
        style={{
          backgroundColor,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>
        <div style={{ fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: '1.5rem' }}>
          {recipe.title}
        </div>
      </div>
    );
  };

  return (
    <div className="recipe-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="recipe-detail-content">
          <div className="recipe-header">
            <h2>{recipe.title}</h2>
            
            <div className="recipe-tags">
              <span className={`diet-tag ${recipe.dietType}`}>{recipe.dietType}</span>
              <span className="objective-tag">{recipe.objective}</span>
              <span className="difficulty-tag">{getDifficulty()}</span>
            </div>
          </div>
          
          <div className="recipe-main-content">
            <div className="recipe-image-container">
              {imageError ? (
                getImagePlaceholder()
              ) : (
                <img 
                  src={recipe.imageUrl || '/images/placeholder/recipe-detail.jpg'} 
                  alt={recipe.title}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            
            <div className="recipe-details">
              <div className="recipe-time-info">
                <div className="time-item">
                  <span className="time-label">Timp de preparare:</span>
                  <span className="time-value">{formatTime(recipe.prepTime)}</span>
                </div>
                
                <div className="time-item">
                  <span className="time-label">Porții:</span>
                  <span className="time-value">{recipe.servings || 2}</span>
                </div>
              </div>
              
              <div className="recipe-nutrition">
                <h3>Informații nutriționale</h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-value">{recipe.calories}</span>
                    <span className="nutrition-label">Calorii</span>
                  </div>
                  
                  <div className="nutrition-item">
                    <span className="nutrition-value">{formatMacro(recipe.protein)}</span>
                    <span className="nutrition-label">Proteine</span>
                  </div>
                  
                  <div className="nutrition-item">
                    <span className="nutrition-value">{formatMacro(recipe.carbs)}</span>
                    <span className="nutrition-label">Carbohidrați</span>
                  </div>
                  
                  <div className="nutrition-item">
                    <span className="nutrition-value">{formatMacro(recipe.fat)}</span>
                    <span className="nutrition-label">Grăsimi</span>
                  </div>
                  
                  <div className="nutrition-item">
                    <span className="nutrition-value">{formatMacro(recipe.fiber)}</span>
                    <span className="nutrition-label">Fibre</span>
                  </div>
                  
                  <div className="nutrition-item">
                    <span className="nutrition-value">{formatMacro(recipe.sugar)}</span>
                    <span className="nutrition-label">Zahăr</span>
                  </div>
                </div>
              </div>
              
              <div className="recipe-description">
                <p>{recipe.description || "O rețetă delicioasă și sănătoasă pentru tine."}</p>
              </div>
            </div>
          </div>
          
          <div className="recipe-content-columns">
            <div className="ingredients-section">
              <h3>Ingrediente</h3>
              <ul className="ingredients-list">
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="steps-section">
              <h3>Metoda de preparare</h3>
              <ol className="steps-list">
                {recipe.steps && recipe.steps.map((step, index) => (
                  <li key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">{step}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="recipe-tips">
              <h3>Sfaturi pentru preparare</h3>
              <ul className="tips-list">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="tip-item">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;