/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { getUserProfile } from '../api/profileService';
import { getFilteredPrograms } from '../api/programService';
import { ingredientMatches } from '../data/ingredientVariations';
import { recipeDatabase } from '../data/recipeDatabase';
import ProgramCard from '../components/program/ProgramCard';
import RecipeList from '../components/recipes/RecipeList';
import RecipeDetail from '../components/recipes/RecipeDetail';
import RecommendationCard from '../components/recommendation/RecommendationCard';
import './PersonalizedRecommendationPage.css';

const PersonalizedRecommendationPage = () => {
  const navigate = useNavigate();
  
  // State pentru date profil și recomandări
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State pentru programe recomandate
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  
  // State pentru rețete recomandate
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // State pentru tab-ul activ
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'fitness', 'nutrition'

  // Încarcă profilul utilizatorului la montarea componentei
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Nu am putut încărca profilul. Te rugăm să completezi profilul pentru recomandări personalizate.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Obține programe recomandate bazate pe profil
  useEffect(() => {
    const fetchRecommendedPrograms = async () => {
      if (!profile) return;
      
      setLoadingPrograms(true);
      try {
        // Mapare din proprietățile profilului la parametrii API-ului
        const gender = profile.sex === 'masculin' ? 'barbat' : 'femeie';
        
        // Determinăm tipul de program pe baza obiectivului
        let programType = 'fit'; // valoare implicită
        if (profile.objective === 'slăbit') {
          programType = 'slabit';
        } else if (profile.objective === 'masă musculară') {
          programType = 'masa';
        } else if (profile.objective === 'fitness general') {
          programType = 'fit';
        }
        
        // Mapare nivel activitate la nivel dificultate
        let difficultyLevel = 'intermediar'; // valoare implicită
        if (profile.activityLevel === 'sedentary' || profile.activityLevel === 'light') {
          difficultyLevel = 'începător';
        } else if (profile.activityLevel === 'moderate') {
          difficultyLevel = 'intermediar';
        } else if (profile.activityLevel === 'active' || profile.activityLevel === 'very active') {
          difficultyLevel = 'avansat';
        }
        
        // Obține programe filtrate în funcție de profilul utilizatorului
        const programsData = await getFilteredPrograms(
          gender,
          null, // nu filtrăm după dietă
          programType,
          difficultyLevel
        );
        
        // Sortăm programele în funcție de potrivirea cu profilul
        const sortedPrograms = sortProgramsByRelevance(programsData, {
          gender,
          diet: null,
          objective: programType,
          difficultyLevel,
          age: profile.age
        });
        
        // Limităm numărul de programe afișate
        setRecommendedPrograms(sortedPrograms.slice(0, 4));
      } catch (err) {
        console.error('Error fetching recommended programs:', err);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchRecommendedPrograms();
  }, [profile]);

  // Obține rețete recomandate bazate pe profil
  useEffect(() => {
    const fetchRecommendedRecipes = async () => {
      if (!profile) return;
      
      setLoadingRecipes(true);
      try {
        // Parsăm alergenele și restricțiile alimentare
        const allergensAndExclusions = profile.allergiesRestrictions ? 
          profile.allergiesRestrictions.split(',').map(item => item.trim()) : 
          [];
        
        // Determinăm dieta pe baza obiectivului user-ului
        let diet = 'carnivor'; // valoare implicită
        
        // Definim ingredientele favorite (în aplicația reală, ar trebui să fie în profil)
        const favoriteIngredients = ['pui', 'orez', 'broccoli'];
        
        // Obține rețete filtrate și potrivite cu profilul și preferințele
        const matchedRecipes = findMatchingRecipes({
          allergies: allergensAndExclusions,
          diet,
          fitnessGoal: profile.objective,
          favoriteIngredients
        });
        
        setRecommendedRecipes(matchedRecipes);
      } catch (err) {
        console.error('Error processing recommended recipes:', err);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecommendedRecipes();
  }, [profile]);

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
      
      if (a.programType === userProfile.objective) scoreA += 4;
      if (b.programType === userProfile.objective) scoreB += 4;
      
      if (a.difficultyLevel === userProfile.difficultyLevel) scoreA += 2;
      if (b.difficultyLevel === userProfile.difficultyLevel) scoreB += 2;
      
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

  // Funcție pentru a găsi rețetele care se potrivesc cu profilul utilizatorului
  const findMatchingRecipes = (userProfile) => {
    // Obținem lista de alergeni și ingrediente excluse din profil
    const allergensAndExclusions = userProfile.allergies || [];
    
    // Obținem preferințele alimentare și obiectivele din profil
    const { diet, fitnessGoal, favoriteIngredients = [] } = userProfile;
    
    // Conversia obiectivelor de fitness la tipuri de diete pentru rețete
    const dietTypeMap = {
      'slăbit': 'slăbit',
      'fitness general': 'menținere',
      'masă musculară': 'masă musculară',
      'menținere': 'menținere'
    };
    
    const targetDietType = dietTypeMap[fitnessGoal] || 'menținere';
    
    // Filtrăm rețetele în funcție de dietă, obiective și alergeni
    let filteredRecipes = recipeDatabase.filter(recipe => {
      // Verificăm dacă rețeta conține alergeni sau ingrediente excluse
      const containsAllergens = allergensAndExclusions.some(allergen => 
        recipe.ingredients.some(ingredient => 
          ingredientMatches(ingredient, allergen)
        )
      );
      
      // Pentru simplificare, ignorăm temporar verificarea tipului de dietă (vegetarian, vegan, etc.)
      // dar verificăm potrivirea cu obiectivul
      const matchesGoal = recipe.dietTypes.some(type => type.includes(targetDietType));
      
      return matchesGoal && !containsAllergens;
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

  // Handler pentru selectarea unei rețete
  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    window.scrollTo(0, 0);
  };

  // Handler pentru întoarcerea la lista de rețete
  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  // Handler pentru navigarea la detaliile unui program
  const handleViewProgram = (programId) => {
    navigate(`/programs/${programId}`);
  };

  const formatActivityLevel = (level) => {
    const activityLevels = {
      'sedentary': 'Sedentar (activitate minimă)',
      'light': 'Ușor (exerciții 1-3 zile/săptămână)',
      'moderate': 'Moderat (exerciții 3-5 zile/săptămână)',
      'active': 'Activ (exerciții 6-7 zile/săptămână)',
      'very active': 'Foarte activ (exerciții intense zilnic)'
    };
    return activityLevels[level] || level;
  };

  return (
    <div className="personalized-recommendation-page">
      <Navbar />
      
      <div className="recommendation-content">
        <div className="recommendation-header">
          <h1>Recomandări Personalizate</h1>
          <p className="subtitle">
            Programe și rețete adaptate pentru tine, bazate pe profilul și obiectivele tale fitness.
          </p>
          
          {/* Tabs pentru navigare */}
          <div className="recommendation-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} 
              onClick={() => setActiveTab('all')}
            >
              Toate Recomandările
            </button>
            <button 
              className={`tab-button ${activeTab === 'fitness' ? 'active' : ''}`} 
              onClick={() => setActiveTab('fitness')}
            >
              Programe Fitness
            </button>
            <button 
              className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`} 
              onClick={() => setActiveTab('nutrition')}
            >
              Nutriție și Rețete
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Se încarcă recomandările...</p>
          </div>
        ) : error || !profile ? (
          <div className="error-container">
            <p>{error || 'Nu am găsit un profil. Te rugăm să completezi profilul pentru recomandări personalizate.'}</p>
            <button onClick={() => navigate('/profile')} className="profile-button">
              Completează Profilul
            </button>
          </div>
        ) : (
          <div className="recommendation-sections">
            {/* Card de recomandare zilnică - afișat doar pe tab-ul 'all' */}
            {activeTab === 'all' && recommendedPrograms.length > 0 && recommendedRecipes.length > 0 && (
              <RecommendationCard 
                program={recommendedPrograms[0]} 
                recipe={recommendedRecipes[0]} 
                onViewProgram={handleViewProgram}
                onViewRecipe={handleSelectRecipe}
              />
            )}
            
            {/* Secțiunea de programe fitness - afișată când tab-ul activ este 'all' sau 'fitness' */}
            {(activeTab === 'all' || activeTab === 'fitness') && (
              <div className="fitness-section">
                <div className="section-header">
                  <h2>Programe Fitness Recomandate</h2>
                  <button 
                    className="view-all-button"
                    onClick={() => navigate('/programs')}
                  >
                    Vezi toate programele
                  </button>
                </div>
                
                {loadingPrograms ? (
                  <div className="loading-spinner-small"></div>
                ) : recommendedPrograms.length === 0 ? (
                  <div className="no-recommendations">
                    <p>Nu am găsit programe potrivite pentru profilul tău actual.</p>
                  </div>
                ) : (
                  <div className="programs-grid">
                    {recommendedPrograms.map(program => (
                      <div 
                        key={program.id} 
                        className="program-card-wrapper"
                        onClick={() => handleViewProgram(program.id)}
                      >
                        <ProgramCard program={program} displayMode="grid" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Secțiunea de nutriție - afișată când tab-ul activ este 'all' sau 'nutrition' */}
            {(activeTab === 'all' || activeTab === 'nutrition') && (
              <div className="nutrition-section">
                <div className="section-header">
                  <h2>Rețete Recomandate</h2>
                  <button 
                    className="view-all-button"
                    onClick={() => navigate('/recipes')}
                  >
                    Explorează toate rețetele
                  </button>
                </div>
                
                {loadingRecipes ? (
                  <div className="loading-spinner-small"></div>
                ) : recommendedRecipes.length === 0 ? (
                  <div className="no-recommendations">
                    <p>Nu am găsit rețete potrivite pentru profilul tău actual.</p>
                  </div>
                ) : selectedRecipe ? (
                  <RecipeDetail 
                    recipe={selectedRecipe} 
                    onBack={handleBackToRecipes} 
                  />
                ) : (
                  <RecipeList 
                    recipes={recommendedRecipes} 
                    onSelectRecipe={handleSelectRecipe} 
                  />
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Secțiunea de profil și preferințe */}
        {!loading && profile && (
          <div className="profile-summary">
            <h3>Profilul Tău</h3>
            <div className="profile-details">
              <div className="profile-detail">
                <span className="detail-label">Obiectiv Fitness:</span>
                <span className="detail-value">{profile.objective || 'Nedefinit'}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Activitate Fizică:</span>
                <span className="detail-value">{formatActivityLevel(profile.activityLevel) || 'Nedefinit'}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Vârstă:</span>
                <span className="detail-value">{profile.age} ani</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Greutate:</span>
                <span className="detail-value">{profile.weight} kg</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Înălțime:</span>
                <span className="detail-value">{profile.height} cm</span>
              </div>
              {profile.allergiesRestrictions && (
                <div className="profile-detail">
                  <span className="detail-label">Alergii/Restricții:</span>
                  <span className="detail-value">
                    {profile.allergiesRestrictions}
                  </span>
                </div>
              )}
            </div>
            <button 
              className="edit-profile-button"
              onClick={() => navigate('/profile')}
            >
              Editează Profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedRecommendationPage;