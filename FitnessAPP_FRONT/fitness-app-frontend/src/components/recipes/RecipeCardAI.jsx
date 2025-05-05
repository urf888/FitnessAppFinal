import React, { useEffect, useState } from 'react';
import './RecipeCardAI.css';

const RecipeCard = ({ recipe }) => {
  const [parsedRecipe, setParsedRecipe] = useState({
    title: 'Rețetă personalizată',
    description: '',
    prepTime: 30,
    servings: 2,
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    ingredients: [],
    steps: [],
    tips: []
  });

  // Log pentru debugging
  useEffect(() => {
    console.log('Text rețetă primit:', recipe);
  }, [recipe]);

  useEffect(() => {
    // Funcție pentru parsarea textului rețetei în secțiuni
    const parseRecipe = (text) => {
      if (!text) return parsedRecipe;
      
      console.log('Parsarea rețetei...');
      const result = { ...parsedRecipe };
      
      try {
        // Parsează titlul
        const titleMatch = text.match(/Titlu:\s*(.+?)(?=\n|$)/);
        if (titleMatch && titleMatch[1]) {
          result.title = titleMatch[1].trim();
          console.log('Titlu extras:', result.title);
        }
        
        // Parsează descrierea
        const descriptionMatch = text.match(/Descriere:\s*(.+?)(?=\n\n|\nTimp|\n[A-Z]|$)/s);
        if (descriptionMatch && descriptionMatch[1]) {
          result.description = descriptionMatch[1].trim();
          console.log('Descriere extrasă:', result.description.slice(0, 50) + '...');
        }
        
        // Parsează timpul de preparare
        const prepTimeMatch = text.match(/Timp de preparare:\s*(\d+)/);
        if (prepTimeMatch && prepTimeMatch[1]) {
          result.prepTime = parseInt(prepTimeMatch[1]);
          console.log('Timp de preparare extras:', result.prepTime);
        }
        
        // Parsează porțiile
        const servingsMatch = text.match(/Porții:\s*(\d+)/);
        if (servingsMatch && servingsMatch[1]) {
          result.servings = parseInt(servingsMatch[1]);
          console.log('Porții extrase:', result.servings);
        }
        
        // Parsează informațiile nutriționale
        const caloriesMatch = text.match(/Calorii:\s*(\d+)/);
        if (caloriesMatch && caloriesMatch[1]) {
          result.nutritionInfo.calories = parseInt(caloriesMatch[1]);
        }
        
        const proteinMatch = text.match(/Proteine:\s*(\d+)/);
        if (proteinMatch && proteinMatch[1]) {
          result.nutritionInfo.protein = parseInt(proteinMatch[1]);
        }
        
        const carbsMatch = text.match(/Carbohidrați:\s*(\d+)/);
        if (carbsMatch && carbsMatch[1]) {
          result.nutritionInfo.carbs = parseInt(carbsMatch[1]);
        }
        
        const fatMatch = text.match(/Grăsimi:\s*(\d+)/);
        if (fatMatch && fatMatch[1]) {
          result.nutritionInfo.fat = parseInt(fatMatch[1]);
        }
        
        console.log('Informații nutriționale extrase:', result.nutritionInfo);
        
        // Parsează ingredientele - metoda alternativă de extragere
        let ingredients = [];
        
        // Găsim secțiunea de ingrediente
        const ingredientsStart = text.indexOf('Ingrediente:');
        if (ingredientsStart !== -1) {
          let ingredientsEnd = text.indexOf('Mod de preparare:', ingredientsStart);
          if (ingredientsEnd === -1) {
            ingredientsEnd = text.indexOf('Preparare:', ingredientsStart);
          }
          if (ingredientsEnd === -1) {
            ingredientsEnd = text.indexOf('Pași:', ingredientsStart);
          }
          if (ingredientsEnd === -1) {
            ingredientsEnd = text.indexOf('Sfaturi:', ingredientsStart);
          }
          if (ingredientsEnd === -1) {
            ingredientsEnd = text.length;
          }
          
          const ingredientsText = text.substring(ingredientsStart + 'Ingrediente:'.length, ingredientsEnd).trim();
          ingredients = ingredientsText
            .split('\n')
            .map(i => i.trim().replace(/^-\s*/, ''))
            .filter(i => i);
          
          console.log('Ingrediente extrase:', ingredients.length);
        }
        
        result.ingredients = ingredients;
        
        // Parsează pașii de preparare - metoda alternativă
        let steps = [];
        
        // Găsim secțiunea de pași
        const stepsStartIndex = text.indexOf('Mod de preparare:');
        if (stepsStartIndex !== -1) {
          let stepsEndIndex = text.indexOf('Sfaturi:', stepsStartIndex);
          if (stepsEndIndex === -1) {
            stepsEndIndex = text.length;
          }
          
          const stepsText = text.substring(stepsStartIndex + 'Mod de preparare:'.length, stepsEndIndex).trim();
          steps = stepsText
            .split('\n')
            .map(s => s.trim().replace(/^\d+\.\s*/, ''))
            .filter(s => s);
          
          console.log('Pași extrași:', steps.length);
        }
        
        result.steps = steps;
        
        // Parsează sfaturile - metoda alternativă
        let tips = [];
        
        // Găsim secțiunea de sfaturi
        const tipsStartIndex = text.indexOf('Sfaturi:');
        if (tipsStartIndex !== -1) {
          const tipsText = text.substring(tipsStartIndex + 'Sfaturi:'.length).trim();
          tips = tipsText
            .split('\n')
            .map(t => t.trim().replace(/^-\s*/, ''))
            .filter(t => t);
          
          console.log('Sfaturi extrase:', tips.length);
        }
        
        result.tips = tips;
        
      } catch (error) {
        console.error('Eroare la parsarea rețetei:', error);
      }
      
      return result;
    };
    
    if (recipe) {
      const parsed = parseRecipe(recipe);
      setParsedRecipe(parsed);
    }
  }, [recipe]);

  // Dacă nu avem date, afișăm un mesaj
  if (!recipe) {
    return <div className="recipe-card-placeholder">Se încarcă rețeta...</div>;
  }
  
  // Afișăm rețeta formatată în card
  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h2 className="recipe-card-title">{parsedRecipe.title}</h2>
        <div className="recipe-card-meta">
          <div className="recipe-meta-item">
            <i className="time-icon">⏱️</i>
            <span>{parsedRecipe.prepTime} min</span>
          </div>
          <div className="recipe-meta-item">
            <i className="servings-icon">👥</i>
            <span>{parsedRecipe.servings} porții</span>
          </div>
        </div>
      </div>
      
      <div className="recipe-card-body">
        {parsedRecipe.description && (
          <div className="recipe-description">
            <p>{parsedRecipe.description}</p>
          </div>
        )}
        
        <div className="recipe-nutrition">
          <h3>Informații nutriționale (per porție)</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span className="nutrition-value">{parsedRecipe.nutritionInfo.calories}</span>
              <span className="nutrition-label">Calorii</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{parsedRecipe.nutritionInfo.protein}g</span>
              <span className="nutrition-label">Proteine</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{parsedRecipe.nutritionInfo.carbs}g</span>
              <span className="nutrition-label">Carbohidrați</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{parsedRecipe.nutritionInfo.fat}g</span>
              <span className="nutrition-label">Grăsimi</span>
            </div>
          </div>
        </div>
        
        {parsedRecipe.ingredients.length > 0 ? (
          <div className="recipe-section ingredients-section">
            <h3>Ingrediente</h3>
            <ul className="ingredients-list">
              {parsedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="recipe-section ingredients-section">
            <h3>Ingrediente</h3>
            <p className="no-data">Nu s-au putut extrage ingredientele.</p>
            <pre className="debug-text">{recipe.includes('Ingrediente:') ? 'Secțiune găsită, dar nu s-au putut extrage ingredientele' : 'Secțiunea de ingrediente lipsește'}</pre>
          </div>
        )}
        
        {parsedRecipe.steps.length > 0 ? (
          <div className="recipe-section steps-section">
            <h3>Mod de preparare</h3>
            <ol className="steps-list">
              {parsedRecipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="recipe-section steps-section">
            <h3>Mod de preparare</h3>
            <p className="no-data">Nu s-au putut extrage pașii de preparare.</p>
            <pre className="debug-text">{recipe.includes('Mod de preparare:') ? 'Secțiune găsită, dar nu s-au putut extrage pașii' : 'Secțiunea de pași lipsește'}</pre>
          </div>
        )}
        
        {parsedRecipe.tips.length > 0 && (
          <div className="recipe-section tips-section">
            <h3>Sfaturi</h3>
            <ul className="tips-list">
              {parsedRecipe.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;