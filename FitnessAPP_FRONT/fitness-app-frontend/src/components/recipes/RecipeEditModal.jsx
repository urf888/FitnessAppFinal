import React, { useState, useEffect, useRef } from 'react';
import recipeService from '../../api/recipeService';
import uploadService from '../../api/uploadService';
import './RecipeEditModal.css';

const RecipeEditModal = ({ isOpen, onClose, recipe, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 30,
    servings: 2,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    dietType: 'carnivor',
    objective: 'fit',
    proteinContent: 'normal',
    ingredients: [],
    steps: [],
    tips: []
  });
  
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  const [newTip, setNewTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Populăm formularul cu datele rețetei atunci când se deschide modal-ul
  useEffect(() => {
    // Adăugăm logging pentru a verifica ce date primim
    console.log("Recipe data received in modal:", recipe);
    
    if (recipe && isOpen) {
      // Populăm formData din datele rețetei existente
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        imageUrl: recipe.imageUrl || '',
        prepTime: recipe.prepTime || 30,
        servings: recipe.servings || 2,
        calories: recipe.calories || 0,
        protein: recipe.protein || 0,
        carbs: recipe.carbs || 0,
        fat: recipe.fat || 0,
        fiber: recipe.fiber || 0,
        sugar: recipe.sugar || 0,
        dietType: recipe.dietType || 'carnivor',
        objective: recipe.objective || 'fit',
        proteinContent: recipe.proteinContent || 'normal',
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        tips: recipe.tips || []
      });
      
      // Setăm preview-ul imaginii dacă există
      if (recipe.imageUrl) {
        setImagePreview(recipe.imageUrl);
      } else {
        setImagePreview('');
      }
      
      console.log("Form data populated:", formData);
    }
  }, [recipe, isOpen]);
  
  // Resetăm formularul când se închide modal-ul
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setImagePreview('');
      setError('');
    }
  }, [isOpen]);
  
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertim valorile numerice
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };
  
  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddStep = () => {
    if (newStep.trim()) {
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, newStep.trim()]
      }));
      setNewStep('');
    }
  };
  
  const handleRemoveStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        tips: [...prev.tips, newTip.trim()]
      }));
      setNewTip('');
    }
  };
  
  const handleRemoveTip = (index) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validăm fișierul
        const validation = uploadService.validateImageFile(file);
        if (!validation.valid) {
          setError(validation.message);
          return;
        }
        
        setSelectedFile(file);
        setError(''); // Resetăm eventualele erori anterioare
        
        // Generăm un preview al imaginii folosind serviciul
        const previewUrl = await uploadService.createImagePreview(file);
        setImagePreview(previewUrl);
      } catch (error) {
        console.error('Eroare la procesarea fișierului:', error);
        setError('Nu s-a putut procesa imaginea selectată.');
      }
    }
  };
  
  const handleBrowseClick = () => {
    // Declanșăm click-ul pe input-ul de fișiere
    fileInputRef.current.click();
  };
  
  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    try {
      // Validăm fișierul înainte de încărcare
      const validation = uploadService.validateImageFile(selectedFile, {
        maxSizeInMB: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (!validation.valid) {
        throw new Error(validation.message);
      }
      
      // Folosim serviciul de upload pentru a încărca imaginea
      const result = await uploadService.uploadImage(selectedFile);
      return result.imageUrl; // Returnam URL-ul imaginii încărcate
    } catch (error) {
      console.error('Eroare la încărcarea imaginii:', error);
      throw new Error(`Eroare la încărcarea imaginii: ${error.message}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validăm datele
      if (!formData.title) {
        throw new Error('Titlul este obligatoriu');
      }
      
      if (formData.ingredients.length === 0) {
        throw new Error('Trebuie să adaugi cel puțin un ingredient');
      }
      
      if (formData.steps.length === 0) {
        throw new Error('Trebuie să adaugi cel puțin un pas de preparare');
      }
      
      let imageUrl = formData.imageUrl;
      
      // Dacă avem un fișier selecționat, îl încărcăm
      if (selectedFile) {
        try {
          const uploadedUrl = await uploadImage();
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (error) {
          throw new Error('Eroare la încărcarea imaginii: ' + error.message);
        }
      }
      
      // Pregătim datele pentru salvare
      const recipeData = {
        ...formData,
        imageUrl
      };
      
      // Salvăm rețeta (nouă sau actualizată)
      if (recipe?.id) {
        await recipeService.updateRecipe(recipe.id, recipeData);
      } else {
        await recipeService.createRecipe(recipeData);
      }
      
      // Notificăm componenta părinte despre salvare
      onSave();
      
      // Închidem modal-ul
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="recipe-modal-overlay">
      <div className="recipe-modal">
        <div className="recipe-modal-header">
          <h2>{recipe?.id ? 'Editare Rețetă' : 'Adăugare Rețetă Nouă'}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={loading}
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label htmlFor="title">Titlu *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descriere</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength="1000"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Imagine</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              
              <div className="image-upload-controls">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="URL imagine sau încarcă de pe dispozitiv"
                />
                
                <button 
                  type="button" 
                  className="browse-button"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Timp preparare (min)</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                min="1"
                max="300"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="servings">Porții</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                min="1"
                max="20"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="calories">Calorii</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                min="0"
                max="2000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="protein">Proteine (g)</label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                min="0"
                max="200"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carbs">Carbohidrați (g)</label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                min="0"
                max="200"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fat">Grăsimi (g)</label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={formData.fat}
                onChange={handleInputChange}
                min="0"
                max="200"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fiber">Fibre (g)</label>
              <input
                type="number"
                id="fiber"
                name="fiber"
                value={formData.fiber}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sugar">Zahăr (g)</label>
              <input
                type="number"
                id="sugar"
                name="sugar"
                value={formData.sugar}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dietType">Tip dietă</label>
              <select
                id="dietType"
                name="dietType"
                value={formData.dietType}
                onChange={handleInputChange}
              >
                <option value="carnivor">Carnivor</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="objective">Obiectiv</label>
              <select
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleInputChange}
              >
                <option value="masă">Masă musculară</option>
                <option value="slăbit">Slăbit</option>
                <option value="fit">Fitness/Menținere</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="proteinContent">Conținut proteic</label>
              <select
                id="proteinContent"
                name="proteinContent"
                value={formData.proteinContent}
                onChange={handleInputChange}
              >
                <option value="normal">Normal</option>
                <option value="ridicat">Ridicat</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Ingrediente *</label>
            <div className="list-input-container">
              <div className="list-input">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Adaugă ingredient"
                />
                <button 
                  type="button" 
                  onClick={handleAddIngredient}
                  className="add-button"
                >
                  +
                </button>
              </div>
              
              <ul className="items-list">
                {formData.ingredients.map((ingredient, index) => (
                  <li key={index}>
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
            </div>
          </div>
          
          <div className="form-group">
            <label>Pași de preparare *</label>
            <div className="list-input-container">
              <div className="list-input">
                <textarea
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Adaugă pas de preparare"
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
              
              <ol className="items-list steps-list">
                {formData.steps.map((step, index) => (
                  <li key={index}>
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
            </div>
          </div>
          
          <div className="form-group">
            <label>Sfaturi și trucuri</label>
            <div className="list-input-container">
              <div className="list-input">
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="Adaugă sfat sau truc"
                />
                <button 
                  type="button" 
                  onClick={handleAddTip}
                  className="add-button"
                >
                  +
                </button>
              </div>
              
              <ul className="items-list">
                {formData.tips.map((tip, index) => (
                  <li key={index}>
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
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
              disabled={loading}
            >
              Anulează
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeEditModal;