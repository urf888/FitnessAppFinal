/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  getWorkoutDayById,
  addExerciseToWorkoutDay, 
  updateExerciseWorkout, 
  deleteExerciseFromWorkoutDay 
} from '../../api/programService';
import { getAllExercises } from '../../api/exerciseService';
import ExerciseWorkoutForm from '../../components/admin/ExerciseWorkoutForm';
import ExercisePreviewModal from './ExercisePreviewModal';
import './ExerciseWorkoutManager.css';

const ExerciseWorkoutManager = ({ workoutDayId, onBack }) => {
  const [workoutDay, setWorkoutDay] = useState(null);
  const [exerciseWorkouts, setExerciseWorkouts] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseWorkout, setSelectedExerciseWorkout] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewExercise, setPreviewExercise] = useState(null);

  // Încărcăm datele la montarea componentei
  useEffect(() => {
    fetchData();
  }, [workoutDayId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Încărcăm ziua de antrenament cu toate exercițiile
      const workoutDayData = await getWorkoutDayById(workoutDayId, true);
      setWorkoutDay(workoutDayData);
      
      // Sortăm exercițiile după ordinea lor
      const sortedExercises = workoutDayData.exerciseWorkouts?.sort((a, b) => a.order - b.order) || [];
      setExerciseWorkouts(sortedExercises);
      
      // Încărcăm toate exercițiile disponibile
      const exercises = await getAllExercises();
      setAllExercises(exercises);
    } catch (error) {
      setError('Nu am putut încărca datele. Te rugăm să încerci din nou.');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedExerciseWorkout(null);
    setIsAddMode(true);
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handleEdit = (exerciseWorkout) => {
    setSelectedExerciseWorkout(exerciseWorkout);
    setIsAddMode(false);
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handlePreviewExercise = (exerciseId) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setPreviewExercise(exercise);
    }
  };

  const handleClosePreview = () => {
    setPreviewExercise(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ești sigur că dorești să ștergi acest exercițiu din antrenament?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await deleteExerciseFromWorkoutDay(id);
      
      // Actualizăm datele
      await fetchData();
      
      setSuccess('Exercițiul a fost șters din antrenament cu succes!');
    } catch (error) {
      setError('Eroare la ștergerea exercițiului. Te rugăm să încerci din nou.');
      console.error('Error deleting exercise workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (selectedExerciseWorkout) {
        // Actualizare exercițiu în zi de antrenament
        const updatedExerciseWorkout = {
          ...selectedExerciseWorkout,
          ...formData
        };
        await updateExerciseWorkout(selectedExerciseWorkout.id, updatedExerciseWorkout);
        setSuccess('Exercițiul a fost actualizat cu succes!');
      } else {
        // Adăugare exercițiu nou în zi de antrenament
        await addExerciseToWorkoutDay(workoutDayId, formData);
        setSuccess('Exercițiul a fost adăugat cu succes!');
      }
      
      // Actualizăm datele
      await fetchData();
      
      // Închidem formularul
      setIsFormVisible(false);
    } catch (error) {
      setError('Eroare la salvarea exercițiului. Verifică datele și încearcă din nou.');
      console.error('Error saving exercise workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedExerciseWorkout(null);
  };

  // Găsim numele exercițiului după ID
  const getExerciseName = (exerciseId) => {
    const exercise = allExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Necunoscut';
  };

  // Formatăm reps/duration pentru afișare
  const formatRepsOrDuration = (exerciseWorkout) => {
    if (exerciseWorkout.duration) {
      return exerciseWorkout.duration;
    }
    return `${exerciseWorkout.reps} rep`;
  };

  return (
    <div className="exercise-workout-manager">
      <div className="manager-header">
        <h2>Exerciții pentru {workoutDay?.name || 'Antrenament'}</h2>
        
        {/* Buton pentru înapoi */}
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &larr; Înapoi la zile de antrenament
          </button>
        )}
      </div>
      
      {/* Mesaje de eroare/succes */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!isFormVisible ? (
        <div className="exercise-workouts-section">
          {/* Buton pentru adăugare */}
          <button 
            className="add-button"
            onClick={handleAddNew}
            disabled={isLoading}
          >
            <i className="icon-add"></i> Adaugă Exercițiu
          </button>
          
          {isLoading ? (
            <div className="loading-spinner">Se încarcă...</div>
          ) : exerciseWorkouts.length === 0 ? (
            <div className="no-items">Nu există exerciții adăugate pentru această zi de antrenament.</div>
          ) : (
            <div className="exercise-workouts-table">
              <table>
                <thead>
                  <tr>
                    <th>Ordine</th>
                    <th>Exercițiu</th>
                    <th className="center-align">Seturi</th>
                    <th className="center-align">Repetări/Durată</th>
                    <th className="center-align">Pauză</th>
                    <th className="center-align">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseWorkouts.map(exerciseWorkout => (
                    <tr key={exerciseWorkout.id}>
                      <td className="center-align">{exerciseWorkout.order}</td>
                      <td>
                        <div className="exercise-name-cell">
                          <span className="exercise-name">
                            {exerciseWorkout.exercise?.name || getExerciseName(exerciseWorkout.exerciseId) || 'Necunoscut'}
                          </span>
                          <button 
                            className="preview-button-sm"
                            onClick={() => handlePreviewExercise(exerciseWorkout.exerciseId)}
                            title="Previzualizare exercițiu"
                          >
                            <i className="icon-eye"></i>
                          </button>
                        </div>
                      </td>
                      <td className="center-align"><span className="badge">{exerciseWorkout.sets}</span></td>
                      <td className="center-align"><span className="badge">{formatRepsOrDuration(exerciseWorkout)}</span></td>
                      <td className="center-align"><span className="badge rest">{exerciseWorkout.restSeconds} sec</span></td>
                      <td className="actions-cell">
                        <button 
                          className="edit-button-sm"
                          onClick={() => handleEdit(exerciseWorkout)}
                          title="Editează exercițiu"
                        >
                          <i className="icon-edit"></i>
                        </button>
                        <button 
                          className="delete-button-sm"
                          onClick={() => handleDelete(exerciseWorkout.id)}
                          title="Șterge exercițiu"
                        >
                          <i className="icon-delete"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <ExerciseWorkoutForm
          exerciseWorkout={selectedExerciseWorkout}
          workoutDay={workoutDay}
          onSave={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}

      {/* Modal pentru previzualizare exercițiu */}
      {previewExercise && (
        <ExercisePreviewModal 
          exercise={previewExercise} 
          onClose={handleClosePreview} 
        />
      )}
    </div>
  );
};

ExerciseWorkoutManager.propTypes = {
  workoutDayId: PropTypes.number.isRequired,
  onBack: PropTypes.func
};

export default ExerciseWorkoutManager;