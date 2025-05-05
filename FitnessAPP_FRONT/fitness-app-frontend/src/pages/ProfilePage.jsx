/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileView from '../components/profile/ProfileView';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeDetailModal from '../components/recipes/RecipeDetailModal';
import { getUserProfile, createUserProfile, updateUserProfile } from '../api/profileService';
import useCalorieRecommendation from '../components/analysis/useCalorieRecommendation';
import recipeService from '../api/recipeService';
import './ProfilePage.css';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  
  // State pentru modal detalii rețetă
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  
  // Obținem recomandările de calorii calculate cu ajutorul AI-ului
  const { recommendation, loading: caloriesLoading, error: caloriesError } = useCalorieRecommendation(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        // Dacă primim 404, înseamnă că nu există profil, ceea ce este ok
        if (error.response && error.response.status === 404) {
          setProfile(null);
        } else {
          setError('Eroare la încărcarea profilului. Încearcă din nou mai târziu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Obținem rețete recomandate atunci când avem o recomandare de calorii disponibilă
  useEffect(() => {
    const fetchRecommendedRecipes = async () => {
      if (!recommendation || !recommendation.calories) return;
      
      setLoadingRecipes(true);
      try {
        // Obținem rețete recomandate pentru utilizator
        // Adăugăm un filtru pentru a obține rețete sub numărul recomandat de calorii
        const filters = {
          maxCalories: Math.ceil(recommendation.calories / 3), // Presupunem că e pentru o masă (1/3 din necesarul zilnic)
          minProtein: Math.floor(recommendation.macros.protein.grams / 4) // Aproximativ 1/4 din necesarul de proteine zilnic
        };
        
        // Încercăm întâi să obținem rețete filtrate
        let recipes = await recipeService.getRecipes(filters);
        
        // Dacă nu avem suficiente rețete, folosim getRecommendedRecipes fără filtre
        if (recipes.length < 3) {
          recipes = await recipeService.getRecommendedRecipes(3);
        }
        
        // Sortăm rețetele după numărul de calorii (crescător)
        recipes.sort((a, b) => a.calories - b.calories);
        
        // Păstrăm doar primele 3 rețete
        setRecommendedRecipes(recipes.slice(0, 3));
      } catch (error) {
        console.error('Eroare la obținerea rețetelor recomandate:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecommendedRecipes();
  }, [recommendation]);

  const handleSaveProfile = async (profileData) => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let response;
      
      if (profile) {
        // Actualizare profil existent
        response = await updateUserProfile(profileData);
        setSuccess('Profilul a fost actualizat cu succes!');
      } else {
        // Creare profil nou
        response = await createUserProfile({
          ...profileData,
          userId: currentUser.id
        });
        setSuccess('Profilul a fost creat cu succes!');
      }
      
      setProfile(response);
      setIsEditing(false); // Revenim la modul de vizualizare după salvare
    } catch (error) {
      setError('Eroare la salvarea profilului. Verifică datele și încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };
  
  // Handler pentru deschiderea modalului de detalii rețetă
  const handleViewRecipeDetails = async (recipe) => {
    try {
      setLoading(true);
      
      // Obținem detaliile complete ale rețetei din baza de date
      let completeRecipe;
      try {
        completeRecipe = await recipeService.getRecipeById(recipe.id);
      } catch (error) {
        console.error('Eroare la încărcarea detaliilor rețetei:', error);
        // Folosim datele parțiale disponibile ca fallback
        completeRecipe = recipe;
      }
      
      // Setăm rețeta curentă și deschidem modalul
      setCurrentRecipe(completeRecipe);
      setDetailModalOpen(true);
    } catch (error) {
      console.error('Eroare la încărcarea detaliilor rețetei:', error);
    } finally {
      setLoading(false);
    }
  };

  // Închiderea modalului de detalii
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setCurrentRecipe(null);
  };

  // Calculăm BMI
  const calculateBMI = () => {
    if (!profile) return null;
    
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Determinăm categoria BMI
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    
    if (bmi < 18.5) return 'Subponderal';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Supraponderal';
    return 'Obezitate';
  };

  // Calculăm necesar caloric standard (pentru comparație)
  const calculateStandardCalories = () => {
    if (!profile) return null;
    
    // Calcularea BMR (Basal Metabolic Rate) folosind formula Harris-Benedict
    let bmr;
    if (profile.sex === 'masculin') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }
    
    // Factori de activitate
    const activityFactors = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very active': 1.9
    };
    
    const activityFactor = activityFactors[profile.activityLevel?.toLowerCase()] || 1.2;
    
    // Calcularea TDEE (Total Daily Energy Expenditure)
    const maintenanceCalories = Math.round(bmr * activityFactor);
    return maintenanceCalories;
  };

  // Renderăm panoul de calorii recomandate
  const renderCaloriesRecommendation = () => {
    if (!profile) return null;
    
    const standardCalories = calculateStandardCalories();
    const bmi = calculateBMI();
    const bmiCategory = getBMICategory(bmi);
    
    return (
      <div className="calories-recommendation">
        <h2>Recomandare Calorică</h2>
        
        <div className="metrics-container">
          <div className="metric-card bmi-card">
            <div className="metric-title">Indice Masă Corporală</div>
            <div className="metric-value">{bmi}</div>
            <div className="metric-subtitle">{bmiCategory}</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Necesar de Menținere</div>
            <div className="metric-value">{standardCalories}</div>
            <div className="metric-subtitle">kcal/zi</div>
          </div>
          
          {recommendation && (
            <div className="metric-card highlight-card">
              <div className="metric-title">Recomandare AI</div>
              <div className="metric-value">{recommendation.calories}</div>
              <div className="metric-subtitle">kcal/zi</div>
            </div>
          )}
        </div>
        
        {caloriesLoading ? (
          <div className="calories-loading">Calculăm recomandarea calorică...</div>
        ) : caloriesError ? (
          <div className="calories-error">Nu am putut calcula recomandarea. Încearcă din nou mai târziu.</div>
        ) : recommendation && recommendation.macros ? (
          <div className="macros-info">
            <h3>Distribuție macronutrienți recomandată</h3>
            <div className="macros-container">
              <div className="macro-item protein">
                <div className="macro-name">Proteine</div>
                <div className="macro-value">{recommendation.macros.protein.grams}g</div>
                <div className="macro-percentage">{recommendation.macros.protein.percentage}%</div>
              </div>
              <div className="macro-item carbs">
                <div className="macro-name">Carbohidrați</div>
                <div className="macro-value">{recommendation.macros.carbs.grams}g</div>
                <div className="macro-percentage">{recommendation.macros.carbs.percentage}%</div>
              </div>
              <div className="macro-item fat">
                <div className="macro-name">Grăsimi</div>
                <div className="macro-value">{recommendation.macros.fat.grams}g</div>
                <div className="macro-percentage">{recommendation.macros.fat.percentage}%</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // Renderăm secțiunea de rețete recomandate
  const renderRecommendedRecipes = () => {
    if (!profile || !recommendation) return null;
    
    return (
      <div className="recommended-recipes">
        <h2>Rețete Recomandate</h2>
        
        {loadingRecipes ? (
          <div className="recipes-loading">Se încarcă rețetele recomandate...</div>
        ) : recommendedRecipes.length === 0 ? (
          <div className="no-recipes">
            Nu am găsit rețete potrivite pentru tine. Încearcă să vizitezi secțiunea de rețete pentru mai multe opțiuni.
          </div>
        ) : (
          <>
            <p className="recipes-description">
              Aceste rețete sunt recomandate în funcție de necesarul tău caloric de {recommendation.calories} kcal/zi.
            </p>
            
            <div className="recipes-grid">
              {recommendedRecipes.map(recipe => (
                <div className="recipe-card-wrapper" key={recipe.id}>
                  <RecipeCard 
                    recipe={recipe} 
                    onClick={() => handleViewRecipeDetails(recipe)}
                  />
                </div>
              ))}
            </div>
            
            <div className="all-recipes-link">
              <button 
                className="view-more-recipes"
                onClick={() => navigate('/recipes')}
              >
                Vezi toate rețetele
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1>Profilul Meu</h1>
          <p className="profile-subtitle">Gestionează informațiile tale personale și preferințele pentru antrenament</p>
        </div>
        
        {loading ? (
          <div className="loading">Se încarcă profilul...</div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {/* Afișăm formularul de creare de profil dacă utilizatorul nu are încă un profil */}
            {!profile && !isEditing ? (
              <div className="no-profile-message">
                <p>Nu ai încă un profil. Completează informațiile de mai jos pentru a-ți crea profilul.</p>
                <ProfileForm 
                  profile={null} 
                  onSave={handleSaveProfile} 
                  isLoading={saving}
                  onCancel={null} // Nu oferim opțiunea de a anula prima creare
                />
              </div>
            ) : isEditing ? (
              // Modul de editare profil
              <ProfileForm 
                profile={profile} 
                onSave={handleSaveProfile} 
                isLoading={saving}
                onCancel={handleCancelEdit}
              />
            ) : (
              // Modul de vizualizare profil - layout cu două coloane
              <>
                <div className="profile-layout">
                  <div className="profile-column">
                    <div className="user-info">
                      <div className="user-info-header">
                        <div className="avatar">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <h2>{currentUser.username}</h2>
                          <p>{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <ProfileView 
                        profile={profile} 
                        onEdit={handleEditProfile}
                      />
                    </div>
                  </div>
                  
                  <div className="profile-column">
                    {/* Secțiunea de recomandări calorice */}
                    {profile && renderCaloriesRecommendation()}
                  </div>
                </div>
                
                {/* Secțiunea de rețete recomandate - afișată sub layout-ul cu două coloane */}
                {profile && renderRecommendedRecipes()}
              </>
            )}
          </>
        )}
      </div>
      
      {/* Modal pentru detalii rețetă */}
      <RecipeDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        recipe={currentRecipe}
      />
    </div>
  );
};

export default ProfilePage;