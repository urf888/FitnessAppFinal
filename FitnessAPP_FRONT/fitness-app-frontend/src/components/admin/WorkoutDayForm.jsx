import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './WorkoutDayForm.css';

const WorkoutDayForm = ({ workoutDay, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    dayOfWeek: 1,
    durationMinutes: 60,
    notes: ''
  });

  useEffect(() => {
    if (workoutDay) {
      setFormData({
        name: workoutDay.name || '',
        dayOfWeek: workoutDay.dayOfWeek || 1,
        durationMinutes: workoutDay.durationMinutes || 60,
        notes: workoutDay.notes || ''
      });
    }
  }, [workoutDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dayOfWeek' || name === 'durationMinutes' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Te rugăm să introduci numele zilei de antrenament.');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="workout-day-form">
      <h3>{workoutDay ? 'Editează Ziua de Antrenament' : 'Adaugă Zi de Antrenament Nouă'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nume <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Ziua 1 - Piept și Triceps"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dayOfWeek">Ziua Săptămânii</label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              required
            >
              <option value={1}>Luni</option>
              <option value={2}>Marți</option>
              <option value={3}>Miercuri</option>
              <option value={4}>Joi</option>
              <option value={5}>Vineri</option>
              <option value={6}>Sâmbătă</option>
              <option value={7}>Duminică</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="durationMinutes">Durată (minute)</label>
            <input
              type="number"
              id="durationMinutes"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              min={10}
              max={180}
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
            placeholder="Instrucțiuni sau note suplimentare pentru această zi de antrenament"
            rows={4}
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

WorkoutDayForm.propTypes = {
  workoutDay: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default WorkoutDayForm;