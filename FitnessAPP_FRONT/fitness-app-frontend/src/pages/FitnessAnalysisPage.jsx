/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../api/profileService';
import Navbar from '../components/layout/Navbar';
import GoalForecast from '../components/analysis/GoalForecast';
import './FitnessAnalysisPage.css';

import {
  // Alte importuri
  FiTarget,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';

const AnalysisPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    bmi: 0,
    bmr: 0,
    tdee: 0,
    bodyFatPercentage: 0,
    idealWeight: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        
        if (profileData) {
          calculateStats(profileData);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Nu există profil pentru utilizator
          setError('Nu ai încă un profil. Creează-ți profilul pentru a vedea analiza personalizată.');
        } else {
          setError('Eroare la încărcarea profilului. Încearcă din nou mai târziu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateStats = (profileData) => {
    // Calculare BMI
    const heightInMeters = profileData.height / 100;
    const bmi = profileData.weight / (heightInMeters * heightInMeters);
    
    // Calculare BMR (Basal Metabolic Rate) folosind formula Harris-Benedict
    let bmr;
    if (profileData.sex === 'masculin') {
      bmr = 88.362 + (13.397 * profileData.weight) + (4.799 * profileData.height) - (5.677 * profileData.age);
    } else {
      bmr = 447.593 + (9.247 * profileData.weight) + (3.098 * profileData.height) - (4.330 * profileData.age);
    }
    
    // Calculare TDEE (Total Daily Energy Expenditure)
    const activityFactors = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very active': 1.9
    };
    const activityFactor = activityFactors[profileData.activityLevel] || 1.2;
    const tdee = bmr * activityFactor;
    
    // Estimare procent de grăsime corporală
    // Notă: Aceasta este o estimare brută bazată doar pe BMI
    let bodyFatPercentage;
    if (profileData.sex === 'masculin') {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * profileData.age) - 16.2;
    } else {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * profileData.age) - 5.4;
    }
    
    // Calculare greutate ideală folosind formula Hamwi
    let idealWeight;
    if (profileData.sex === 'masculin') {
      idealWeight = 48 + 2.7 * (profileData.height - 152.4) / 2.54;
    } else {
      idealWeight = 45.5 + 2.2 * (profileData.height - 152.4) / 2.54;
    }
    
    setStats({
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bodyFatPercentage: Math.max(3, Math.min(bodyFatPercentage, 45)).toFixed(1),
      idealWeight: idealWeight.toFixed(1)
    });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Subponderal', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Supraponderal', color: '#f39c12' };
    return { category: 'Obezitate', color: '#e74c3c' };
  };

  const bmiCategory = getBMICategory(stats.bmi);

  return (
    <div className="analysis-page">
      <Navbar />
      <div className="analysis-content">
        <h1>Analiză și Statistici</h1>
        
        {loading ? (
          <div className="loading">Se încarcă datele...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="stats-card-container">
              <div className="stats-card">
                <div className="stats-card-icon">
                  <i className="bmi-icon"></i>
                </div>
                <div className="stats-card-content">
                  <h3>Indice de Masă Corporală (BMI)</h3>
                  <div className="stats-card-metrics">
                    <div className="stats-card-value">{stats.bmi}</div>
                    <div 
                      className="stats-card-status" 
                      style={{ backgroundColor: bmiCategory.color }}
                    >
                      {bmiCategory.category}
                    </div>
                  </div>
                  <div className="stats-card-description">
                    <p>IMC oferă o estimare a grăsimii corporale bazată pe înălțimea și greutatea ta.</p>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-icon">
                  <i className="calories-icon"></i>
                </div>
                <div className="stats-card-content">
                  <h3>Necesar Caloric</h3>
                  <div className="stats-card-metrics">
                    <div className="stats-card-value">{stats.tdee}</div>
                    <div className="stats-card-unit">kcal/zi</div>
                  </div>
                  <div className="stats-card-description">
                    <p>Consumul zilnic de calorii necesar pentru menținerea greutății tale curente.</p>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-icon">
                  <i className="body-fat-icon"></i>
                </div>
                <div className="stats-card-content">
                  <h3>Procent Estimat de Grăsime</h3>
                  <div className="stats-card-metrics">
                    <div className="stats-card-value">{stats.bodyFatPercentage}</div>
                    <div className="stats-card-unit">%</div>
                  </div>
                  <div className="stats-card-description">
                    <p>O estimare a procentului de grăsime corporală bazată pe profilul tău.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secțiunea nouă pentru prognoză */}
            <GoalForecast profile={profile} />

            <div className="advanced-metrics">
              <h2>Metrici Avansate</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon"><FiActivity /></div>
                  <div className="metric-name">Metabolism Bazal (BMR)</div>
                  <div className="metric-value">{stats.bmr} kcal/zi</div>
                  <div className="metric-description">
                    Cantitatea de calorii pe care corpul tău le arde în repaus complet.
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon"><FiTarget /></div>
                  <div className="metric-name">Greutate Ideală Estimată</div>
                  <div className="metric-value">{stats.idealWeight} kg</div>
                  <div className="metric-description">
                    O estimare a greutății ideale bazată pe înălțimea și genul tău.
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon"><FiCalendar /></div>
                  <div className="metric-name">Raport Talie-Înălțime</div>
                  <div className="metric-value">Nu este disponibil</div>
                  <div className="metric-description">
                    Un indicator important al riscului pentru sănătate bazat pe distribuția grăsimii.
                  </div>
                </div>
              </div>
            </div>

            <div className="disclaimers">
              <p>
                <strong>Notă:</strong> Toate calculele sunt bazate pe formule standard și oferă doar estimări. 
                Factorii individuali precum compoziția corporală, genetica și starea de sănătate pot influența 
                valorile reale. Pentru rezultate mai precise, consultă un specialist.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;