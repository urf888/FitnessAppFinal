/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../api/profileService';
import Navbar from '../components/layout/Navbar';
import MacronutrientChart from '../components/analysis/MacronutrientChart';
import ProgressPredictionChart from '../components/analysis/ProgressPredictionChart';
import './FitnessAnalysisPage.css';

const FitnessAnalysisPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProfile(null);
        } else {
          setError('Eroare la încărcarea profilului. Încearcă din nou mai târziu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      // Generarea analizei personalizate când profilul este disponibil
      const calculatedAnalysis = calculateFitnessAnalysis(profile);
      setAnalysis(calculatedAnalysis);
    }
  }, [profile]);

  // Funcție pentru calcularea analizei fitness
  const calculateFitnessAnalysis = (profileData) => {
    // 1. Calculul ratei metabolice bazale (RMB) folosind formula Harris-Benedict
    let bmr = 0;
    if (profileData.sex === 'masculin') {
      bmr = 88.362 + (13.397 * profileData.weight) + (4.799 * profileData.height) - (5.677 * profileData.age);
    } else {
      bmr = 447.593 + (9.247 * profileData.weight) + (3.098 * profileData.height) - (4.330 * profileData.age);
    }

    // 2. Aplicarea factorului de activitate
    let activityFactor = 1.2; // Sedentar (implicit)
    switch (profileData.activityLevel) {
      case 'sedentary':
        activityFactor = 1.2;
        break;
      case 'light':
        activityFactor = 1.375;
        break;
      case 'moderate':
        activityFactor = 1.55;
        break;
      case 'active':
        activityFactor = 1.725;
        break;
      case 'very active':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const tdee = Math.round(bmr * activityFactor); // Total Daily Energy Expenditure

    // 3. Ajustarea în funcție de obiectiv
    let calorieAdjustment = 0;
    let weeklyWeightChange = 0;
    let objectiveDescription = '';
    
    switch (profileData.objective.toLowerCase()) {
      case 'slăbit':
        calorieAdjustment = -500; // Deficit caloric pentru slăbit
        weeklyWeightChange = -0.5; // Kg pe săptămână
        objectiveDescription = 'Reducere în greutate';
        break;
      case 'masă musculară':
        calorieAdjustment = 300; // Surplus caloric pentru masă musculară
        weeklyWeightChange = 0.25; // Kg pe săptămână
        objectiveDescription = 'Creștere în greutate (masă musculară)';
        break;
      case 'fitness general':
        calorieAdjustment = 0; // Menținere cu accent pe fitness
        weeklyWeightChange = 0;
        objectiveDescription = 'Menținere cu îmbunătățirea compoziției corporale';
        break;
      case 'menținere':
        calorieAdjustment = 0; // Menținere simplă
        weeklyWeightChange = 0;
        objectiveDescription = 'Menținerea greutății actuale';
        break;
      default:
        calorieAdjustment = 0;
        weeklyWeightChange = 0;
        objectiveDescription = 'Obiectiv personalizat';
    }

    const recommendedCalories = tdee + calorieAdjustment;

    // 4. Calculul distribuției macronutrienților
    let proteinPercentage = 0;
    let carbsPercentage = 0;
    let fatPercentage = 0;

    switch (profileData.objective.toLowerCase()) {
      case 'slăbit':
        proteinPercentage = 40; // Proteină ridicată pentru menținerea masei musculare
        carbsPercentage = 30;
        fatPercentage = 30;
        break;
      case 'masă musculară':
        proteinPercentage = 30;
        carbsPercentage = 50; // Carbohidrați ridicați pentru energie și recuperare
        fatPercentage = 20;
        break;
      case 'fitness general':
        proteinPercentage = 30;
        carbsPercentage = 40;
        fatPercentage = 30;
        break;
      case 'menținere':
        proteinPercentage = 25;
        carbsPercentage = 45;
        fatPercentage = 30;
        break;
      default:
        proteinPercentage = 30;
        carbsPercentage = 40;
        fatPercentage = 30;
    }

    // Conversia în grame
    const proteinGrams = Math.round((recommendedCalories * (proteinPercentage / 100)) / 4); // 4 calorii per gram de proteină
    const carbsGrams = Math.round((recommendedCalories * (carbsPercentage / 100)) / 4); // 4 calorii per gram de carbohidrați
    const fatGrams = Math.round((recommendedCalories * (fatPercentage / 100)) / 9); // 9 calorii per gram de grăsime

    // 5. Pregătirea datelor pentru predicția progresului
    const weeksToPredict = 12; // Predicție pe 12 săptămâni
    const weeklyPredictions = [];
    let currentWeight = profileData.weight;
    
    for (let week = 0; week <= weeksToPredict; week++) {
      weeklyPredictions.push({
        week: week,
        weight: parseFloat((currentWeight + (weeklyWeightChange * week)).toFixed(1))
      });
    }

    // Calculul IMC actual și prognozat
    const heightInMeters = profileData.height / 100;
    const currentBMI = (profileData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    const predictedBMI = (weeklyPredictions[weeksToPredict].weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Returnarea analizei complete
    return {
      bmr,
      tdee,
      recommendedCalories,
      macronutrients: {
        protein: {
          percentage: proteinPercentage,
          grams: proteinGrams
        },
        carbs: {
          percentage: carbsPercentage,
          grams: carbsGrams
        },
        fat: {
          percentage: fatPercentage,
          grams: fatGrams
        }
      },
      objective: {
        description: objectiveDescription,
        calorieAdjustment,
        weeklyWeightChange
      },
      predictions: {
        startWeight: profileData.weight,
        predictedEndWeight: weeklyPredictions[weeksToPredict].weight,
        weeklyData: weeklyPredictions,
        currentBMI,
        predictedBMI
      }
    };
  };

  return (
    <div className="fitness-analysis-page">
      <Navbar />
      <div className="analysis-content">
        <div className="analysis-header">
          <h1>Analiză Personalizată</h1>
          <p className="analysis-subtitle">
            Analiză bazată pe datele tale personale și obiectivele fitness
          </p>
        </div>

        {loading ? (
          <div className="loading">Se încarcă datele de analiză...</div>
        ) : !profile ? (
          <div className="no-profile-warning">
            <h3>Profil incomplet</h3>
            <p>Pentru a primi o analiză personalizată, te rugăm să completezi mai întâi profilul tău.</p>
            <button 
              className="create-profile-button"
              onClick={() => window.location.href = '/profile'}
            >
              Completează Profilul
            </button>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : analysis ? (
          <div className="analysis-container">
            <div className="analysis-card">
              <h2>Necesarul tău caloric</h2>
              <div className="calorie-metrics">
                <div className="metric-item">
                  <span className="metric-label">Metabolism bazal (RMB)</span>
                  <span className="metric-value">{analysis.bmr} calorii</span>
                  <span className="metric-description">Caloriile necesare pentru funcțiile vitale în repaus</span>
                </div>
                
                <div className="metric-item">
                  <span className="metric-label">Consum energetic total (TDEE)</span>
                  <span className="metric-value">{analysis.tdee} calorii</span>
                  <span className="metric-description">Caloriile consumate zilnic inclusiv activitate fizică</span>
                </div>
                
                <div className="metric-item highlight">
                  <span className="metric-label">Calorii recomandate pentru {analysis.objective.description}</span>
                  <span className="metric-value">{analysis.recommendedCalories} calorii</span>
                  <span className="metric-description">
                    {analysis.objective.calorieAdjustment > 0 
                      ? `Surplus de ${Math.abs(analysis.objective.calorieAdjustment)} calorii`
                      : analysis.objective.calorieAdjustment < 0 
                        ? `Deficit de ${Math.abs(analysis.objective.calorieAdjustment)} calorii`
                        : 'Echilibru caloric (menținere)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="analysis-row">
              <div className="analysis-card">
                <h2>Distribuția recomandată de macronutrienți</h2>
                <div className="macros-container">
                  <MacronutrientChart macros={analysis.macronutrients} />
                  <div className="macros-details">
                    <div className="macro-item protein">
                      <div className="macro-header">
                        <div className="macro-color-indicator"></div>
                        <h3>Proteine</h3>
                      </div>
                      <div className="macro-values">
                        <span className="macro-value">{analysis.macronutrients.protein.grams}g</span>
                        <span className="macro-percentage">{analysis.macronutrients.protein.percentage}%</span>
                      </div>
                      <p className="macro-description">
                        Esențiale pentru recuperare musculară și sațietate
                      </p>
                    </div>
                    
                    <div className="macro-item carbs">
                      <div className="macro-header">
                        <div className="macro-color-indicator"></div>
                        <h3>Carbohidrați</h3>
                      </div>
                      <div className="macro-values">
                        <span className="macro-value">{analysis.macronutrients.carbs.grams}g</span>
                        <span className="macro-percentage">{analysis.macronutrients.carbs.percentage}%</span>
                      </div>
                      <p className="macro-description">
                        Sursa principală de energie pentru corpul tău
                      </p>
                    </div>
                    
                    <div className="macro-item fat">
                      <div className="macro-header">
                        <div className="macro-color-indicator"></div>
                        <h3>Grăsimi</h3>
                      </div>
                      <div className="macro-values">
                        <span className="macro-value">{analysis.macronutrients.fat.grams}g</span>
                        <span className="macro-percentage">{analysis.macronutrients.fat.percentage}%</span>
                      </div>
                      <p className="macro-description">
                        Importante pentru hormoni și absorbția vitaminelor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-card">
              <h2>Prognoză progres în 12 săptămâni</h2>
              <div className="progress-header">
                <div className="progress-metric">
                  <span className="metric-label">Greutate inițială</span>
                  <span className="metric-value">{analysis.predictions.startWeight} kg</span>
                </div>
                <div className="progress-metric">
                  <span className="metric-label">Schimbare săptămânală estimată</span>
                  <span className="metric-value">{analysis.objective.weeklyWeightChange > 0 ? '+' : ''}{analysis.objective.weeklyWeightChange} kg</span>
                </div>
                <div className="progress-metric">
                  <span className="metric-label">Greutate estimată în 12 săptămâni</span>
                  <span className="metric-value">{analysis.predictions.predictedEndWeight} kg</span>
                </div>
              </div>
              <div className="progress-chart">
                <ProgressPredictionChart predictions={analysis.predictions.weeklyData} />
              </div>
              <div className="bmi-comparison">
                <div className="bmi-item">
                  <span className="bmi-label">IMC actual</span>
                  <span className="bmi-value">{analysis.predictions.currentBMI}</span>
                  <span className="bmi-category">{getBMICategory(analysis.predictions.currentBMI)}</span>
                </div>
                <div className="bmi-arrow">→</div>
                <div className="bmi-item">
                  <span className="bmi-label">IMC estimat</span>
                  <span className="bmi-value">{analysis.predictions.predictedBMI}</span>
                  <span className="bmi-category">{getBMICategory(analysis.predictions.predictedBMI)}</span>
                </div>
              </div>
            </div>

            <div className="analysis-disclaimer">
              <h3>Notă importantă</h3>
              <p>
                Această analiză este generată pe baza algoritmilor și formulelor standard din domeniul nutriției și fitness-ului.
                Rezultatele sunt estimări și pot varia în funcție de factorii individuali precum metabolismul, genetica și 
                comportamentul alimentar. Consultă întotdeauna un specialist înainte de a face schimbări majore în dieta sau 
                rutina ta de exerciții.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Funcție pentru determinarea categoriei IMC
const getBMICategory = (bmi) => {
  const numericBMI = parseFloat(bmi);
  
  if (numericBMI < 18.5) return "Subponderal";
  if (numericBMI < 25) return "Greutate normală";
  if (numericBMI < 30) return "Supraponderal";
  if (numericBMI < 35) return "Obezitate gradul I";
  if (numericBMI < 40) return "Obezitate gradul II";
  return "Obezitate gradul III";
};

export default FitnessAnalysisPage;