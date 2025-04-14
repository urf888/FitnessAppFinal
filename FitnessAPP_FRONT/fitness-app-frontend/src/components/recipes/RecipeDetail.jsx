/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './RecipeDetail.css';

const RecipeDetail = ({ recipe, onBack }) => {
  // State pentru a urmări dacă imaginea nu s-a încărcat
  const [imageError, setImageError] = useState(false);

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
  const getDifficulty = (recipe) => {
    // This is a simple heuristic - you can make it more sophisticated
    const { prepTime, steps } = recipe;
    
    if (!prepTime) return 'Medie';
    
    if (prepTime < 20 && steps.length < 5) return 'Ușoară';
    if (prepTime > 60 || steps.length > 10) return 'Dificilă';
    return 'Medie';
  };

  // Funcție pentru a genera un placeholder pentru imagine
  const getImagePlaceholder = () => {
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
        <div style={{ fontSize: '1rem', opacity: 0.8, textAlign: 'center', marginTop: '1rem' }}>
          {categoryName}
        </div>
      </div>
    );
  };

  // Funcție pentru a verifica dacă un ingredient este în lista de ingrediente potrivite
  const isIngredientMatched = (ingredient) => {
    if (!recipe.matchedIngredients) return false;
    
    const ingredientLower = ingredient.toLowerCase();
    
    return recipe.matchedIngredients.some(matched => 
      ingredientLower.includes(matched.toLowerCase())
    );
  };

  // Funcție pentru a obține variația potrivită pentru un ingredient
  const getMatchVariation = (ingredient) => {
    if (!recipe.matchedIngredients || !recipe.matchedVariations) return null;
    
    const ingredientLower = ingredient.toLowerCase();
    
    // Găsim indexul ingredientului potrivit
    for (let i = 0; i < recipe.matchedIngredients.length; i++) {
      const matchedIngredient = recipe.matchedIngredients[i].toLowerCase();
      
      if (ingredientLower.includes(matchedIngredient)) {
        return recipe.matchedVariations[i];
      }
    }
    
    return null;
  };

  return (
    <div className="recipe-detail-container">
      <button 
        className="back-button"
        onClick={onBack}
      >
        ← Înapoi la lista de rețete
      </button>
      
      <div className="recipe-detail-content">
        <div className="recipe-header">
          <h2>{recipe.title}</h2>
          
          <div className="recipe-tags">
            {recipe.dietTypes.map((diet, index) => (
              <span key={index} className="diet-tag">{diet}</span>
            ))}
            <span className="difficulty-tag">{getDifficulty(recipe)}</span>
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
                <span className="time-label">Timp total:</span>
                <span className="time-value">{formatTime(recipe.totalTime || recipe.prepTime)}</span>
              </div>
              
              <div className="time-item">
                <span className="time-label">Porții:</span>
                <span className="time-value">{recipe.servings || 4}</span>
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
              <p>{recipe.description || "O rețetă delicioasă și sănătoasă care se potrivește cu profilul și preferințele tale."}</p>
            </div>
          </div>
        </div>
        
        <div className="recipe-content-columns">
          <div className="ingredients-section">
            <h3>Ingrediente</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => {
                // Verifică dacă acest ingredient este printre cele potrivite
                const isMatched = isIngredientMatched(ingredient);
                
                // Clasa CSS specială pentru ingredientele potrivite
                const ingredientClass = isMatched ? "ingredient-item matched-ingredient" : "ingredient-item";
                
                // Împărțim ingredientul în cantitate și nume (primul cuvânt vs. restul)
                const parts = ingredient.split(' ');
                const quantity = parts[0];
                const name = parts.slice(1).join(' ');
                
                return (
                  <li key={index} className={ingredientClass}>
                    <span className="ingredient-quantity">{quantity}</span>
                    <span className="ingredient-name">
                      {name}
                      {isMatched && (
                        <span className="ingredient-match-badge" title="Ingredient disponibil">✓</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            
            {recipe.matchedIngredients && recipe.matchedIngredients.length > 0 && (
              <div className="matched-ingredients-box">
                <h4>Ingrediente pe care le ai deja:</h4>
                <div className="matched-tags">
                  {recipe.matchedIngredients.map((ingredient, index) => {
                    // Obține variația potrivită dacă există
                    const variation = recipe.matchedVariations ? recipe.matchedVariations[index] : null;
                    const showVariation = variation && variation !== ingredient && !variation.includes(ingredient);
                    
                    return (
                      <span key={index} className="matched-tag">
                        {ingredient}
                        {showVariation && (
                          <span className="variation-hint">
                            {" "}<span className="hint-text">(găsit ca: {variation})</span>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="steps-section">
            <h3>Metoda de preparare</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="recipe-tips">
          {recipe.tips && (
            <>
              <h3>Sfaturi pentru preparare</h3>
              <ul className="tips-list">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="tip-item">{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        <div className="nutrition-note">
          <p>
            <strong>Notă:</strong> Această rețetă a fost recomandată pentru tine pe baza profilului tău 
            și a obiectivelor tale fitness. Valorile nutriționale sunt estimate și pot varia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;