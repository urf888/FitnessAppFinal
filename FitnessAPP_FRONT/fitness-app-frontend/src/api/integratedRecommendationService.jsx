/* eslint-disable no-unused-vars */
// Serviciu pentru recomandări integrate de fitness și nutriție
import { getFilteredPrograms } from './programService';
import { recipeDatabase } from '../../data/recipeDatabase';
import { ingredientMatches } from '../data/ingredientVariations';

// Funcție pentru a obține recomandări integrate bazate pe profilul utilizatorului
export const getIntegratedRecommendations = async (userProfile) => {
  if (!userProfile) {
    throw new Error('Profilul utilizatorului este necesar pentru recomandări');
  }

  try {
    // Obține recomandările de programe fitness
    const programRecommendations = await getFitnessProgramRecommendations(userProfile);
    
    // Obține recomandările de rețete
    const recipeRecommendations = getRecipeRecommendations(userProfile);
    
    return {
      programs: programRecommendations,
      recipes: recipeRecommendations
    };
  } catch (error) {
    console.error('Error getting integrated recommendations:', error);
    throw error;
  }
};

// Funcție pentru a obține programe fitness recomandate
export const getFitnessProgramRecommendations = async (userProfile) => {
  const { gender, diet, fitnessGoal, fitnessLevel, age } = userProfile;
  
  try {
    // Obține programe filtrate în funcție de profilul utilizatorului
    const programsData = await getFilteredPrograms(
      gender,
      diet,
      fitnessGoal,
      fitnessLevel
    );
    
    // Sortăm programele în funcție de potrivirea cu profilul
    const sortedPrograms = sortProgramsByRelevance(programsData, userProfile);
    
    // Returnăm top 4 programe recomandate
    return sortedPrograms.slice(0, 4);
  } catch (error) {
    console.error('Error getting fitness program recommendations:', error);
    throw error;
  }
};

// Funcție pentru a sorta programele în funcție de relevanța pentru profilul utilizatorului
const sortProgramsByRelevance = (programs, userProfile) => {
  return programs.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Criterii de potrivire exactă primesc punctaj mai mare
    if (a.gender === userProfile.gender) scoreA += 3;
    if (b.gender === userProfile.gender) scoreB += 3;
    
    if (a.diet === userProfile.diet) scoreA += 3;
    if (b.diet === userProfile.diet) scoreB += 3;
    
    if (a.programType === userProfile.fitnessGoal) scoreA += 4;
    if (b.programType === userProfile.fitnessGoal) scoreB += 4;
    
    if (a.difficultyLevel === userProfile.fitnessLevel) scoreA += 2;
    if (b.difficultyLevel === userProfile.fitnessLevel) scoreB += 2;
    
    // Verificăm dacă programele sunt potrivite pentru vârsta utilizatorului
    if (a.ageRangeMin && a.ageRangeMax) {
      if (userProfile.age >= a.ageRangeMin && userProfile.age <= a.ageRangeMax) {
        scoreA += 2;
      }
    }
    
    if (b.ageRangeMin && b.ageRangeMax) {
      if (userProfile.age >= b.ageRangeMin && userProfile.age <= b.ageRangeMax) {
        scoreB += 2;
      }
    }
    
    return scoreB - scoreA; // Sortare descrescătoare după scor
  });
};

// Funcție pentru a obține rețete recomandate
export const getRecipeRecommendations = (userProfile) => {
  // Obținem lista de alergeni și ingrediente excluse din profil
  const allergensAndExclusions = userProfile.allergies || [];
  
  // Obținem preferințele alimentare și obiectivele din profil
  const { diet, fitnessGoal, favoriteIngredients = [] } = userProfile;
  
  // Conversia obiectivelor de fitness la tipuri de diete pentru rețete
  const dietTypeMap = {
    'slăbit': 'slăbit',
    'fit': 'menținere',
    'masă musculară': 'masă musculară'
  };
  
  const targetDietType = dietTypeMap[fitnessGoal] || 'menținere';
  
  // Filtrăm rețetele în funcție de dietă, obiective și alergeni
  let filteredRecipes = recipeDatabase.filter(recipe => {
    // Verificăm dacă rețeta se potrivește cu dieta
    const matchesDiet = recipe.dietTypes.includes(diet);
    
    // Verificăm dacă rețeta se potrivește cu obiectivul
    const matchesGoal = recipe.dietTypes.includes(targetDietType);
    
    // Verificăm dacă rețeta conține alergeni sau ingrediente excluse
    const containsAllergens = allergensAndExclusions.some(allergen => 
      recipe.ingredients.some(ingredient => 
        ingredientMatches(ingredient, allergen)
      )
    );
    
    return matchesDiet && matchesGoal && !containsAllergens;
  });
  
  // Calculăm un scor pentru fiecare rețetă bazat pe potrivirea cu ingredientele favorite
  filteredRecipes = filteredRecipes.map(recipe => {
    let score = 0;
    let matchedIngredients = [];
    let matchedVariations = [];
    
    // Verificăm fiecare ingredient din rețetă
    recipe.ingredients.forEach(recipeIngredient => {
      favoriteIngredients.forEach(favoriteIngredient => {
        if (ingredientMatches(recipeIngredient, favoriteIngredient)) {
          score += 5;
          matchedIngredients.push(favoriteIngredient);
          matchedVariations.push(recipeIngredient);
        }
      });
    });
    
    // Adăugăm scorul și ingredientele potrivite la rețetă
    return {
      ...recipe,
      score,
      matchedIngredients,
      matchedVariations
    };
  });
  
  // Sortăm rețetele după scor
  filteredRecipes.sort((a, b) => b.score - a.score);
  
  // Returnăm primele 6 rețete
  return filteredRecipes.slice(0, 6);
};