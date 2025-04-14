/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  getWorkoutDaysForProgram, 
  getWorkoutDayById,
  addWorkoutDayToProgram, 
  updateWorkoutDay, 
  deleteWorkoutDay 
} from '../../api/programService';
import WorkoutDayForm from '../../components/admin/WorkoutDayForm';
import './WorkoutDayManager.css';

const WorkoutDayManager = ({ programId, onBack, onManageExercises }) => {
  const [workoutDays, setWorkoutDays] = useState([]);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [programDetails, setProgramDetails] = useState(null);

  // Încărcăm zilele de antrenament la montarea componentei
  useEffect(() => {
    fetchWorkoutDays();
  }, [programId]);

  const fetchWorkoutDays = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getWorkoutDaysForProgram(programId);
      // Sortăm zilele după ordinea lor în săptămână
      const sortedData = data.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      setWorkoutDays(sortedData);
    } catch (error) {
      setError('Nu am putut încărca zilele de antrenament. Te rugăm să încerci din nou.');
      console.error('Error fetching workout days:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedWorkoutDay(null);
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handleEdit = (workoutDay) => {
    setSelectedWorkoutDay(workoutDay);
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handleViewDetails = async (workoutDayId) => {
    setIsLoading(true);
    try {
      const workoutDay = await getWorkoutDayById(workoutDayId, true);
      setSelectedWorkoutDay(workoutDay);
      onManageExercises(workoutDay);
    } catch (error) {
      setError('Nu am putut încărca detaliile zilei de antrenament.');
      console.error('Error fetching workout day details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageExercises = (workoutDay) => {
    if (onManageExercises) {
      onManageExercises(workoutDay);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ești sigur că dorești să ștergi această zi de antrenament? Toate exercițiile asociate vor fi șterse definitiv.')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await deleteWorkoutDay(id);
      await fetchWorkoutDays();
      setSuccess('Ziua de antrenament a fost ștearsă cu succes!');
    } catch (error) {
      setError('Eroare la ștergerea zilei de antrenament. Te rugăm să încerci din nou.');
      console.error('Error deleting workout day:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (selectedWorkoutDay) {
        // Actualizare zi de antrenament existentă
        const updatedWorkoutDay = {
          ...selectedWorkoutDay,
          ...formData
        };
        await updateWorkoutDay(selectedWorkoutDay.id, updatedWorkoutDay);
        setSuccess(`Ziua de antrenament "${formData.name}" a fost actualizată cu succes!`);
      } else {
        // Creare zi de antrenament nouă
        await addWorkoutDayToProgram(programId, formData);
        setSuccess(`Ziua de antrenament "${formData.name}" a fost adăugată cu succes!`);
      }
      
      // Actualizăm lista de zile de antrenament
      await fetchWorkoutDays();
      
      // Închidem formularul
      setIsFormVisible(false);
    } catch (error) {
      setError('Eroare la salvarea zilei de antrenament. Verifică datele și încearcă din nou.');
      console.error('Error saving workout day:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedWorkoutDay(null);
  };

  // Obține numele zilei săptămânii
  const getDayName = (dayNumber) => {
    const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    return days[dayNumber - 1] || 'Necunoscut';
  };

  // Obține numărul de exerciții dintr-o zi de antrenament
  const getExerciseCount = (workoutDay) => {
    return workoutDay.exerciseWorkouts?.length || 0;
  };

  return (
    <div className="workout-day-manager">
      <div className="manager-header">
        <h2>Zile de Antrenament</h2>
        
        {/* Buton pentru înapoi */}
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &larr; Înapoi la programe
          </button>
        )}
      </div>
      
      {/* Mesaje de eroare/succes */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!isFormVisible ? (
        <div className="workout-days-section">
          {/* Buton pentru adăugare */}
          <button 
            className="add-button"
            onClick={handleAddNew}
            disabled={isLoading}
          >
            <i className="icon-add"></i> Adaugă Zi de Antrenament
          </button>
          
          {isLoading ? (
            <div className="loading-spinner">Se încarcă...</div>
          ) : workoutDays.length === 0 ? (
            <div className="no-items">Nu există zile de antrenament pentru acest program. Adaugă prima zi de antrenament folosind butonul de mai sus.</div>
          ) : (
            <div className="workout-days-list">
              {workoutDays.map(workoutDay => (
                <div key={workoutDay.id} className="workout-day-item">
                  <div className="workout-day-info">
                    <h3>{workoutDay.name}</h3>
                    <div className="workout-day-details">
                      <span className="day-badge">{getDayName(workoutDay.dayOfWeek)}</span>
                      <span className="duration-badge">{workoutDay.durationMinutes} minute</span>
                      <span className="exercise-badge">{getExerciseCount(workoutDay)} exerciții</span>
                    </div>
                    {workoutDay.notes && (
                      <p className="workout-day-notes">{workoutDay.notes}</p>
                    )}
                  </div>
                  <div className="workout-day-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(workoutDay)}
                      title="Editează ziua de antrenament"
                    >
                      Editează
                    </button>
                    <button 
                      className="manage-button"
                      onClick={() => handleManageExercises(workoutDay)}
                      title="Gestionează exercițiile din această zi"
                    >
                      Exerciții
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(workoutDay.id)}
                      title="Șterge ziua de antrenament"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instrucțiuni pentru administrare program */}
          {workoutDays.length > 0 && (
            <div className="workout-day-instructions">
              <div className="instruction-icon">ℹ️</div>
              <div className="instruction-text">
                <p><strong>Recomandări pentru program complet:</strong></p>
                <ul>
                  <li>Adaugă zile de antrenament pentru fiecare zi a săptămânii în care programul va avea exerciții</li>
                  <li>Pentru fiecare zi, adaugă exercițiile necesare folosind butonul "Exerciții"</li>
                  <li>Asigură-te că ai exerciții pentru toate grupele musculare vizate de program</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <WorkoutDayForm 
          workoutDay={selectedWorkoutDay}
          onSave={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

WorkoutDayManager.propTypes = {
  programId: PropTypes.number.isRequired,
  onBack: PropTypes.func,
  onManageExercises: PropTypes.func.isRequired
};

export default WorkoutDayManager;