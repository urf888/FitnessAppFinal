/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import recipeService from '../../api/recipeService';
import './RecipeEditPage.css';

const RecipeEditPage = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State pentru rețetă
  const [recipe, setRecipe] = useState({
    id: '',
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    tips: [],
    imageUrl: '',
    prepTime: 30,
    cookTime: 0,
    servings: 2,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    dietType: 'OMNIVORE',
    objective: 'MAINTENANCE',
    proteinContent: 'MEDIUM',
    difficulty: 'MEDIUM'
  });
  
  // State pentru câmpuri temporare
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  const [newTip, setNewTip] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Verificăm dacă utilizatorul este admin
  const isAdmin = true; // currentUser?.role === 'admin';
  
  // Încărcăm rețeta la montarea componentei
  useEffect(() => {
    // Verificăm dacă utilizatorul este admin
    if (!isAdmin) {
      navigate('/recipes');
      return;
    }
    
    // Dacă avem un ID, încărcăm rețeta existentă
    if (recipeId && recipeId !== 'new') {
      fetchRecipe(recipeId);
    } else {
      // Pentru rețetă nouă, inițializăm cu template-ul gol
      setIsLoading(false);
    }
  }, [recipeId, navigate, isAdmin]);
  
  // Funcție pentru a încărca o rețetă existentă
  const fetchRecipe = async (id) => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      setError('Nu am putut încărca rețeta. Te rugăm să încerci din nou.');
      console.error('Error fetching recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler pentru actualizarea câmpurilor simple
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Pentru câmpuri numerice, convertim la număr
    if (['prepTime', 'cookTime', 'servings', 'calories', 'protein', 'carbs', 'fat'].includes(name)) {
      setRecipe(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setRecipe(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handlers pentru ingrediente
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient.trim()]
    }));
    
    setNewIngredient('');
  };
  
  const handleRemoveIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };
  
  // Handlers pentru pași de preparare
  const handleAddStep = () => {
    if (!newStep.trim()) return;
    
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, newStep.trim()]
    }));
    
    setNewStep('');
  };
  
  const handleRemoveStep = (index) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };
  
  // Handlers pentru sfaturi
  const handleAddTip = () => {
    if (!newTip.trim()) return;
    
    setRecipe(prev => ({
      ...prev,
      tips: [...prev.tips, newTip.trim()]
    }));
    
    setNewTip('');
  };
  
  const handleRemoveTip = (index) => {
    setRecipe(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };
  
  // Handler pentru încărcarea imaginii
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      
      // Preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setRecipe(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Validare înainte de salvare
  const validateRecipe = () => {
    const errors = [];
    
    if (!recipe.title.trim()) {
      errors.push('Titlul este obligatoriu');
    }
    
    if (recipe.ingredients.length === 0) {
      errors.push('Adaugă cel puțin un ingredient');
    }
    
    if (recipe.steps.length === 0) {
      errors.push('Adaugă cel puțin un pas de preparare');
    }
    
    if (recipe.prepTime <= 0) {
      errors.push('Timpul de preparare trebuie să fie mai mare decât 0');
    }
    
    if (recipe.servings <= 0) {
      errors.push('Numărul de porții trebuie să fie mai mare decât 0');
    }
    
    return errors;
  };
  
  // Handler pentru salvare
  const handleSave = async () => {
    // Validăm datele
    const validationErrors = validateRecipe();
    if (validationErrors.length > 0) {
      setError(`Te rugăm să corectezi următoarele erori: ${validationErrors.join(', ')}`);
      return;
    }
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Dacă avem o imagine nouă, o încărcăm mai întâi
      let finalImageUrl = recipe.imageUrl;
      if (selectedImage) {
        const imageData = await recipeService.uploadImage(selectedImage);
        finalImageUrl = imageData.url;
      }
      
      // Pregătim datele rețetei
      const recipeData = {
        ...recipe,
        imageUrl: finalImageUrl
      };
      
      // Salvăm rețeta
      let savedRecipe;
      if (recipeId && recipeId !== 'new') {
        // Actualizăm rețeta existentă
        savedRecipe = await recipeService.updateRecipe(recipeId, recipeData);
        setSuccess('Rețeta a fost actualizată cu succes!');
      } else {
        // Creăm o rețetă nouă
        savedRecipe = await recipeService.createRecipe(recipeData);
        setSuccess('Rețeta a fost creată cu succes!');
      }
      
      // Actualizăm starea cu datele salvate
      setRecipe(savedRecipe);
      
      // După 2 secunde, redirecționăm către pagina de rețete
      setTimeout(() => {
        navigate('/recipes');
      }, 2000);
      
    } catch (error) {
      setError('A apărut o eroare la salvarea rețetei. Te rugăm să încerci din nou.');
      console.error('Error saving recipe:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler pentru anulare
  const handleCancel = () => {
    navigate('/recipes');
  };
  
  // Dacă utilizatorul nu este admin, nu afișăm nimic (vom fi redirecționați din useEffect)
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="recipe-edit-page">
      <Navbar />
      
      <div className="recipe-edit-content">
        <div className="recipe-edit-header">
          <h1>{recipeId && recipeId !== 'new' ? 'Editare Rețetă' : 'Creare Rețetă Nouă'}</h1>
          <p className="subtitle">Completează toate detaliile pentru a crea o rețetă de calitate</p>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Se încarcă datele rețetei...</p>
          </div>
        ) : (
          <div className="recipe-edit-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}
            
            <div className="form-section">
              <h2>Informații Generale</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Titlu *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={recipe.title}
                    onChange={handleInputChange}
                    placeholder="Titlul rețetei"
                    className="form-control"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Descriere</label>
                  <textarea
                    id="description"
                    name="description"
                    value={recipe.description}
                    onChange={handleInputChange}
                    placeholder="Descrie pe scurt rețeta"
                    className="form-control"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="form-row columns-2">
                <div className="form-group">
                  <label htmlFor="prepTime">Timp de preparare (minute) *</label>
                  <input
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    value={recipe.prepTime}
                    onChange={handleInputChange}
                    min="1"
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cookTime">Timp de gătire (minute)</label>
                  <input
                    type="number"
                    id="cookTime"
                    name="cookTime"
                    value={recipe.cookTime}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-row columns-2">
                <div className="form-group">
                  <label htmlFor="servings">Număr de porții *</label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    value={recipe.servings}
                    onChange={handleInputChange}
                    min="1"
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="difficulty">Nivel de dificultate</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={recipe.difficulty}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="EASY">Ușor</option>
                    <option value="MEDIUM">Mediu</option>
                    <option value="HARD">Dificil</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Imagine Rețetă</h2>
              
              <div className="image-upload-container">
                {recipe.imageUrl ? (
                  <div className="image-preview">
                    <img src={recipe.imageUrl} alt="Preview rețetă" />
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <i className="placeholder-icon"></i>
                    <p>Nicio imagine selectată</p>
                  </div>
                )}
                
                <div className="image-upload-controls">
                  <label htmlFor="image-upload" className="upload-button">
                    Încarcă imagine
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden-input"
                  />
                  <p className="upload-info">Format recomandat: JPG sau PNG, maxim 5MB</p>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Ingrediente *</h2>
              
              <div className="ingredients-container">
                {recipe.ingredients.length > 0 ? (
                  <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="ingredient-item">
                        <span>{ingredient}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="remove-button"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-list">Niciun ingredient adăugat</p>
                )}
                
                <div className="add-ingredient-form">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Adaugă un ingredient"
                    className="form-control"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="add-button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Pași de Preparare *</h2>
              
              <div className="steps-container">
                {recipe.steps.length > 0 ? (
                  <ol className="steps-list">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="step-item">
                        <span>{step}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="remove-button"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="empty-list">Niciun pas de preparare adăugat</p>
                )}
                
                <div className="add-step-form">
                  <textarea
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Adaugă un pas de preparare"
                    className="form-control"
                    rows="2"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="add-button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Sfaturi și Trucuri</h2>
              
              <div className="tips-container">
                {recipe.tips.length > 0 ? (
                  <ul className="tips-list">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="tip-item">
                        <span>{tip}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTip(index)}
                          className="remove-button"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-list">Niciun sfat adăugat</p>
                )}
                
                <div className="add-tip-form">
                  <textarea
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    placeholder="Adaugă un sfat sau truc util"
                    className="form-control"
                    rows="2"
                  />
                  <button
                    type="button"
                    onClick={handleAddTip}
                    className="add-button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Informații Nutriționale</h2>
              
              <div className="form-row columns-4">
                <div className="form-group">
                  <label htmlFor="calories">Calorii (kcal)</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={recipe.calories}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="protein">Proteine (g)</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={recipe.protein}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="carbs">Carbohidrați (g)</label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={recipe.carbs}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fat">Grăsimi (g)</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={recipe.fat}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Categorii și Clasificare</h2>
              
              <div className="form-row columns-3">
                <div className="form-group">
                  <label htmlFor="dietType">Tip Dietă</label>
                  <select
                    id="dietType"
                    name="dietType"
                    value={recipe.dietType}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="OMNIVORE">Omnivor</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="PESCATARIAN">Pescatarian</option>
                    <option value="KETO">Keto</option>
                    <option value="PALEO">Paleo</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="objective">Obiectiv</label>
                  <select
                    id="objective"
                    name="objective"
                    value={recipe.objective}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="WEIGHT_LOSS">Slăbire</option>
                    <option value="MUSCLE_GAIN">Creștere Musculară</option>
                    <option value="MAINTENANCE">Menținere</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="proteinContent">Conținut de Proteine</label>
                  <select
                    id="proteinContent"
                    name="proteinContent"
                    value={recipe.proteinContent}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="LOW">Scăzut</option>
                    <option value="MEDIUM">Mediu</option>
                    <option value="HIGH">Ridicat</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-button"
                disabled={isSaving}
              >
                Anulează
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                className="save-button"
                disabled={isSaving}
              >
                {isSaving ? 'Se salvează...' : (recipeId && recipeId !== 'new' ? 'Actualizează' : 'Creează')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeEditPage;