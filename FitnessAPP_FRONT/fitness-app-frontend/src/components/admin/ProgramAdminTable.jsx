import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgramAdminTable.css';

const ProgramAdminTable = ({ programs, onEdit, onDelete, onManageWorkoutDays, isLoading }) => {
  const navigate = useNavigate();

  const handleViewProgram = (id) => {
    navigate(`/programs/${id}`);
  };

  return (
    <div className="program-admin-table-container">
      <table className="program-admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Tip Program</th>
            <th>Gen</th>
            <th>Dietă</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="loading-cell">
                <div className="loading-spinner-small"></div>
                Se încarcă programele...
              </td>
            </tr>
          ) : programs.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-table-message">
                Nu există programe. Adaugă primul program folosind butonul de mai sus.
              </td>
            </tr>
          ) : (
            programs.map(program => (
              <tr key={program.id}>
                <td>{program.id}</td>
                <td>{program.name}</td>
                <td>
                  <span className={`program-type-pill ${getProgramTypeClass(program.programType)}`}>
                    {program.programType}
                  </span>
                </td>
                <td>{program.gender}</td>
                <td>{program.diet}</td>
                <td className="actions-cell">
                  <button 
                    className="action-button view-button"
                    onClick={() => handleViewProgram(program.id)}
                    title="Vizualizează program"
                  >
                    <i className="icon-view"></i>
                  </button>
                  
                  <button 
                    className="action-button edit-button"
                    onClick={() => onEdit(program)}
                    title="Editează program"
                  >
                    <i className="icon-edit"></i>
                  </button>
                  
                  <button 
                    className="action-button workout-button"
                    onClick={() => onManageWorkoutDays(program)}
                    title="Administrează zile de antrenament"
                  >
                    <i className="icon-workout"></i>
                  </button>
                  
                  <button 
                    className="action-button delete-button"
                    onClick={() => onDelete(program.id)}
                    title="Șterge program"
                  >
                    <i className="icon-delete"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Funcție pentru a determina clasa CSS pe baza tipului de program
const getProgramTypeClass = (programType) => {
  switch (programType.toLowerCase()) {
    case 'slabit':
      return 'type-slabit';
    case 'masa musculara':
    case 'masa':
      return 'type-masa';
    case 'fit':
      return 'type-fit';
    default:
      return '';
  }
};

export default ProgramAdminTable;