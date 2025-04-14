import React, { useState } from 'react';
import './RecipeList.css';

const RecipeList = ({ recipes, onSelectRecipe }) => {
  // State pentru a urmări imaginile care nu s-au încărcat
  const [failedImages, setFailedImages] = useState({});

  // Format time (minutes to hours and minutes)
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'oră' : 'ore'}`;
    }
    
    return `${hours} ${hours === 1 ? 'oră' : 'ore'} ${remainingMinutes} min`;
  };

  // Determine recipe difficulty level based on prep time and steps complexity
  const getDifficulty = (recipe) => {
    // This is a simple heuristic - you can make it more sophisticated
    const { prepTime, steps } = recipe;
    
    if (!prepTime) return 'Medie';
    
    if (prepTime < 20 && steps.length < 5) return 'Ușoară';
    if (prepTime > 60 || steps.length > 10) return 'Dificilă';
    return 'Medie';
  };

  // Get badge class based on recipe score
  const getBadgeClass = (score) => {
    if (score >= 20) return 'excellent-match';
    if (score >= 10) return 'good-match';
    return 'fair-match';
  };

  // Get match text based on recipe score
  const getMatchText = (score) => {
    if (score >= 20) return 'Potrivire excelentă';
    if (score >= 10) return 'Potrivire bună';
    return 'Potrivire acceptabilă';
  };

  // Funcție pentru generarea unei imagini placeholder bazată pe tipul de dietă
  const getPlaceholderImage = (recipe) => {
    // Selectăm culoarea bazată pe tipul de dietă principal
    const dietType = recipe.dietTypes[0] || 'balanced';
    
    // Mapăm tipurile de diete la culori
    const colorMap = {
      'high-protein': '#A5D6A7', // verde deschis
      'low-calorie': '#BBDEFB', // albastru deschis
      'balanced': '#81C784', // verde mediu
      'high-carb': '#FFE082', // galben
      'low-carb': '#CE93D8', // mov deschis
      'balanced-vegan': '#C5E1A5', // verde-galben
      'balanced-vegetarian': '#AED581', // verde-galben deschis
    };
    
    const backgroundColor = colorMap[dietType] || '#9CCC65';
    
    // Generăm o combinație unică de emoji sau iconiță bazată pe tipul de dietă
    const emojiMap = {
      'high-protein': '🍗',
      'low-calorie': '🥗',
      'balanced': '🍽️',
      'high-carb': '🍚',
      'low-carb': '🥩',
      'balanced-vegan': '🥑',
      'balanced-vegetarian': '🥦',
    };
    
    const emoji = emojiMap[dietType] || '🍳';
    
    const categoryName = dietType.replace('-', ' ');
    
    // Stil pentru containerul SVG
    return (
      <div 
        className="recipe-placeholder-image" 
        style={{
          backgroundColor,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{emoji}</div>
        <div style={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>{recipe.title}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.8, textAlign: 'center', marginTop: '0.5rem' }}>
          {categoryName}
        </div>
      </div>
    );
  };

  return (
    <div className="recipe-list-container">
      <h3>Rețete Recomandate</h3>
      
      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>Nu am găsit rețete care să se potrivească cu criteriile tale. Încearcă să adaugi mai multe ingrediente sau să modifici criteriile de căutare.</p>
        </div>
      ) : (
        <>
          <p className="results-count">Am găsit {recipes.length} rețete pentru tine</p>
          
          <div className="recipe-cards">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="recipe-card"
                onClick={() => onSelectRecipe(recipe)}
              >
                <div className="recipe-image">
                  {failedImages[recipe.id] ? (
                    getPlaceholderImage(recipe)
                  ) : (
                    <img 
                      src={recipe.imageUrl || '/images/placeholder/recipe-default.jpg'}
                      alt={recipe.title}
                      onError={() => {
                        setFailedImages(prev => ({
                          ...prev,
                          [recipe.id]: true
                        }));
                      }}
                    />
                  )}
                  <span className={`match-badge ${getBadgeClass(recipe.score)}`}>
                    {getMatchText(recipe.score)}
                  </span>
                </div>
                
                <div className="recipe-info">
                  <h4>{recipe.title}</h4>
                  
                  <div className="recipe-meta">
                    <div className="meta-item">
                      <i className="meta-icon calories-icon"></i>
                      <span>{recipe.calories} kcal</span>
                    </div>
                    
                    <div className="meta-item">
                      <i className="meta-icon time-icon"></i>
                      <span>{formatTime(recipe.prepTime)}</span>
                    </div>
                    
                    <div className="meta-item">
                      <i className="meta-icon difficulty-icon"></i>
                      <span>{getDifficulty(recipe)}</span>
                    </div>
                  </div>
                  
                  {recipe.matchedIngredients && recipe.matchedIngredients.length > 0 && (
                    <div className="matched-ingredients">
                      <span className="matched-label">Ingrediente potrivite:</span>
                      <div className="ingredient-tags">
                        {recipe.matchedIngredients.map((ingredient, index) => {
                          // Obține variația potrivită dacă există
                          const variation = recipe.matchedVariations ? recipe.matchedVariations[index] : null;
                          const showVariation = variation && variation !== ingredient && !variation.includes(ingredient);
                          
                          return (
                            <span key={index} className="ingredient-tag">
                              {ingredient}
                              {showVariation && (
                                <span className="variation-hint">
                                  {" "}<span className="hint-text">({variation})</span>
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <button className="view-recipe-button">
                    Vezi Rețeta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeList;