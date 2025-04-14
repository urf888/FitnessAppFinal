/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../api/profileService';
import Navbar from '../components/layout/Navbar';
import RecipeIngredientForm from '../components/recipes/RecipeIngredientForm';
import RecipeList from '../components/recipes/RecipeList';
import RecipeDetail from '../components/recipes/RecipeDetail';
import './RecipeRecommendationPage.css';
import { recipeDatabase } from '../data/recipeDatabase';
import { getIngredientVariations } from '../data/ingredientVariations';

const RecipeRecommendationPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDietType, setSelectedDietType] = useState('carnivor');
  const [ingredients, setIngredients] = useState([]);
  const [excludeIngredients, setExcludeIngredients] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // New state to track if all recipes are being shown
  const [showAllRecipes, setShowAllRecipes] = useState(false);

  // Meat and animal product keywords to exclude
  const meatKeywords = [
    'carne', 'pui', 'porc', 'vită', 'vaca', 'miel', 'peste', 'ton', 
    'somon', 'curcan', 'oaie', 'ficat', 'inimă', 'rinichi', 'șuncă'
  ];

  const animalProductKeywords = [
    'ou', 'brânză', 'lapte', 'iaurt', 'smântână', 'unt', 'caș', 
    'cașcaval', 'parmezan', 'mozzarella', 'feta'
  ];

  // Intelligent ingredient filtering based on diet type
  const filterIngredients = (ingredientsList, dietType) => {
    if (dietType === 'carnivor') return ingredientsList;

    return ingredientsList.filter(ingredient => {
      const ingredientLower = ingredient.toLowerCase().trim();
      
      if (dietType === 'vegan') {
        // Remove both meat and animal product keywords
        return !meatKeywords.some(keyword => ingredientLower.includes(keyword)) &&
               !animalProductKeywords.some(keyword => ingredientLower.includes(keyword));
      }
      
      if (dietType === 'vegetarian') {
        // Remove meat keywords, but allow animal products
        return !meatKeywords.some(keyword => ingredientLower.includes(keyword));
      }
      
      return true;
    });
  };

  // Recipe filtering based on diet type
  const filterRecipesByDiet = (recipes, dietType) => {
    if (dietType === 'carnivor') return recipes;

    return recipes.filter(recipe => {
      // For vegan, only keep vegan recipes
      if (dietType === 'vegan') {
        return recipe.dietTypes.some(type => type.toLowerCase() === 'vegan');
      }
      
      // For vegetarian, keep vegetarian and vegan recipes
      if (dietType === 'vegetarian') {
        return recipe.dietTypes.some(type => 
          ['vegetarian', 'vegan'].includes(type.toLowerCase())
        );
      }
      
      return true;
    });
  };

  // Enhanced recipe finding logic
  const findRecipes = (ingredientsList, excludeList) => {
    console.log("Finding recipes with:", ingredientsList);
    
    // Filter recipes by diet type first
    let filteredByDiet = filterRecipesByDiet(recipeDatabase, selectedDietType);
    
    // If no ingredients provided, return all diet-filtered recipes
    if (ingredientsList.length === 0) {
      return filteredByDiet; // Limit to first 20 recipes
    }

    // Score and filter recipes based on ingredient matches
    const scoredRecipes = filteredByDiet.map(recipe => {
      let score = 0;
      const matchedIngredients = [];
      const matchedVariations = [];

      // Check each ingredient against recipe ingredients
      ingredientsList.forEach(searchIngredient => {
        const variations = getIngredientVariations(searchIngredient);
        
        const recipeMatch = recipe.ingredients.some(recipeIngredient => {
          const recipeIngredientLower = recipeIngredient.toLowerCase();
          
          return variations.some(variation => 
            recipeIngredientLower.includes(variation)
          );
        });

        if (recipeMatch) {
          score += 10; // Base match score
          matchedIngredients.push(searchIngredient);
          matchedVariations.push(variations[0]);
        }
      });

      // Exclude list penalty
      if (excludeList && excludeList.length > 0) {
        excludeList.forEach(excludedItem => {
          if (recipe.ingredients.some(ing => 
            ing.toLowerCase().includes(excludedItem.toLowerCase())
          )) {
            score -= 20; // Heavy penalty for excluded ingredients
          }
        });
      }

      return {
        ...recipe,
        score,
        matchedIngredients,
        matchedVariations
      };
    });

    // Sort by score in descending order and filter out negative scores
    return scoredRecipes
      .filter(recipe => recipe.score > 0)
      .sort((a, b) => b.score - a.score)
      ;
  };

  // Profile fetching
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        
        if (profileData) {
          setProfile(profileData);
          
          // Set default diet type based on profile if possible
          if (profileData.allergiesRestrictions) {
            const restrictions = profileData.allergiesRestrictions.toLowerCase();
            if (restrictions.includes('carne')) {
              setSelectedDietType('vegetarian');
            }
            if (restrictions.includes('animal')) {
              setSelectedDietType('vegan');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Eroare la încărcarea profilului: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Ingredient submission handler
  const handleIngredientSubmit = (ingredientsList, excludeList) => {
    // Reset show all recipes flag
    setShowAllRecipes(false);

    // Filter ingredients based on selected diet type
    const filteredIngredients = filterIngredients(ingredientsList, selectedDietType);
    
    // Find and filter recipes
    const filteredRecipes = findRecipes(filteredIngredients, excludeList);
    
    setIngredients(filteredIngredients);
    setExcludeIngredients(excludeList);
    setRecommendedRecipes(filteredRecipes);
  };

  // Handle ingredients change in real-time
  const handleIngredientsChange = (newIngredients) => {
    // Reset show all recipes flag
    setShowAllRecipes(false);

    // Immediately filter recipes based on new ingredients
    const filteredRecipes = findRecipes(newIngredients, excludeIngredients);
    setRecommendedRecipes(filteredRecipes);
  };

  // Diet type selection handler
  const handleDietTypeChange = (dietType) => {
    setSelectedDietType(dietType);
    
    // Reset ingredients and recipes when diet type changes
    setIngredients([]);
    setRecommendedRecipes([]);
    setShowAllRecipes(false);
  };

  // Function to toggle all recipes view
  const handleShowAllRecipes = () => {
    // If not currently showing all, set to show all
    if (!showAllRecipes) {
      const allDietFilteredRecipes = filterRecipesByDiet(recipeDatabase, selectedDietType);
      setRecommendedRecipes(allDietFilteredRecipes);
      setShowAllRecipes(true);
    } else {
      // If already showing all, revert to previous filtered state
      setShowAllRecipes(false);
      
      // Rerun the last search or reset
      if (ingredients.length > 0) {
        const filteredRecipes = findRecipes(ingredients, excludeIngredients);
        setRecommendedRecipes(filteredRecipes);
      } else {
        setRecommendedRecipes([]);
      }
    }
  };

  return (
    <div className="recipe-recommendation-page">
      <Navbar />
      <div className="recipe-content">
        <h1>Recomandări Rețete</h1>
        
        {/* Diet Type Selection */}
        <div className="diet-type-selector">
          <button 
            className={`diet-button ${selectedDietType === 'carnivor' ? 'active' : ''}`}
            onClick={() => handleDietTypeChange('carnivor')}
          >
            Carnivor
          </button>
          <button 
            className={`diet-button ${selectedDietType === 'vegetarian' ? 'active' : ''}`}
            onClick={() => handleDietTypeChange('vegetarian')}
          >
            Vegetarian
          </button>
          <button 
            className={`diet-button ${selectedDietType === 'vegan' ? 'active' : ''}`}
            onClick={() => handleDietTypeChange('vegan')}
          >
            Vegan
          </button>
        </div>

        {loading ? (
          <div className="loading">Se încarcă datele...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="recipe-container">
            {!selectedRecipe ? (
              <>
                <RecipeIngredientForm 
                  dietType={selectedDietType}
                  onIngredientsChange={handleIngredientsChange}
                  onSubmit={handleIngredientSubmit}
                  initialExcluded={excludeIngredients}
                />

                {/* New button to show all recipes */}
                <div className="show-all-recipes-container">
                  <button 
                    className="show-all-recipes-button"
                    onClick={handleShowAllRecipes}
                  >
                    {showAllRecipes 
                      ? 'Ascunde Toate Rețetele' 
                      : 'Afișează Toate Rețetele'}
                  </button>
                </div>

                <RecipeList 
                  recipes={recommendedRecipes} 
                  onSelectRecipe={setSelectedRecipe}
                />
              </>
            ) : (
              <RecipeDetail 
                recipe={selectedRecipe} 
                onBack={() => setSelectedRecipe(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeRecommendationPage;