import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import RecipeFilter from '../components/recipes/recipeFilter';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeDetailModal from '../components/recipes/RecipeDetailModal';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../api/recipeService';
import './RecipesPage.css';

const RecipesPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // State pentru rețete și filtre
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State pentru filtre
  const [filters, setFilters] = useState({
    dietType: '',
    objective: '',
    proteinContent: '',
    maxCalories: '',
    minProtein: '',
    maxPrepTime: '',
    searchTerm: '',
    favoritesOnly: false
  });

  // State pentru modal de detalii
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  
  // Verificăm dacă utilizatorul este admin
  //const isAdmin = auth?.user?.role === 'admin';
  const isAdmin = true;
  
  // Logging pentru debugging
  useEffect(() => {
    console.log('Auth state:', auth);
    console.log('Is admin?', isAdmin);
  }, [auth, isAdmin]);
  
  // Încărcăm rețetele la montarea componentei
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Efect pentru reîncărcarea rețetelor când se modifică flag-ul favoritesOnly
  useEffect(() => {
    if (filters.favoritesOnly) {
      console.log('Filtrul favoritesOnly s-a modificat la:', filters.favoritesOnly);
      fetchRecipes();
    }
  }, [filters.favoritesOnly]);
  
  // Funcție pentru a încărca rețetele
  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    
    console.log('Fetching recipes with filters:', filters);
    
    try {
      const data = await recipeService.getRecipes(filters);
      console.log('Received recipes:', data);
      setRecipes(data);
    } catch (error) {
      console.error('Eroare la obținerea rețetelor:', error);
      setError('Nu am putut încărca rețetele. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };
  
  // Funcție pentru aplicarea filtrelor
  const applyFilters = () => {
    console.log('Applying filters:', filters);
    fetchRecipes();
  };
  
  // Handler pentru actualizarea statusului de favorit
  const handleFavoriteChange = (recipeId, isFavorite) => {
    console.log('Updating favorite status for recipe:', recipeId, 'New status:', isFavorite);
    
    // Actualizăm starea local
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite } 
          : recipe
      )
    );
    
    // Dacă filtrăm doar după favorite și tocmai am eliminat din favorite, refiltrăm
    if (filters.favoritesOnly && !isFavorite) {
      console.log('Recipe was unfavorited while filtering for favorites only, refetching');
      fetchRecipes();
    }
  };
  
  // Handler pentru navigarea la pagina de editare a rețetei
  const handleEditRecipe = (recipe) => {
    navigate(`/recipe/edit/${recipe.id}`);
  };
  
  // Handler pentru deschiderea modalului de detalii
  const handleViewRecipeDetails = async (recipe) => {
    try {
      setLoading(true);
      // Obținem detaliile complete ale rețetei din baza de date
      const completeRecipe = await recipeService.getRecipeById(recipe.id);
      setCurrentRecipe(completeRecipe);
      setDetailModalOpen(true);
    } catch (error) {
      console.error('Eroare la încărcarea detaliilor rețetei:', error);
      // Folosim datele parțiale disponibile ca fallback
      setCurrentRecipe(recipe);
      setDetailModalOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Handler pentru navigarea la pagina de creare rețetă
  const handleCreateRecipe = () => {
    navigate('/recipe/edit/new');
  };
  
  // Închiderea modalului de detalii
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
  };
  
  // Navigare către pagina de generare AI
  const navigateToAiRecipes = () => {
    navigate('/ai-recipes');
  };
  
  // Funcție pentru resetarea filtrelor
  const resetFilters = () => {
    console.log('Resetting filters');
    setFilters({
      dietType: '',
      objective: '',
      proteinContent: '',
      maxCalories: '',
      minProtein: '',
      maxPrepTime: '',
      searchTerm: '',
      favoritesOnly: false
    });
    
    // Aplicăm filtrele resetate
    setTimeout(() => fetchRecipes(), 0);
  };
  
  return (
    <div className="recipes-page">
      <Navbar />
      
      <div className="recipes-content">
        <div className="page-header">
          <h1>Rețete</h1>
          
          <div className="header-actions">
            <button 
              className="ai-recipe-button"
              onClick={navigateToAiRecipes}
            >
              Generează rețete cu AI
            </button>
            
            {isAdmin && (
              <button 
                className="create-recipe-button"
                onClick={handleCreateRecipe}
              >
                Adaugă rețetă nouă
              </button>
            )}
          </div>
        </div>
        
        {/* Noul layout cu două coloane */}
        <div className="recipes-main-container">
          {/* Coloana principală cu lista de rețete */}
          <div className="recipes-list-column">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Se încarcă rețetele...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
                <button 
                  onClick={fetchRecipes}
                  className="retry-button"
                >
                  Încearcă din nou
                </button>
              </div>
            ) : recipes.length === 0 ? (
              <div className="no-recipes">
                <h3>Nu am găsit rețete</h3>
                
                {filters.favoritesOnly ? (
                  <p>Nu ai nicio rețetă marcată ca favorită. Adaugă rețete la favorite pentru a le vedea aici.</p>
                ) : (
                  <p>Nu există rețete care să corespundă filtrelor selectate. Încearcă să modifici filtrele.</p>
                )}
                
                <button 
                  onClick={resetFilters}
                  className="reset-filters-button"
                >
                  Resetează filtrele
                </button>
              </div>
            ) : (
              <div className="recipes-grid">
                {recipes.map(recipe => (
                  <div className="recipe-card-wrapper" key={recipe.id}>
                    <RecipeCard 
                      recipe={recipe} 
                      onFavoriteChange={handleFavoriteChange}
                      isAdmin={isAdmin}
                      onEdit={() => handleEditRecipe(recipe)}
                      onClick={() => handleViewRecipeDetails(recipe)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Coloana secundară cu filtrele */}
          <div className="recipes-filter-column">
            <RecipeFilter 
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              isLoggedIn={auth?.isLoggedIn}
            />
          </div>
        </div>
      </div>
      
      {/* Modal pentru vizualizarea detaliilor rețetei */}
      <RecipeDetailModal 
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        recipe={currentRecipe}
      />
    </div>
  );
};

export default RecipesPage;