import React from 'react';
import './ProgramFilters.css';

const ProgramFilters = ({ filters, onChange }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="program-filters">
      <h3>Filtrează Programele</h3>
      
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="gender">Gen:</label>
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
        
        <div className="filter-group">
          <label htmlFor="diet">Dietă:</label>
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
        
        <div className="filter-group">
          <label htmlFor="programType">Tip Program:</label>
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
  );
};

export default ProgramFilters;