import React, { useState } from 'react';
import './ProgramFilters.css';

const ProgramFilters = ({ filters, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };
  
  const resetFilters = () => {
    onChange({
      gender: 'all',
      diet: 'all',
      programType: 'all'
    });
  };
  
  // Verifică dacă sunt aplicate filtre
  const hasActiveFilters = filters.gender !== 'all' || filters.diet !== 'all' || filters.programType !== 'all';
  
  return (
    <div className="program-filters-container">
      <div className="filters-header">
        <div className="filters-title">
          <h2>Filtre</h2>
          {hasActiveFilters && (
            <span className="active-filters-badge">{getActiveFiltersCount(filters)}</span>
          )}
        </div>
        
        <div className="filters-actions">
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={resetFilters}>
              Resetează
            </button>
          )}
          
          <button 
            className="toggle-filters-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Ascunde' : 'Arată'} filtrele
            <span className={`arrow-icon ${isExpanded ? 'up' : 'down'}`}></span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="filters-body">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="gender">Gen</label>
              <div className="select-wrapper">
                <select
                  id="gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="all">Toate</option>
                  <option value="femeie">Femei</option>
                  <option value="barbat">Bărbați</option>
                </select>
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="diet">Dietă</label>
              <div className="select-wrapper">
                <select
                  id="diet"
                  name="diet"
                  value={filters.diet}
                  onChange={handleFilterChange}
                >
                  <option value="all">Toate</option>
                  <option value="carnivor">Carnivor</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="programType">Tip Program</label>
              <div className="select-wrapper">
                <select
                  id="programType"
                  name="programType"
                  value={filters.programType}
                  onChange={handleFilterChange}
                >
                  <option value="all">Toate</option>
                  <option value="slabit">Slăbit</option>
                  <option value="fit">Fitness</option>
                  <option value="masa">Masă Musculară</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Funcție auxiliară pentru a număra filtrele active
const getActiveFiltersCount = (filters) => {
  return Object.values(filters).filter(value => value !== 'all').length;
};

export default ProgramFilters;