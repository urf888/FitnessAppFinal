import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';

const ProfileView = ({ profile, onEdit }) => {
  const navigate = useNavigate();

  if (!profile) {
    return <div className="no-profile">Nu există un profil definit.</div>;
  }

  // Funcție pentru a traduce nivelul de activitate în română
  const translateActivityLevel = (level) => {
    const translations = {
      'sedentary': 'Sedentar (activitate minimă)',
      'light': 'Ușor (exerciții 1-3 zile/săptămână)',
      'moderate': 'Moderat (exerciții 3-5 zile/săptămână)',
      'active': 'Activ (exerciții 6-7 zile/săptămână)',
      'very active': 'Foarte activ (exerciții intense zilnic)'
    };

    return translations[level] || level;
  };

  // Calculare IMC
  const heightInMeters = profile.height / 100;
  const bmi = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  // Determinare categorie IMC
  const getBMICategory = (bmi) => {
    const numericBMI = parseFloat(bmi);
    
    if (numericBMI < 18.5) return "Subponderal";
    if (numericBMI < 25) return "Greutate normală";
    if (numericBMI < 30) return "Supraponderal";
    if (numericBMI < 35) return "Obezitate gradul I";
    if (numericBMI < 40) return "Obezitate gradul II";
    return "Obezitate gradul III";
  };

  return (
    <div className="profile-view-container">
      <div className="profile-view-header">
        <h2>Informații Personale</h2>
        <button onClick={onEdit} className="edit-profile-button">
          <i className="edit-icon"></i>
          Editează Profilul
        </button>
      </div>

      <div className="profile-view-content">
        <div className="profile-view-section">
          <div className="profile-metrics">
            <div className="metric-card">
              <span className="metric-label">Vârstă</span>
              <span className="metric-value">{profile.age} ani</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Sex</span>
              <span className="metric-value">{profile.sex}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Greutate</span>
              <span className="metric-value">{profile.weight} kg</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Înălțime</span>
              <span className="metric-value">{profile.height} cm</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">IMC</span>
              <span className="metric-value">
                {bmi}
              </span>
              <span className="bmi-category">{getBMICategory(bmi)}</span>
            </div>
          </div>
        </div>

        <div className="profile-view-section">
          <h3>Preferințe Fitness</h3>
          <div className="profile-details">
            <div className="detail-group">
              <span className="detail-label">Obiectiv:</span>
              <span className="detail-value">{profile.objective}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Nivel de Activitate:</span>
              <span className="detail-value">{translateActivityLevel(profile.activityLevel)}</span>
            </div>
          </div>
        </div>

        {profile.allergiesRestrictions && (
          <div className="profile-view-section">
            <h3>Alergii și Restricții Alimentare</h3>
            <p className="allergies-text">{profile.allergiesRestrictions}</p>
          </div>
        )}

        <div className="profile-view-section analysis-section">
          <h3>Analiză și Recomandări</h3>
          <p className="analysis-description">
            Vrei să vezi cum să îți atingi obiectivele mai eficient? Obține o analiză personalizată cu recomandări 
            de nutriție și previziuni ale progresului tău.
          </p>
          <button 
            className="view-analysis-button"
            onClick={() => navigate('/analysis')}
          >
            Vezi Analiza Personalizată
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;