import React, { useState, useEffect } from 'react';
import './ProgramForm.css';

const ProgramForm = ({ program, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    programType: '',
    gender: '',
    diet: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name || '',
        programType: program.programType || '',
        gender: program.gender || '',
        diet: program.diet || '',
        description: program.description || '',
        imageUrl: program.imageUrl || ''
      });
    }
  }, [program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validare
    if (!formData.name || !formData.programType || !formData.gender || !formData.diet) {
      alert('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }
    
    // Creem obiectul program cu sau fără ID în funcție de acțiunea de adăugare sau editare
    const programData = {
      ...formData
    };
    
    if (program && program.id) {
      programData.id = program.id;
    }
    
    onSave(programData);
  };

  const isEditMode = !!program;

  return (
    <div className="program-form-container">
      <h2>{isEditMode ? 'Editare Program' : 'Adăugare Program Nou'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nume Program <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Introdu numele programului"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="programType">Tip Program <span className="required">*</span></label>
            <select
              id="programType"
              name="programType"
              value={formData.programType}
              onChange={handleChange}
              required
            >
              <option value="">Selectează tipul</option>
              <option value="slabit">Slăbit</option>
              <option value="fit">Fitness</option>
              <option value="masa">Masă Musculară</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gen <span className="required">*</span></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Selectează genul</option>
              <option value="femeie">Femei</option>
              <option value="barbat">Bărbați</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="diet">Dietă <span className="required">*</span></label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              required
            >
              <option value="">Selectează dieta</option>
              <option value="carnivor">Carnivor</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="omnivore">Omnivore</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descriere</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descriere detaliată a programului..."
            rows="5"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">URL Imagine</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="URL către imaginea programului"
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            Anulează
          </button>
          
          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se salvează...' : (isEditMode ? 'Salvează Modificările' : 'Adaugă Program')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;