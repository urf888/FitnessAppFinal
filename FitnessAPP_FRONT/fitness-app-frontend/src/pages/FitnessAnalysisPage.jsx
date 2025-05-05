/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../api/profileService';
import Navbar from '../components/layout/Navbar';
import GoalForecast from '../components/analysis/GoalForecast';
// Import componente personalizate
import './FitnessAnalysisPage.css'; // Asigură-te că ai acest import pentru stilurile CSS
import SmartCalorieRecommendation from '../components/analysis/SmartCalorieRecommendation';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const FitnessAnalysisPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
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
        setLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
        
        if (profileData) {
          calculateStats(profileData);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
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
    const activityFactor = activityFactors[profileData.activityLevel.toLowerCase()] || 1.2;
    const tdee = bmr * activityFactor;
    
    // Estimare procent de grăsime corporală
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
  
  const toggleAIRecommendation = () => {
    setShowAIRecommendation(!showAIRecommendation);
  };

  return (
    <div className="fitness-analysis-page">
      <Navbar />
      <div className="analysis-content">
        <div className="analysis-header">
          <h1>Analiză Fitness & Nutriție</h1>
          <p className="analysis-subtitle">Statistici personalizate și recomandări pentru atingerea obiectivelor tale</p>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Se încarcă datele personale și analiza...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {/* Secțiunea de profil utilizator */}
            <section className="profile-section">
              <h2>Profilul Tău</h2>
              <div className="profile-card">
                <div className="profile-table">
                  <table>
                    <tbody>
                      <tr>
                        <th>Vârstă</th>
                        <td>{profile.age} ani</td>
                        <th>Sex</th>
                        <td>{profile.sex === 'masculin' ? 'Masculin' : 'Feminin'}</td>
                      </tr>
                      <tr>
                        <th>Înălțime</th>
                        <td>{profile.height} cm</td>
                        <th>Greutate</th>
                        <td>{profile.weight} kg</td>
                      </tr>
                      <tr>
                        <th>Nivel de activitate</th>
                        <td>{profile.activityLevel}</td>
                        <th>Obiectiv greutate</th>
                        <td>{profile.weightGoal} kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Metrici de bază + metricile avansate (toate afișate orizontal) */}
            <section className="metrics-section">
              <h2>Metrici Personalizate</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-title">
                    <h3>IMC (BMI)</h3>
                  </div>
                  <div className="metric-value-container">
                    <span className="metric-value">{stats.bmi}</span>
                    <span className="metric-category" style={{ backgroundColor: bmiCategory.color }}>
                      {bmiCategory.category}
                    </span>
                  </div>
                  <p className="metric-description">
                    Indice de masă corporală - estimează grăsimea corporală
                  </p>
                </div>

                <div className="metric-card">
                  <div className="metric-title">
                    <h3>Necesar Caloric</h3>
                  </div>
                  <div className="metric-value-container">
                    <span className="metric-value">{stats.tdee}</span>
                    <span className="metric-unit">kcal/zi</span>
                  </div>
                  <p className="metric-description">
                    Calorii zilnice pentru menținerea greutății
                  </p>
                </div>

                <div className="metric-card">
                  <div className="metric-title">
                    <h3>Metabolism Bazal</h3>
                  </div>
                  <div className="metric-value-container">
                    <span className="metric-value">{stats.bmr}</span>
                    <span className="metric-unit">kcal/zi</span>
                  </div>
                  <p className="metric-description">
                    Energie necesară în stare de repaus
                  </p>
                </div>

                <div className="metric-card">
                  <div className="metric-title">
                    <h3>Grăsime Corporală</h3>
                  </div>
                  <div className="metric-value-container">
                    <span className="metric-value">{stats.bodyFatPercentage}</span>
                    <span className="metric-unit">%</span>
                  </div>
                  <p className="metric-description">
                    Estimare a procentului de grăsime din corp
                  </p>
                </div>

                <div className="metric-card">
                  <div className="metric-title">
                    <h3>Greutate Ideală</h3>
                  </div>
                  <div className="metric-value-container">
                    <span className="metric-value">{stats.idealWeight}</span>
                    <span className="metric-unit">kg</span>
                  </div>
                  <p className="metric-description">
                    Greutate recomandată pentru înălțimea ta
                  </p>
                </div>
              </div>
            </section>

            {/* Prognoză pentru atingerea obiectivului */}
            <section className="forecast-section">
              <h2>Prognoză pentru Atingerea Obiectivului</h2>
              <div className="forecast-container">
                <ForecastCharts profile={profile} />
                
                <div className="ai-recommendation-section">
                  <div className="ai-button-container">
                    <button 
                      onClick={toggleAIRecommendation} 
                      className="ai-recommendation-button"
                    >
                      {showAIRecommendation ? 'Ascunde Recomandarea AI' : 'Arată Recomandarea AI Avansată'}
                      <span role="img" aria-label="ai">🤖</span>
                    </button>
                  </div>
                  
                  {showAIRecommendation && (
                    <SmartCalorieRecommendation profile={profile} />
                  )}
                </div>
              </div>
            </section>

            <section className="disclaimer-section">
              <p>
                <strong>Notă:</strong> Toate calculele sunt bazate pe formule standard și oferă doar estimări. 
                Factorii individuali precum compoziția corporală, genetica și starea de sănătate pot influența 
                semnificativ valorile reale. Pentru rezultate mai precise, consultă un specialist.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

// Componenta separată pentru charturile de prognoză
const ForecastCharts = ({ profile }) => {
  const isWeightLoss = profile.weight > profile.weightGoal;
  const difference = Math.abs(profile.weight - profile.weightGoal);
  
  // Determinarea ratei recomandate de schimbare a greutății (kg/săptămână)
  let ratePerWeek;
  if (isWeightLoss) {
    const rates = {
      'sedentary': 0.5,
      'light': 0.6,
      'moderate': 0.7,
      'active': 0.8,
      'very active': 1.0
    };
    ratePerWeek = rates[profile.activityLevel] || 0.5;
  } else {
    const rates = {
      'sedentary': 0.2,
      'light': 0.25,
      'moderate': 0.3,
      'active': 0.35,
      'very active': 0.4
    };
    ratePerWeek = rates[profile.activityLevel] || 0.25;
  }
  
  // Calcularea numărului de săptămâni necesar
  const weeksToGoal = Math.ceil(difference / ratePerWeek);
  
  // Calcularea datei țintă
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (weeksToGoal * 7));
  
  // Generarea datelor pentru grafic
  const generateChartData = () => {
    const data = [];
    const weeklyChange = isWeightLoss ? -ratePerWeek : ratePerWeek;
    
    // Afișăm datele săptămânale pentru primele 12 săptămâni sau până la obiectiv
    const weeksToShow = Math.min(weeksToGoal, 12);
    
    for (let i = 0; i <= weeksToShow; i++) {
      const projectedWeight = profile.weight + (weeklyChange * i);
      
      // Ne asigurăm că nu depășim obiectivul
      const weight = isWeightLoss 
        ? Math.max(projectedWeight, profile.weightGoal) 
        : Math.min(projectedWeight, profile.weightGoal);
      
      data.push({
        week: i,
        weight: parseFloat(weight.toFixed(1)),
        label: i === 0 ? 'Acum' : `Săpt. ${i}`
      });
      
      // Dacă am atins obiectivul, ne oprim
      if ((isWeightLoss && weight <= profile.weightGoal) || 
          (!isWeightLoss && weight >= profile.weightGoal)) {
        break;
      }
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  // Calcularea necesarului de calorii
  const calculateCalories = () => {
    // Calcularea BMR folosind ecuația Harris-Benedict
    let bmr;
    if (profile.sex === 'masculin') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }
    
    // Factori de activitate
    const activityFactors = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very active': 1.9
    };
    
    const activityFactor = activityFactors[profile.activityLevel.toLowerCase()] || 1.2;
    
    // TDEE
    const maintenanceCalories = Math.round(bmr * activityFactor);
    
    // Calcularea deficitului/surplusului caloric
    const caloriesPerKg = 7700; // ~7700 calorii per kg
    const dailyCalorieAdjustment = Math.round((ratePerWeek * caloriesPerKg) / 7);
    
    // Calculăm calorii țintă în funcție de obiectiv
    const targetCalories = isWeightLoss 
      ? maintenanceCalories - dailyCalorieAdjustment
      : maintenanceCalories + dailyCalorieAdjustment;
    
    return {
      maintenance: maintenanceCalories,
      target: targetCalories,
      adjustment: dailyCalorieAdjustment
    };
  };
  
  const calories = calculateCalories();
  const objectiveType = isWeightLoss ? 'slăbire' : 'creștere în greutate';
  const rateInGramsPerWeek = (ratePerWeek * 1000).toFixed(0);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('ro-RO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Custom tooltip pentru chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            {label === 0 ? 'Acum' : `Săptămâna ${label}`}
          </p>
          <p className="tooltip-value">
            <strong>Greutate:</strong> {payload[0].value} kg
          </p>
          <p className="tooltip-difference">
            <strong>Diferență:</strong> {(payload[0].value - profile.weight).toFixed(1)} kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="forecast-content">
      <div className="forecast-summary">
        <div className="forecast-metrics">
          <div className="forecast-metric">
            <span className="metric-value">{weeksToGoal}</span>
            <span className="metric-label">săptămâni</span>
          </div>
          <div className="forecast-metric highlight">
            <span className="metric-value">{formatDate(targetDate)}</span>
            <span className="metric-label">data estimată</span>
          </div>
          <div className="forecast-metric">
            <span className="metric-value">{rateInGramsPerWeek}g</span>
            <span className="metric-label">pe săptămână</span>
          </div>
        </div>
        
        <div className="forecast-description">
          <p>
            Ai stabilit un obiectiv de <strong>{objectiveType}</strong>, 
            de la <strong>{profile.weight}kg</strong> la <strong>{profile.weightGoal}kg</strong>.
            Cu un ritm sănătos de {rateInGramsPerWeek}g pe săptămână, poți atinge acest obiectiv 
            în aproximativ <strong>{weeksToGoal} săptămâni</strong>.
          </p>
        </div>
      </div>
      
      <div className="forecast-chart-container">
        <h3>Proiecția Evoluției Greutății</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{backgroundColor: "#8884d8"}}></span>
            <span className="legend-text">Greutate estimată</span>
          </div>
          <div className="legend-item">
            <span className="legend-line dotted"></span>
            <span className="legend-text">Greutate actuală</span>
          </div>
          <div className="legend-item">
            <span className="legend-line dashed"></span>
            <span className="legend-text">Greutate obiectiv</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              label={{ value: 'Săptămâni', position: 'insideBottomRight', offset: -5 }}
              tickFormatter={tick => tick === 0 ? 'Acum' : tick}
            />
            <YAxis 
              domain={[
                Math.min(profile.weight, profile.weightGoal) - 2, 
                Math.max(profile.weight, profile.weightGoal) + 2
              ]} 
              label={{ value: 'Greutate (kg)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#8884d8" 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
              name="Greutate estimată"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="calories-plan">
        <h3>Plan Caloric Recomandat</h3>
        <div className="calories-info">
          <div className="calorie-metric">
            <span className="calorie-type">Menținere:</span>
            <span className="calorie-value">{calories.maintenance} kcal/zi</span>
          </div>
          <div className="calorie-metric highlight">
            <span className="calorie-type">Recomandat:</span>
            <span className="calorie-value">{calories.target} kcal/zi</span>
          </div>
          <div className="calorie-metric">
            <span className="calorie-type">{isWeightLoss ? 'Deficit' : 'Surplus'}:</span>
            <span className="calorie-value">{calories.adjustment} kcal/zi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessAnalysisPage;