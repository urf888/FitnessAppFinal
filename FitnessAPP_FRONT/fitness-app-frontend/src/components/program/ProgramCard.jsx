import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgramCard.css';

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/programs/${program.id}`);
  };

  // Alegem o imagine placeholder dacă nu există una specificată
  const imageUrl = program.imageUrl || 
    (program.gender === 'femeie' 
      ? '/placeholders/female.jpg' 
      : '/placeholders/male.jpg');

  // Determinăm clasa CSS în funcție de tipul programului
  const programTypeClass = getProgramTypeClass(program.programType);

  return (
    <div className={`program-card ${programTypeClass}`} onClick={handleClick}>
      <div className="program-image-container">
        <img src={imageUrl} alt={program.name} className="program-image" />
        <div className="program-type-badge">{program.programType}</div>
      </div>
      
      <div className="program-info">
        <h3>{program.name}</h3>
        
        <div className="program-details">
          <span className="program-detail">
            <i className="icon-gender"></i>
            {program.gender}
          </span>
          
          <span className="program-detail">
            <i className="icon-diet"></i>
            {program.diet}
          </span>
        </div>
        
        <button className="view-details-btn">Vezi detalii</button>
      </div>
    </div>
  );
};

// Funcție pentru a determina clasa CSS pe baza tipului de program
const getProgramTypeClass = (programType) => {
  switch (programType.toLowerCase()) {
    case 'slabit':
      return 'program-slabit';
    case 'masa musculara':
    case 'masa':
      return 'program-masa';
    case 'fit':
      return 'program-fit';
    default:
      return '';
  }
};

export default ProgramCard;