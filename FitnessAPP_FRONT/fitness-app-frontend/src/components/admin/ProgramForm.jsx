/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './ProgramForm.css';

const ProgramForm = ({ program, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    programType: '',
    gender: '',
    diet: '',
    description: '',
    imageUrl: '',
    difficultyLevel: 'intermediar',
    durationWeeks: 8,
    workoutsPerWeek: 4,
    ageRangeMin: '',
    ageRangeMax: '',
    goals: '',
    requiredEquipment: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (program) {
      // Dacă programul are câmpuri avansate completate, afișăm automat secțiunea avansată
      const hasAdvancedFields = !!(
        program.goals || 
        program.requiredEquipment || 
        program.ageRangeMin || 
        program.ageRangeMax
      );
      
      setShowAdvanced(hasAdvancedFields);
      
      setFormData({
        name: program.name || '',
        programType: program.programType || '',
        gender: program.gender || '',
        diet: program.diet || '',
        description: program.description || '',
        imageUrl: program.imageUrl || '',
        difficultyLevel: program.difficultyLevel || 'intermediar',
        durationWeeks: program.durationWeeks || 8,
        workoutsPerWeek: program.workoutsPerWeek || 4,
        ageRangeMin: program.ageRangeMin || '',
        ageRangeMax: program.ageRangeMax || '',
        goals: program.goals || '',
        requiredEquipment: program.requiredEquipment || ''
      });
    }
  }, [program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Conversie pentru câmpuri numerice
    if (['durationWeeks', 'workoutsPerWeek', 'ageRangeMin', 'ageRangeMax'].includes(name)) {
      setFormData(prevData => ({
        ...prevData,
        [name]: value === '' ? '' : parseInt(value)
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validare
    if (!formData.name || !formData.programType || !formData.gender || !formData.diet) {
      alert('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }
    
    // Validare pentru intervalul de vârstă
    if (formData.ageRangeMin && formData.ageRangeMax && formData.ageRangeMin > formData.ageRangeMax) {
      alert('Vârsta minimă nu poate fi mai mare decât vârsta maximă!');
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
  
  // Funcție pentru a afișa un tooltip de ajutor
  const HelpTooltip = ({ text }) => (
    <span className="help-tooltip">
      <span className="help-icon">?</span>
      <span className="tooltip-text">{text}</span>
    </span>
  );

  return (
    <div className="program-form-container">
      <h2>{isEditMode ? 'Editare Program' : 'Adăugare Program Nou'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">Informații de bază</h3>
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
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficultyLevel">Nivel de dificultate</label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
              >
                <option value="începător">Începător</option>
                <option value="intermediar">Intermediar</option>
                <option value="avansat">Avansat</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="durationWeeks">Durată (săptămâni)</label>
              <input
                type="number"
                id="durationWeeks"
                name="durationWeeks"
                value={formData.durationWeeks}
                onChange={handleChange}
                min={1}
                max={52}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="workoutsPerWeek">Antrenamente pe săptămână</label>
              <input
                type="number"
                id="workoutsPerWeek"
                name="workoutsPerWeek"
                value={formData.workoutsPerWeek}
                onChange={handleChange}
                min={1}
                max={7}
              />
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
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="form-section-title">Informații suplimentare</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ageRangeMin">
                Vârstă minimă recomandată
                <HelpTooltip text="Vârsta minimă recomandată pentru acest program. Lăsați gol dacă nu există restricții." />
              </label>
              <input
                type="number"
                id="ageRangeMin"
                name="ageRangeMin"
                value={formData.ageRangeMin}
                onChange={handleChange}
                min={15}
                max={120}
                placeholder="Ex: 18"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ageRangeMax">
                Vârstă maximă recomandată
                <HelpTooltip text="Vârsta maximă recomandată pentru acest program. Lăsați gol dacă nu există restricții." />
              </label>
              <input
                type="number"
                id="ageRangeMax"
                name="ageRangeMax"
                value={formData.ageRangeMax}
                onChange={handleChange}
                min={15}
                max={120}
                placeholder="Ex: 60"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="goals">
              Obiective
              <HelpTooltip text="Descrieți care sunt obiectivele specifice ale acestui program." />
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Obiectivele specifice ale programului (ex: pierdere în greutate, creșterea masei musculare, tonifiere...)"
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="requiredEquipment">
              Echipament necesar
              <HelpTooltip text="Specificați echipamentul necesar pentru efectuarea acestui program." />
            </label>
            <textarea
              id="requiredEquipment"
              name="requiredEquipment"
              value={formData.requiredEquipment}
              onChange={handleChange}
              placeholder="Echipamentul necesar pentru acest program (ex: gantere, benzi elastice, bare de tracțiuni...)"
              rows="2"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="form-section-title">Imagine</h3>
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