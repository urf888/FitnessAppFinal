import React from 'react';
import './RecipeFilter.css';

const RecipeFilter = ({ filters, setFilters, applyFilters, isLoggedIn }) => {
  // Handler pentru schimbarea filtrelor
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Pentru checkbox-uri folosim checked, pentru restul value
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters({
      ...filters,
      [name]: newValue
    });
  };
  
  // Reset la filtre
  const resetFilters = () => {
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
    
    // Aplicăm filtrele imediat după reset
    setTimeout(() => applyFilters(), 0);
  };
  
  return (
    <div className="recipe-filter">
      <div className="filter-header">
        <h3>Filtrează rețete</h3>
        <button 
          className="reset-filters-button" 
          onClick={resetFilters}
          aria-label="Resetează filtrele"
        >
          Resetează
        </button>
      </div>
      
      <div className="filter-form">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="dietType">Tipul dietei</label>
            <select 
              id="dietType" 
              name="dietType" 
              value={filters.dietType} 
              onChange={handleFilterChange}
            >
              <option value="">Toate</option>
              <option value="carnivor">Carnivor</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="objective">Obiectiv</label>
            <select 
              id="objective" 
              name="objective" 
              value={filters.objective} 
              onChange={handleFilterChange}
            >
              <option value="">Toate</option>
              <option value="masă">Masă musculară</option>
              <option value="slăbit">Slăbire</option>
              <option value="fit">Fitness/Menținere</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="proteinContent">Conținut proteic</label>
            <select 
              id="proteinContent" 
              name="proteinContent" 
              value={filters.proteinContent} 
              onChange={handleFilterChange}
            >
              <option value="">Toate</option>
              <option value="normal">Normal</option>
              <option value="ridicat">Ridicat</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="maxCalories">Calorii max.</label>
            <input 
              type="number" 
              id="maxCalories" 
              name="maxCalories" 
              value={filters.maxCalories} 
              onChange={handleFilterChange}
              placeholder="ex: 500"
              min="0"
              max="2000"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="minProtein">Proteine min. (g)</label>
            <input 
              type="number" 
              id="minProtein" 
              name="minProtein" 
              value={filters.minProtein} 
              onChange={handleFilterChange}
              placeholder="ex: 20"
              min="0"
              max="200"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrepTime">Timp prep. max. (min)</label>
            <input 
              type="number" 
              id="maxPrepTime" 
              name="maxPrepTime" 
              value={filters.maxPrepTime} 
              onChange={handleFilterChange}
              placeholder="ex: 30"
              min="0"
              max="300"
            />
          </div>
        </div>
        
        <div className="filter-row search-row">
          <div className="filter-group search-group">
            <label htmlFor="searchTerm">Caută după numele sau descrierea rețetei</label>
            <input 
              type="text" 
              id="searchTerm" 
              name="searchTerm" 
              value={filters.searchTerm} 
              onChange={handleFilterChange}
              placeholder="ex: pui, legume, desert..."
            />
          </div>
        </div>
        
        {isLoggedIn && (
          <div className="filter-row favorites-row">
            <div className="filter-group checkbox-group">
              <label htmlFor="favoritesOnly" className="checkbox-label">
                <input 
                  type="checkbox" 
                  id="favoritesOnly" 
                  name="favoritesOnly" 
                  checked={filters.favoritesOnly} 
                  onChange={handleFilterChange}
                />
                <span className="checkbox-text">Arată doar rețetele favorite</span>
              </label>
            </div>
          </div>
        )}
        
        <div className="filter-actions">
          <button 
            className="apply-filters-button"
            onClick={applyFilters}
            type="button"
          >
            Aplică filtrele
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeFilter;