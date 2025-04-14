import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import RecipeCard from '../components/recipes/RecipeCardAI';
import { useAuth } from '../contexts/AuthContext';
import aiRecipeService from '../api/aiRecipeService';
import './AIRecipePage.css';

const AIRecipePage = () => {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Verificăm dacă utilizatorul este autentificat la încărcarea componentei
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/ai-recipes' } });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      setError('Te rugăm să introduci cel puțin un ingredient.');
      return;
    }

    // Verifică dacă token-ul este disponibil înainte de a face cererea
    if (!token) {
      setError('Nu ești autentificat. Te rugăm să te conectezi din nou.');
      navigate('/login', { state: { redirectTo: '/ai-recipes' } });
      return;
    }

    setSaveSuccess(false);
    setLoading(true);
    setError('');
    
    try {
      // Utilizează serviciul pentru a genera rețeta
      const data = await aiRecipeService.generateRecipe(ingredients, token);
      setRecipe(data.recipe);
    } catch (error) {
      setError(error.message || 'A apărut o eroare. Te rugăm să încerci din nou.');
      console.error('Error getting recipe recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    
    setSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      await aiRecipeService.saveRecipe(recipe, token);
      setSaveSuccess(true);
    } catch (error) {
      setError('Nu am putut salva rețeta. Te rugăm să încerci din nou.');
      console.error('Error saving recipe:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ai-recipe-page">
      <Navbar />
      
      <div className="recipe-generator-container">
        <div className="recipe-generator-header">
          <h1>Generator de rețete personalizate cu AI</h1>
          <p>
            Specifică ingredientele pe care dorești să le folosești, iar inteligența artificială
            va crea o rețetă personalizată adaptată profilului tău și obiectivelor tale.
          </p>
          <p className="info-text">
            <strong>Notă:</strong> Rețeta va ține cont automat de restricțiile tale alimentare și de alergii.
          </p>
        </div>
        
        <div className="recipe-form-container">
          <form onSubmit={handleSubmit} className="recipe-form">
            <div className="form-group">
              <label htmlFor="ingredients">Ingrediente disponibile:</label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ex: piept de pui, broccoli, orez, usturoi, ulei de măsline..."
                rows={5}
                required
              />
              <small>Separă ingredientele prin virgulă sau scrie-le pe linii separate.</small>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="generate-button"
              disabled={loading}
            >
              {loading ? 'Se generează...' : 'Generează rețetă'}
            </button>
          </form>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Inteligența artificială creează o rețetă personalizată pentru tine...<br/>
            Acest proces poate dura până la 30 de secunde.</p>
          </div>
        )}
        
        {recipe && !loading && (
          <div className="recipe-result">
            {/* Utilizăm doar componenta RecipeCard */}
            <RecipeCard recipe={recipe} />
            
            <div className="recipe-actions">
              <button 
                onClick={handleSaveRecipe}
                className="save-recipe-button"
                disabled={saving}
              >
                {saving ? 'Se salvează...' : 'Salvează în colecție'}
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(recipe);
                  alert('Rețeta a fost copiată în clipboard!');
                }}
                className="copy-button"
                disabled={saving}
              >
                Copiază rețeta
              </button>
              
              <button 
                onClick={() => {
                  setRecipe(null);
                  setSaveSuccess(false);
                }}
                className="reset-button"
                disabled={saving}
              >
                Generează altă rețetă
              </button>
            </div>
            
            {saveSuccess && (
              <div className="success-message">
                <p>Rețeta a fost salvată cu succes în colecția ta!</p>
                <button onClick={() => navigate('/recipes')} className="view-recipes-button">
                  Vezi toate rețetele tale
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipePage;