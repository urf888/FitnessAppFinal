import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importăm ProgramImage direct din directorul common
import ProgramImage from '../program/ProgramImage';
import './ProgramCard.css';

const ProgramCard = ({ program, displayMode = 'grid' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/programs/${program.id}`);
  };

  // Determinăm clasa CSS în funcție de tipul programului
  const programTypeClass = getProgramTypeClass(program.programType);
  
  // Funcție pentru a traduce tipul programului
  const getProgramTypeTranslation = (type) => {
    switch(type?.toLowerCase()) {
      case 'slabit':
        return 'Slăbit';
      case 'masa musculara':
      case 'masa':
        return 'Masă Musculară';
      case 'fit':
        return 'Fitness';
      default:
        return type || 'General';
    }
  };
  
  // Determinăm iconița pentru dietă
  const getDietIcon = (diet) => {
    switch(diet?.toLowerCase()) {
      case 'carnivor':
        return 'icon-meat';
      case 'vegan':
        return 'icon-plant';
      case 'vegetarian':
        return 'icon-vegetable';
      default:
        return 'icon-food';
    }
  };
  
  // Calculăm durata estimată a antrenamentului
  const getEstimatedDuration = () => {
    const duration = program.durationWeeks || 4;
    return `${duration} săptămâni`;
  };

  return (
    <div 
      className={`program-card ${programTypeClass} ${displayMode === 'list' ? 'list-view' : ''}`} 
      onClick={handleClick}
    >
      <div className="program-image-wrapper">
        <ProgramImage 
          program={program} 
          className="card-image-container" 
          alt={`Program ${program.name}`}
        />
        <div className={`program-type-badge ${programTypeClass}`}>
          {getProgramTypeTranslation(program.programType)}
        </div>
      </div>
      
      <div className="program-content">
        <h3 className="program-title">{program.name}</h3>
        
        <div className="program-indicators">
          <div className="program-detail">
            <span className="detail-icon icon-gender"></span>
            <span className="detail-text">{program.gender === 'femeie' ? 'Femei' : 'Bărbați'}</span>
          </div>
          
          <div className="program-detail">
            <span className={`detail-icon ${getDietIcon(program.diet)}`}></span>
            <span className="detail-text">{program.diet}</span>
          </div>
          
          <div className="program-detail">
            <span className="detail-icon icon-calendar"></span>
            <span className="detail-text">{getEstimatedDuration()}</span>
          </div>
        </div>
        
        {program.description && (
          <p className="program-description">
            {truncateText(program.description, displayMode === 'list' ? 120 : 80)}
          </p>
        )}
        
        <div className="program-difficulty">
          <span className="difficulty-label">Dificultate:</span>
          <div className="difficulty-bar">
            <div 
              className={`difficulty-level ${getDifficultyClass(program.difficultyLevel)}`}
            ></div>
          </div>
          <span className="difficulty-text">{program.difficultyLevel || 'Începător'}</span>
        </div>
        
        <button className="view-program-btn">
          Vezi programul
          <span className="btn-icon-arrow"></span>
        </button>
      </div>
    </div>
  );
};

// Funcție pentru a trunca textul
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Funcție pentru a determina clasa CSS în funcție de tipul programului
const getProgramTypeClass = (programType) => {
  switch (programType?.toLowerCase()) {
    case 'slabit':
      return 'type-weight-loss';
    case 'masa musculara':
    case 'masa':
      return 'type-muscle-gain';
    case 'fit':
      return 'type-fitness';
    default:
      return '';
  }
};

// Funcție pentru a determina clasa CSS în funcție de nivelul de dificultate
const getDifficultyClass = (difficultyLevel) => {
  switch (difficultyLevel?.toLowerCase()) {
    case 'începător':
      return 'level-beginner';
    case 'intermediar':
      return 'level-intermediate';
    case 'avansat':
      return 'level-advanced';
    default:
      return 'level-beginner';
  }
};

export default ProgramCard;