import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './RecipeDetailModal.css';

const RecipeDetailModal = ({ isOpen, onClose, recipe }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Verifică dacă utilizatorul este admin
  const isAdmin = currentUser?.role === 'admin';

  if (!isOpen || !recipe) return null;

  // Handler pentru navigarea către pagina de editare
  const handleEditRecipe = () => {
    navigate(`/recipe/edit/${recipe.id}`);
    onClose(); // Închidem modalul după click
  };

  // Convertim array-ul de ingrediente într-o listă
  const renderIngredients = () => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return <p className="no-data">Nu există ingrediente disponibile</p>;
    }

    return (
      <ul className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="ingredient-item">{ingredient}</li>
        ))}
      </ul>
    );
  };

  // Convertim array-ul de pași într-o listă numerotată
  const renderSteps = () => {
    if (!recipe.steps || recipe.steps.length === 0) {
      return <p className="no-data">Nu există pași de preparare disponibili</p>;
    }

    return (
      <ol className="steps-list">
        {recipe.steps.map((step, index) => (
          <li key={index} className="step-item">{step}</li>
        ))}
      </ol>
    );
  };

  // Convertim array-ul de sfaturi într-o listă
  const renderTips = () => {
    if (!recipe.tips || recipe.tips.length === 0) {
      return <p className="no-data">Nu există sfaturi disponibile</p>;
    }

    return (
      <ul className="tips-list">
        {recipe.tips.map((tip, index) => (
          <li key={index} className="tip-item">{tip}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="recipe-detail-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="recipe-detail-header">
          <h2 className="recipe-title">{recipe.title}</h2>
          
          {/* Adăugăm butonul de editare doar pentru admin */}
          {isAdmin && (
            <button 
              className="edit-recipe-button"
              onClick={handleEditRecipe}
            >
              Editează rețeta
            </button>
          )}
        </div>
        
        {recipe.description && (
          <p className="recipe-description">{recipe.description}</p>
        )}
        
        <div className="recipe-image-container">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
          ) : (
            <div className="recipe-image-placeholder">
              <span>Fără imagine</span>
            </div>
          )}
        </div>
        
        <div className="recipe-meta-info">
          <div className="meta-item">
            <span className="meta-label">Timp preparare:</span>
            <span className="meta-value">{recipe.prepTime} minute</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Porții:</span>
            <span className="meta-value">{recipe.servings}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Calorii:</span>
            <span className="meta-value">{recipe.calories} kcal</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Proteine:</span>
            <span className="meta-value">{recipe.protein}g</span>
          </div>
          {recipe.carbs !== undefined && (
            <div className="meta-item">
              <span className="meta-label">Carbohidrați:</span>
              <span className="meta-value">{recipe.carbs}g</span>
            </div>
          )}
          {recipe.fat !== undefined && (
            <div className="meta-item">
              <span className="meta-label">Grăsimi:</span>
              <span className="meta-value">{recipe.fat}g</span>
            </div>
          )}
        </div>
        
        <div className="recipe-content">
          <div className="recipe-section">
            <h3>Ingrediente</h3>
            {renderIngredients()}
          </div>
          
          <div className="recipe-section">
            <h3>Mod de preparare</h3>
            {renderSteps()}
          </div>
          
          {(recipe.tips && recipe.tips.length > 0) && (
            <div className="recipe-section">
              <h3>Sfaturi și trucuri</h3>
              {renderTips()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;