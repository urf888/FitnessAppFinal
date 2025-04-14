import React from 'react';
import './RecommendationCard.css';

// Card component pentru a afișa o recomandare zilnică integrată
// Combină atât un program de fitness cât și o recomandare de masă
const RecommendationCard = ({ program, recipe, onViewProgram, onViewRecipe }) => {
  // Verifică dacă avem date pentru card
  if (!program || !recipe) {
    return null;
  }

  // Funcție pentru a formata timpul în ore și minute
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

  return (
    <div className="recommendation-card">
      <div className="card-header">
        <h3>Recomandare zilnică</h3>
        <div className="quick-stats">
          <span className="stat-tag">Proteine: {recipe.protein}g</span>
          <span className="stat-tag">Calorii: {recipe.calories}</span>
          <span className="stat-tag">Durată: {formatTime(program.workoutsPerWeek * 45)}/săpt</span>
        </div>
      </div>
      
      <div className="card-content">
        <div className="fitness-section">
          <h4>Program fitness</h4>
          <div className="program-preview">
            <div className="program-image">
              {program.imageUrl ? (
                <img src={program.imageUrl} alt={program.name} />
              ) : (
                <div className="placeholder-image">
                  <span className="placeholder-text">{program.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="program-details">
              <h5>{program.name}</h5>
              <div className="program-tags">
                <span className="program-tag">{program.programType}</span>
                <span className="program-tag">{program.difficultyLevel}</span>
                <span className="program-tag">{program.gender}</span>
              </div>
              <p className="program-description">
                {program.description.length > 100 
                  ? `${program.description.substring(0, 100)}...` 
                  : program.description}
              </p>
            </div>
          </div>
          <button className="view-button" onClick={() => onViewProgram(program.id)}>
            Vezi program
          </button>
        </div>
        
        <div className="nutrition-section">
          <h4>Recomandare de masă</h4>
          <div className="recipe-preview">
            <div className="recipe-image">
              {recipe.imageUrl ? (
                <img src={recipe.imageUrl} alt={recipe.title} />
              ) : (
                <div className="placeholder-image">
                  <span className="placeholder-text">{recipe.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="recipe-details">
              <h5>{recipe.title}</h5>
              <div className="recipe-tags">
                {recipe.dietTypes.map((type, index) => (
                  <span key={index} className="recipe-tag">{type}</span>
                ))}
              </div>
              <div className="recipe-macros">
                <span className="macro">
                  <i className="macro-icon protein-icon"></i>
                  {recipe.protein}g
                </span>
                <span className="macro">
                  <i className="macro-icon carbs-icon"></i>
                  {recipe.carbs}g
                </span>
                <span className="macro">
                  <i className="macro-icon fat-icon"></i>
                  {recipe.fat}g
                </span>
              </div>
            </div>
          </div>
          <button className="view-button" onClick={() => onViewRecipe(recipe)}>
            Vezi rețeta
          </button>
        </div>
      </div>
      
      <div className="recommendation-footer">
        <button className="generate-button" onClick={() => window.location.reload()}>
          Generează altă recomandare
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;