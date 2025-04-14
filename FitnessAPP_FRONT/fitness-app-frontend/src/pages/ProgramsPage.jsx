/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import ProgramFilters from '../components/program/ProgramFilters';
import ProgramCard from '../components/program/ProgramCard';
import { getAllPrograms, getFilteredPrograms } from '../api/programService';
import { preloadProgramImages } from '../api/imageService';
import './ProgramsPage.css';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    diet: 'all',
    programType: 'all'
  });
  const [displayMode, setDisplayMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data;
      
      // Verificăm dacă sunt aplicate filtre
      const hasFilters = filters.gender !== 'all' || 
                         filters.diet !== 'all' || 
                         filters.programType !== 'all';
      
      if (hasFilters) {
        data = await getFilteredPrograms(
          filters.gender !== 'all' ? filters.gender : null,
          filters.diet !== 'all' ? filters.diet : null,
          filters.programType !== 'all' ? filters.programType : null
        );
      } else {
        data = await getAllPrograms();
      }
      
      setPrograms(data);
      
      // Preîncarcă imaginile programelor pentru a îmbunătăți experiența utilizatorului
      if (data && data.length > 0) {
        preloadProgramImages(data);
      }
    } catch (error) {
      setError('Nu am putut încărca programele. Te rugăm să încerci din nou.');
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleDisplayMode = () => {
    setDisplayMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="programs-page">
      <Navbar />
      
      <div className="programs-content">
        <div className="programs-header">
          <div className="programs-title-section">
            <h1>Programe de Fitness</h1>
            <p className="subtitle">Descoperă programele noastre personalizate pentru toate obiectivele tale de fitness.</p>
          </div>
          
          <div className="display-controls">
            <button 
              className={`display-mode-btn ${displayMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setDisplayMode('grid')}
              aria-label="Grid view"
            >
              <i className="icon-grid"></i>
            </button>
            <button 
              className={`display-mode-btn ${displayMode === 'list' ? 'active' : ''}`} 
              onClick={() => setDisplayMode('list')}
              aria-label="List view"
            >
              <i className="icon-list"></i>
            </button>
          </div>
        </div>
        
        <ProgramFilters filters={filters} onChange={handleFilterChange} />
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Se încarcă programele...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchPrograms} className="retry-button">
              Încearcă din nou
            </button>
          </div>
        ) : (
          <div className={`programs-container ${displayMode === 'grid' ? 'programs-grid' : 'programs-list'}`}>
            {programs.length > 0 ? (
              programs.map(program => (
                <ProgramCard 
                  key={program.id} 
                  program={program} 
                  displayMode={displayMode}
                />
              ))
            ) : (
              <div className="no-programs">
                <div className="no-programs-icon">
                  <i className="icon-sad"></i>
                </div>
                <h3>Niciun program găsit</h3>
                <p>Nu am găsit programe care să corespundă filtrelor tale.</p>
                <button 
                  onClick={() => setFilters({ gender: 'all', diet: 'all', programType: 'all' })}
                  className="reset-filters-button"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;