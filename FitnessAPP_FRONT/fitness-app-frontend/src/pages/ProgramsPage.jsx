import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import ProgramFilters from '../components/program/ProgramFilters';
import ProgramCard from '../components/program/ProgramCard';
import { getAllPrograms, getFilteredPrograms } from '../api/programService';
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

  return (
    <div className="programs-page">
      <Navbar />
      
      <div className="programs-content">
        <h1>Programe de Fitness</h1>
        <p className="subtitle">Descoperă programele noastre personalizate pentru toate obiectivele tale de fitness.</p>
        
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
          <div className="programs-grid">
            {programs.length > 0 ? (
              programs.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))
            ) : (
              <div className="no-programs">
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