import React from 'react';
import './ProfileView.css';
import WeightGoalProgress from './WeightGoalProgress'; // Import componenta pentru progresul obiectivului

const ProfileView = ({ profile, onEdit }) => {
  if (!profile) return null;

  // Formatare pentru diferite informații din profil
  const formatSex = (sex) => {
    return sex === 'masculin' ? 'Masculin' : 'Feminin';
  };

  const formatActivityLevel = (level) => {
    const activityLevels = {
      'sedentary': 'Sedentar (activitate minimă)',
      'light': 'Ușor (exerciții 1-3 zile/săptămână)',
      'moderate': 'Moderat (exerciții 3-5 zile/săptămână)',
      'active': 'Activ (exerciții 6-7 zile/săptămână)',
      'very active': 'Foarte activ (exerciții intense zilnic)'
    };
    return activityLevels[level] || level;
  };

  // Formatează experiența
  const formatExperience = (experience) => {
    if (!experience) return 'Nespecificat';
    
    const experienceMap = {
      'beginner': 'Începător',
      'intermediate': 'Intermediar',
      'advanced': 'Avansat',
      'professional': 'Profesionist'
    };
    return experienceMap[experience] || experience;
  };

  // Formatează dieta
  const formatDiet = (diet) => {
    if (!diet) return 'Nespecificat';
    
    const dietMap = {
      'omnivore': 'Omnivoră',
      'vegetarian': 'Vegetariană',
      'vegan': 'Vegană',
      'carnivore': 'Carnivoră',
      'pescatarian': 'Pescatariană',
      'keto': 'Keto',
      'paleo': 'Paleo'
    };
    return dietMap[diet] || diet;
  };

  // Calculează BMI
  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Interpretează categoria BMI
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Subponderal', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Supraponderal', color: '#f39c12' };
    return { category: 'Obezitate', color: '#e74c3c' };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="profile-view">
      <div className="profile-view-header">
        <h2>Informații Profil</h2>
        <button onClick={onEdit} className="edit-profile-button">
          Editează Profilul
        </button>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>Date Personale</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="info-label">Vârstă</span>
              <span className="info-value">{profile.age} ani</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Sex</span>
              <span className="info-value">{formatSex(profile.sex)}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Greutate</span>
              <span className="info-value">{profile.weight} kg</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Înălțime</span>
              <span className="info-value">{profile.height} cm</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Indicatori de Sănătate</h3>
          <div className="bmi-container">
            <div className="bmi-value">
              <span className="bmi-number">{bmi}</span>
              <span className="bmi-unit">kg/m²</span>
            </div>
            <div className="bmi-category" style={{ backgroundColor: bmiCategory.color }}>
              {bmiCategory.category}
            </div>
            <div className="bmi-label">Indice de Masă Corporală (BMI)</div>
          </div>
        </div>

        {/* Adaugă componenta pentru obiectivul de greutate */}
        {profile.weightGoal && (
          <WeightGoalProgress 
            currentWeight={profile.weight} 
            goalWeight={profile.weightGoal} 
          />
        )}

        <div className="profile-section">
          <h3>Preferințe Fitness</h3>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="info-label">Nivel de Activitate</span>
              <span className="info-value">{formatActivityLevel(profile.activityLevel)}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Obiectiv</span>
              <span className="info-value">{profile.objective}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Experiență Fitness</span>
              <span className="info-value">{formatExperience(profile.experience)}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Dietă</span>
              <span className="info-value">{formatDiet(profile.diet)}</span>
            </div>
          </div>
        </div>

        {profile.allergiesRestrictions && (
          <div className="profile-section">
            <h3>Restricții Alimentare</h3>
            <div className="allergy-info">
              <p>{profile.allergiesRestrictions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;