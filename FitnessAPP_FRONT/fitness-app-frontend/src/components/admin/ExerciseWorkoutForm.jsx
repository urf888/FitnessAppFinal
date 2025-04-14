import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllExercises } from '../../api/exerciseService';
import './ExerciseWorkoutForm.css';

const ExerciseWorkoutForm = ({ exerciseWorkout, workoutDay, onSave, onCancel, isLoading }) => {
  const [allExercises, setAllExercises] = useState([]);
  const [formData, setFormData] = useState({
    exerciseId: '',
    order: 1,
    sets: 3,
    reps: 10,
    duration: '',
    weight: '',
    notes: '',
    technique: '',
    restSeconds: 60
  });
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (exerciseWorkout) {
      setFormData({
        exerciseId: exerciseWorkout.exerciseId || '',
        order: exerciseWorkout.order || 1,
        sets: exerciseWorkout.sets || 3,
        reps: exerciseWorkout.reps || 10,
        duration: exerciseWorkout.duration || '',
        weight: exerciseWorkout.weight || '',
        notes: exerciseWorkout.notes || '',
        technique: exerciseWorkout.technique || '',
        restSeconds: exerciseWorkout.restSeconds || 60
      });
    } else if (workoutDay) {
      // For new exercise workout, default to next order in the workout day
      const nextOrder = workoutDay.exerciseWorkouts ? workoutDay.exerciseWorkouts.length + 1 : 1;
      setFormData(prev => ({
        ...prev,
        order: nextOrder
      }));
    }
  }, [exerciseWorkout, workoutDay]);

  const fetchExercises = async () => {
    setLoadingExercises(true);
    try {
      const exercises = await getAllExercises();
      setAllExercises(exercises);
    } catch (err) {
      setError('Nu s-au putut încărca exercițiile.');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Conversii de tipuri pentru câmpurile numerice
    const numericFields = ['order', 'sets', 'reps', 'restSeconds'];
    const floatFields = ['weight'];
    
    let processedValue = value;
    
    if (numericFields.includes(name) && value !== '') {
      processedValue = parseInt(value);
    } else if (floatFields.includes(name) && value !== '') {
      processedValue = parseFloat(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.exerciseId) {
      setError('Te rugăm să selectezi un exercițiu.');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="exercise-workout-form">
      <h3>
        {exerciseWorkout 
          ? 'Editează Exercițiu în Antrenament' 
          : 'Adaugă Exercițiu la Antrenament'}
      </h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="exerciseId">Exercițiu <span className="required">*</span></label>
            <select
              id="exerciseId"
              name="exerciseId"
              value={formData.exerciseId}
              onChange={handleChange}
              disabled={loadingExercises || (exerciseWorkout ? true : false)}
              required
            >
              <option value="">Selectează exercițiu</option>
              {allExercises.map(exercise => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name} ({exercise.category})
                </option>
              ))}
            </select>
            {loadingExercises && <div className="loading-indicator">Se încarcă exercițiile...</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="order">Ordinea în Antrenament</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={1}
              max={20}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sets">Număr de Seturi</label>
            <input
              type="number"
              id="sets"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              min={1}
              max={10}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reps">Repetări</label>
            <input
              type="number"
              id="reps"
              name="reps"
              value={formData.reps}
              onChange={handleChange}
              min={0}
              max={100}
              placeholder="Număr de repetări"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Durată</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 30 sec, 1 min"
            />
            <small>Completează acest câmp SAU repetări (nu ambele)</small>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Greutate (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min={0}
              step={0.5}
              placeholder="Greutate recomandată (opțional)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="restSeconds">Pauză între Seturi (secunde)</label>
            <input
              type="number"
              id="restSeconds"
              name="restSeconds"
              value={formData.restSeconds}
              onChange={handleChange}
              min={0}
              max={300}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="technique">Tehnică Specială</label>
            <input
              type="text"
              id="technique"
              name="technique"
              value={formData.technique}
              onChange={handleChange}
              placeholder="Ex: drop set, superset, circuit"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Note</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Note sau instrucțiuni specifice pentru acest exercițiu"
            rows={3}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Anulează
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se salvează...' : 'Salvează'}
          </button>
        </div>
      </form>
    </div>
  );
};

ExerciseWorkoutForm.propTypes = {
  exerciseWorkout: PropTypes.object,
  workoutDay: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default ExerciseWorkoutForm;