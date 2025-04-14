import React, { useState, useEffect } from 'react';
import './RecipeIngredientForm.css';

// Comprehensive list of popular ingredients by diet type
const popularIngredientsByDiet = {
  carnivor: [
    'pui', 'orez', 'paste', 'cartofi', 'ceapă', 'usturoi', 'morcovi', 
    'roșii', 'broccoli', 'fasole', 'ardei', 'ciuperci', 'spanac',
    'carne de vită', 'ton', 'somon', 'șuncă', 'curcan'
  ],
  vegetarian: [
    'orez', 'paste', 'cartofi', 'ceapă', 'usturoi', 'morcovi', 
    'roșii', 'broccoli', 'fasole', 'ardei', 'ciuperci', 'spanac',
    'ouă', 'brânză', 'iaurt', 'smântână', 'lapte', 
    'quinoa', 'linte', 'avocado', 'dovleac', 'dovlecel'
  ],
  vegan: [
    'orez', 'paste', 'cartofi', 'ceapă', 'usturoi', 'morcovi', 
    'roșii', 'broccoli', 'fasole', 'ardei', 'ciuperci', 'spanac',
    'quinoa', 'năut', 'linte', 'tofu', 'tempeh', 'avocado', 
    'dovleac', 'dovlecel', 'varză', 'banană', 'mere'
  ]
};

// Keywords to filter out based on diet type
const meatKeywords = [
  'carne', 'pui', 'porc', 'vită', 'vaca', 'miel', 'peste', 'ton', 
  'somon', 'curcan', 'oaie', 'ficat', 'inimă', 'rinichi', 'șuncă'
];

const animalProductKeywords = [
  'ou', 'brânză', 'lapte', 'iaurt', 'smântână', 'unt', 'caș', 
  'cașcaval', 'parmezan', 'mozzarella', 'feta'
];

// Robust ingredient filtering function
const filterIngredientsByDiet = (ingredients, dietType) => {
  return ingredients.filter(ingredient => {
    const ingredientLower = ingredient.toLowerCase().trim();
    
    // For vegan diet, remove both meat and animal product keywords
    if (dietType === 'vegan') {
      return !meatKeywords.some(keyword => ingredientLower.includes(keyword)) &&
             !animalProductKeywords.some(keyword => ingredientLower.includes(keyword));
    }
    
    // For vegetarian diet, remove meat keywords
    if (dietType === 'vegetarian') {
      return !meatKeywords.some(keyword => ingredientLower.includes(keyword));
    }
    
    // For carnivor, return all ingredients
    return true;
  });
};

const RecipeIngredientForm = ({ 
  onSubmit, 
  initialExcluded = [], 
  dietType = 'carnivor' 
}) => {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [excludeIngredients, setExcludeIngredients] = useState(initialExcluded);
  const [currentExcluded, setCurrentExcluded] = useState('');
  const [error, setError] = useState('');
  const [commonIngredients, setCommonIngredients] = useState([]);

  // Filter common ingredients based on diet type
  useEffect(() => {
    // Get base ingredients for the diet type
    const baseIngredients = popularIngredientsByDiet[dietType] || 
      popularIngredientsByDiet.carnivor;
    
    // Filter ingredients based on diet type
    const filteredIngredients = filterIngredientsByDiet(baseIngredients, dietType);
    
    setCommonIngredients(filteredIngredients);
  }, [dietType]);

  // Add ingredient to the list
  const addIngredient = () => {
    if (!currentIngredient.trim()) return;

    // Check if ingredient is already in the list
    if (ingredients.includes(currentIngredient.trim())) {
      setError('Acest ingredient este deja în listă.');
      return;
    }

    setIngredients(prev => [...prev, currentIngredient.trim()]);
    setCurrentIngredient('');
    setError('');
  };

  // Remove ingredient from the list
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  // Add excluded ingredient
  const addExcluded = () => {
    if (!currentExcluded.trim()) return;

    // Check if excluded ingredient is already in the list
    if (excludeIngredients.includes(currentExcluded.trim())) {
      setError('Acest ingredient este deja exclus.');
      return;
    }

    setExcludeIngredients(prev => [...prev, currentExcluded.trim()]);
    setCurrentExcluded('');
    setError('');
  };

  // Remove excluded ingredient
  const removeExcluded = (index) => {
    const updatedExcluded = [...excludeIngredients];
    updatedExcluded.splice(index, 1);
    setExcludeIngredients(updatedExcluded);
  };

  // Handle normal submit
  const handleNormalSubmit = () => {
    // Add current ingredient if there is one
    let finalIngredients = [...ingredients];
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      finalIngredients.push(currentIngredient.trim());
      setCurrentIngredient('');
    }
    
    // Add current excluded if there is one
    let finalExcluded = [...excludeIngredients];
    if (currentExcluded.trim() && !excludeIngredients.includes(currentExcluded.trim())) {
      finalExcluded.push(currentExcluded.trim());
      setCurrentExcluded('');
    }
    
    onSubmit(finalIngredients, finalExcluded);
  };

  // Handle key press for adding ingredients
  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'ingredient') {
        addIngredient();
      } else if (type === 'excluded') {
        addExcluded();
      }
    }
  };

  return (
    <div className="recipe-ingredient-form">
      <h3>Ce ingrediente ai disponibile?</h3>
      <p className="form-description">
        Introduceți ingredientele pe care le aveți disponibile și vom găsi rețete potrivite.
      </p>

      {error && <div className="form-error">{error}</div>}

      <div className="ingredients-section">
        <div className="input-group">
          <label htmlFor="ingredient">Adaugă un ingredient:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="ingredient"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'ingredient')}
              placeholder="Ex: pui, orez, morcovi"
            />
            <button 
              type="button" 
              className="add-button"
              onClick={addIngredient}
            >
              +
            </button>
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="ingredient-list">
            <h4>Ingrediente adăugate:</h4>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-tag">
                  {ingredient}
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeIngredient(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="common-ingredients">
          <h4>Ingrediente populare:</h4>
          <div className="ingredient-suggestions">
            {commonIngredients.map((ingredient, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-button"
                onClick={() => {
                  if (!ingredients.includes(ingredient)) {
                    setIngredients([...ingredients, ingredient]);
                  } else {
                    setError('Acest ingredient este deja în listă.');
                  }
                }}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="exclude-section">
        <h4>Ingrediente de exclus:</h4>
        <p className="exclude-description">
          Adăugați ingrediente pe care doriți să le evitați (alături de orice alergeni din profilul dvs.)
        </p>

        <div className="input-group">
          <div className="input-with-button">
            <input
              type="text"
              id="exclude"
              value={currentExcluded}
              onChange={(e) => setCurrentExcluded(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'excluded')}
              placeholder="Ex: lactate, nuci, gluten"
            />
            <button 
              type="button" 
              className="add-button"
              onClick={addExcluded}
            >
              +
            </button>
          </div>
        </div>

        {excludeIngredients.length > 0 && (
          <div className="excluded-list">
            <ul>
              {excludeIngredients.map((ingredient, index) => (
                <li key={index} className="excluded-tag">
                  {ingredient}
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeExcluded(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button 
        type="button" 
        className="search-button"
        onClick={handleNormalSubmit}
      >
        Găsește Rețete
      </button>
    </div>
  );
};

export default RecipeIngredientForm;