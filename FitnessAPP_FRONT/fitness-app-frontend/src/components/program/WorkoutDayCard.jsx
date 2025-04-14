import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './WorkoutDayCard.css';

const WorkoutDayCard = ({ workoutDay, isEditMode, onEditExercise, onDeleteExercise }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Sortează exercițiile după ordinea lor
  const sortedExercises = workoutDay.exerciseWorkouts?.sort((a, b) => a.order - b.order) || [];
  
  // Calculăm numărul total de exerciții
  const exerciseCount = sortedExercises.length;
  
  // Estimăm timpul total (în minute) pentru toate exercițiile
  const calculateTotalTime = () => {
    if (!workoutDay.durationMinutes) {
      const averageExerciseTime = 3; // Timp estimat în minute per exercițiu
      const averageRestTime = 1; // Timp estimat de odihnă între exerciții
      return exerciseCount * averageExerciseTime + (exerciseCount - 1) * averageRestTime;
    }
    return workoutDay.durationMinutes;
  };
  
  // Obținem iconița potrivită pentru tipul de antrenament
  const getWorkoutTypeIcon = () => {
    const workoutType = workoutDay.workoutType?.toLowerCase() || '';
    
    if (workoutType.includes('cardio')) {
      return 'icon-cardio';
    } else if (workoutType.includes('forță') || workoutType.includes('greutati') || workoutType.includes('forta')) {
      return 'icon-strength';
    } else if (workoutType.includes('flexibilitate') || workoutType.includes('yoga')) {
      return 'icon-flexibility';
    } else {
      return 'icon-workout';
    }
  };

  return (
    <div className={`workout-day-card ${expanded ? 'expanded' : ''}`}>
      <div className="workout-day-header" onClick={toggleExpand}>
        <div className="workout-info">
          <div className={`workout-type-icon ${getWorkoutTypeIcon()}`}></div>
          
          <div className="workout-title-wrapper">
            <h3 className="workout-title">{workoutDay.name}</h3>
            
            <div className="workout-stats">
              <span className="workout-duration">
                <i className="stat-icon icon-clock"></i>
                {calculateTotalTime()} min
              </span>
              
              <span className="exercise-count">
                <i className="stat-icon icon-exercise"></i>
                {exerciseCount} exerciții
              </span>
            </div>
          </div>
        </div>
        
        <button className={`expand-toggle ${expanded ? 'expanded' : ''}`}>
          <span className="toggle-icon"></span>
        </button>
      </div>
      
      <div className={`workout-day-content ${expanded ? 'visible' : ''}`}>
        {workoutDay.notes && (
          <div className="workout-notes">
            <div className="notes-header">
              <i className="notes-icon"></i>
              <h4>Note importante</h4>
            </div>
            <p>{workoutDay.notes}</p>
          </div>
        )}
        
        <div className="exercises-section">
          <h4 className="exercises-header">Exerciții</h4>
          
          {sortedExercises.length > 0 ? (
            <div className="exercises-list">
              <table>
                <thead>
                  <tr>
                    <th className="col-exercise">Exercițiu</th>
                    <th className="col-sets">Seturi</th>
                    <th className="col-reps">Rep/Durată</th>
                    <th className="col-rest">Pauză</th>
                    {isEditMode && <th className="col-actions">Acțiuni</th>}
                  </tr>
                </thead>
                <tbody>
                  {sortedExercises.map((exerciseWorkout) => (
                    <tr key={exerciseWorkout.id} className="exercise-item">
                      <td className="exercise-name">
                        {exerciseWorkout.exercise?.name || 'Exercițiu necunoscut'}
                      </td>
                      <td className="exercise-sets">
                        <span className="value-badge">{exerciseWorkout.sets}</span>
                      </td>
                      <td className="exercise-reps">
                        <span className="value-badge">
                          {exerciseWorkout.reps 
                            ? `${exerciseWorkout.reps} rep` 
                            : exerciseWorkout.duration || 'N/A'}
                        </span>
                      </td>
                      <td className="exercise-rest">
                        <span className="value-badge rest">
                          {exerciseWorkout.restSeconds 
                            ? `${exerciseWorkout.restSeconds} sec` 
                            : 'N/A'}
                        </span>
                      </td>
                      {isEditMode && (
                        <td className="exercise-actions">
                          <button 
                            className="edit-exercise-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditExercise(exerciseWorkout);
                            }}
                            title="Editează exercițiu"
                          >
                            <i className="icon-edit-sm"></i>
                          </button>
                          <button 
                            className="delete-exercise-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteExercise(exerciseWorkout.id);
                            }}
                            title="Șterge exercițiu"
                          >
                            <i className="icon-delete-sm"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-exercises">
              <div className="no-exercises-icon"></div>
              <p>Nu există exerciții pentru această zi de antrenament.</p>
            </div>
          )}
        </div>
        
        <div className="workout-action">
          <button className="start-workout-btn">
            <i className="btn-icon icon-play"></i>
            Începe antrenamentul
          </button>
        </div>
      </div>
    </div>
  );
};

WorkoutDayCard.propTypes = {
  workoutDay: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool,
  onEditExercise: PropTypes.func,
  onDeleteExercise: PropTypes.func
};

WorkoutDayCard.defaultProps = {
  isEditMode: false,
  onEditExercise: () => {},
  onDeleteExercise: () => {}
};

export default WorkoutDayCard;