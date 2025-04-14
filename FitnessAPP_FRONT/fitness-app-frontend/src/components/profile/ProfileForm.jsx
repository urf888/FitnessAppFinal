import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileForm.css';

const ProfileForm = ({ profile, onSave, isLoading, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    sex: '',
    activityLevel: '',
    objective: '',
    allergiesRestrictions: '',
    weightGoal: '',
    diet: '', // Câmp nou pentru dietă
    experience: '' // Câmp nou pentru experiență
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || '',
        sex: profile.sex || '',
        activityLevel: profile.activityLevel || '',
        objective: profile.objective || '',
        allergiesRestrictions: profile.allergiesRestrictions || '',
        weightGoal: profile.weightGoal || '',
        diet: profile.diet || '', // Inițializează cu valoarea din profil
        experience: profile.experience || '' // Inițializează cu valoarea din profil
      });
    }
  }, [profile]);

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
    if (!formData.age || !formData.weight || !formData.height || !formData.sex) {
      alert('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }
    
    // Convertim valorile numerice în numere
    const profileData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      weightGoal: formData.weightGoal ? parseFloat(formData.weightGoal) : null,
      userId: currentUser.id
    };
    
    // Dacă există un profil, includem ID-ul acestuia pentru actualizare
    if (profile) {
      profileData.id = profile.id;
    }
    
    onSave(profileData);
  };

  return (
    <div className="profile-form-container">
      <h2>{profile ? 'Actualizează Profilul' : 'Creează Profil'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Vârstă <span className="required">*</span></label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="12"
              max="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sex">Sex <span className="required">*</span></label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Selectează</option>
              <option value="masculin">Masculin</option>
              <option value="feminin">Feminin</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Greutate actuală (kg) <span className="required">*</span></label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="30"
              max="300"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weightGoal">Greutate dorită (kg)</label>
            <input
              type="number"
              id="weightGoal"
              name="weightGoal"
              value={formData.weightGoal}
              onChange={handleChange}
              min="30"
              max="300"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="height">Înălțime (cm) <span className="required">*</span></label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="100"
            max="250"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="diet">Dietă</label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
            >
              <option value="">Selectează</option>
              <option value="omnivore">Omnivoră</option>
              <option value="vegetarian">Vegetariană</option>
              <option value="vegan">Vegană</option>
              <option value="carnivore">Carnivoră</option>
              <option value="pescatarian">Pescatariană</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Experiență în fitness</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            >
              <option value="">Selectează</option>
              <option value="beginner">Începător</option>
              <option value="intermediate">Intermediar</option>
              <option value="advanced">Avansat</option>
              <option value="professional">Profesionist</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="activityLevel">Nivel de Activitate <span className="required">*</span></label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="">Selectează</option>
            <option value="sedentary">Sedentar (activitate minimă)</option>
            <option value="light">Ușor (exerciții 1-3 zile/săptămână)</option>
            <option value="moderate">Moderat (exerciții 3-5 zile/săptămână)</option>
            <option value="active">Activ (exerciții 6-7 zile/săptămână)</option>
            <option value="very active">Foarte activ (exerciții intense zilnic)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="objective">Obiectiv <span className="required">*</span></label>
          <select
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            required
          >
            <option value="">Selectează</option>
            <option value="slăbit">Slăbit</option>
            <option value="masă musculară">Creștere masă musculară</option>
            <option value="fitness general">Fitness general</option>
            <option value="menținere">Menținere</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="allergiesRestrictions">Alergii sau Restricții Alimentare</label>
          <textarea
            id="allergiesRestrictions"
            name="allergiesRestrictions"
            value={formData.allergiesRestrictions}
            onChange={handleChange}
            placeholder="Introduceți orice alergii sau restricții alimentare de care ar trebui să ținem cont."
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Anulează
            </button>
          )}
          
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? 'Se salvează...' : (profile ? 'Actualizează' : 'Salvează')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;