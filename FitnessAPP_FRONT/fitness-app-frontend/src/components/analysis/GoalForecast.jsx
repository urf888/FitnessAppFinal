// GoalForecast.jsx - Varianta îmbunătățită cu AI
import React, { useState, useEffect } from 'react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GoalForecast.css';
import SmartCalorieRecommendation from './SmartCalorieRecommendation';

const GoalForecast = ({ profile }) => {
  const [forecastData, setForecastData] = useState({
    weeks: 0,
    monthlyData: [],
    ratePerWeek: 0,
    isWeightLoss: false,
    targetDate: null,
    calories: {
      maintenance: 0,
      target: 0,
      deficit: 0
    }
  });
  
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  
  useEffect(() => {
    if (profile && profile.weightGoal) {
      // Calcularea prognozei când profilul și obiectivul sunt disponibile
      calculateForecast();
    }
  }, [profile]);
  
  const calculateForecast = () => {
    if (!profile || !profile.weightGoal) return;
    
    const currentWeight = profile.weight;
    const goalWeight = profile.weightGoal;
    const difference = Math.abs(currentWeight - goalWeight);
    const isWeightLoss = currentWeight > goalWeight;
    
    // Determinarea ratei recomandate de schimbare a greutății (kg/săptămână)
    let ratePerWeek;
    
    if (isWeightLoss) {
      // Rate pentru slăbit bazate pe activitate
      const rates = {
        'sedentary': 0.5,
        'light': 0.6,
        'moderate': 0.7,
        'active': 0.8,
        'very active': 1.0
      };
      ratePerWeek = rates[profile.activityLevel] || 0.5;
    } else {
      // Rate pentru câștig muscular (mai lente)
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
    
    // Generarea datelor pentru grafic (progresul lunar)
    const monthlyData = generateMonthlyData(currentWeight, goalWeight, ratePerWeek, weeksToGoal);
    
    // Calcularea necesarului de calorii
    const calories = calculateCalories(profile, isWeightLoss, ratePerWeek);
    
    setForecastData({
      weeks: weeksToGoal,
      monthlyData,
      ratePerWeek,
      isWeightLoss,
      targetDate,
      calories
    });
  };
  
  const generateMonthlyData = (currentWeight, goalWeight, ratePerWeek, totalWeeks) => {
    const data = [];
    const isWeightLoss = currentWeight > goalWeight;
    const weeklyChange = isWeightLoss ? -ratePerWeek : ratePerWeek;
    
    // Adaugă punctul inițial
    data.push({
      time: 'Acum',
      weight: currentWeight,
    });
    
    // Calculăm câte luni va dura (aproximativ)
    const months = Math.ceil(totalWeeks / 4.33);
    
    // Pentru fiecare lună, adăugăm un punct de date
    for (let i = 1; i <= Math.min(months, 12); i++) {
      const weeksElapsed = i * 4.33; // aproximativ 4.33 săptămâni per lună
      const adjustedWeeks = Math.min(weeksElapsed, totalWeeks);
      const projectedWeight = currentWeight + (weeklyChange * adjustedWeeks);
      
      // Ne asigurăm că nu depășim obiectivul
      const weight = isWeightLoss 
        ? Math.max(projectedWeight, goalWeight) 
        : Math.min(projectedWeight, goalWeight);
      
      data.push({
        time: `Luna ${i}`,
        weight: parseFloat(weight.toFixed(1)),
      });
      
      // Dacă am atins obiectivul, ne oprim
      if ((isWeightLoss && weight <= goalWeight) || (!isWeightLoss && weight >= goalWeight)) {
        break;
      }
    }
    
    // Adăugăm obiectivul dacă nu l-am atins deja
    if (data[data.length-1].weight !== goalWeight) {
      data.push({
        time: `Obiectiv final`,
        weight: parseFloat(goalWeight.toFixed(1)),
      });
    }
    
    return data;
  };
  
  const calculateCalories = (profile, isWeightLoss, ratePerWeek) => {
    // Calcularea BMR (Basal Metabolic Rate) folosind ecuația Harris-Benedict
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
    
    const activityFactor = activityFactors[profile.activityLevel] || 1.2;
    
    // Calcularea TDEE (Total Daily Energy Expenditure)
    const maintenanceCalories = Math.round(bmr * activityFactor);
    
    // O lipsă/surplus de aproximativ 500-1000 de calorii pe zi reprezintă ritmul recomandat
    // 1 kg de grăsime = aproximativ 7700 de calorii
    const caloriesPerKg = 7700;
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
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ro-RO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const toggleAIRecommendation = () => {
    setShowAIRecommendation(!showAIRecommendation);
  };
  
  if (!profile || !profile.weightGoal) {
    return (
      <div className="goal-forecast no-goal">
        <h3>Prognoză pentru atingerea obiectivului</h3>
        <p>
          Nu ai setat încă un obiectiv de greutate. 
          Adaugă un obiectiv în profilul tău pentru a vedea o prognoză personalizată.
        </p>
        <div className="no-goal-action">
          <button className="set-goal-button">Setează un obiectiv</button>
        </div>
      </div>
    );
  }
  
  const { 
    weeks, 
    monthlyData, 
    ratePerWeek, 
    isWeightLoss, 
    targetDate, 
    calories 
  } = forecastData;
  
  const rateInGramsPerWeek = (ratePerWeek * 1000).toFixed(0);
  const objectiveType = isWeightLoss ? 'slăbire' : 'creștere în greutate';
  
  return (
    <>
      <div className="goal-forecast">
        <h3>Prognoză personalizată pentru atingerea obiectivului</h3>
        
        <div className="goal-summary">
          <div className="goal-metrics">
            <div className="goal-metric">
              <span className="metric-value">{weeks}</span>
              <span className="metric-label">săptămâni</span>
            </div>
            <div className="goal-metric highlight">
              <span className="metric-value">{formatDate(targetDate)}</span>
              <span className="metric-label">data estimată</span>
            </div>
            <div className="goal-metric">
              <span className="metric-value">{rateInGramsPerWeek}g</span>
              <span className="metric-label">pe săptămână</span>
            </div>
          </div>
          
          <div className="goal-description">
            <p>
              Ai stabilit un obiectiv de <strong>{objectiveType}</strong>, 
              de la <strong>{profile.weight}kg</strong> la <strong>{profile.weightGoal}kg</strong>.
              Cu un ritm sănătos de {rateInGramsPerWeek}g pe săptămână, poți atinge acest obiectiv 
              în aproximativ <strong>{weeks} săptămâni</strong>.
            </p>
          </div>
        </div>
        
        <div className="forecast-chart">
          <h4>Proiecția evoluției greutății tale</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 20, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis 
                domain={[
                  Math.min(profile.weight, profile.weightGoal) - 2, 
                  Math.max(profile.weight, profile.weightGoal) + 2
                ]} 
                label={{ value: 'Kg', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => [`${value} kg`, 'Greutate']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Greutate estimată"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="calories-plan">
          <h4>Plan caloric recomandat</h4>
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
        
        {/* Buton pentru a afișa/ascunde recomandarea AI */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button 
            onClick={toggleAIRecommendation} 
            className="set-goal-button"
            style={{ 
              backgroundColor: showAIRecommendation ? '#673AB7' : '#4CAF50',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {showAIRecommendation ? 'Ascunde recomandarea AI' : 'Arată recomandarea AI avansată'}
            <span role="img" aria-label="ai">🤖</span>
          </button>
        </div>
        
        <div className="forecast-tips">
          <h4>Sfaturi pentru atingerea obiectivului</h4>
          {isWeightLoss ? (
            <ul>
              <li><strong>Alimentație:</strong> Concentrează-te pe alimente bogate în proteine și fibre care te ajută să te simți sătul mai mult timp.</li>
              <li><strong>Exerciții:</strong> Combină antrenamentele cardio cu cele de forță pentru a maximiza arderea caloriilor și a menține masa musculară.</li>
              <li><strong>Hidratare:</strong> Bea suficientă apă (minim 2L/zi) - adeseori senzația de foame poate fi confundată cu cea de sete.</li>
              <li><strong>Constanță:</strong> Rămâi constant, chiar și o pierdere mică și susținută este mai benefică decât fluctuații mari de greutate.</li>
            </ul>
          ) : (
            <ul>
              <li><strong>Alimentație:</strong> Crește aportul caloric cu alimente bogate în nutrienți și proteine de calitate pentru a susține creșterea musculară.</li>
              <li><strong>Exerciții:</strong> Focusează-te pe antrenamente de forță progresive pentru a stimula creșterea musculară.</li>
              <li><strong>Odihnă:</strong> Asigură-te că ai suficient somn și perioade de recuperare între antrenamente pentru a permite mușchilor să se dezvolte.</li>
              <li><strong>Constanță:</strong> Creșterea în greutate sănătoasă este un proces gradual - urmărește să câștigi predominant masă musculară, nu grăsime.</li>
            </ul>
          )}
        </div>
        
        <div className="forecast-disclaimer">
          <p>
            <strong>Notă:</strong> Aceste estimări sunt orientative și pot varia în funcție de mai mulți 
            factori individuali precum metabolismul, genetica, și aderența la planul de alimentație și antrenament.
          </p>
        </div>
      </div>
      
      {/* Secțiunea de recomandare AI care poate fi afișată/ascunsă */}
      {showAIRecommendation && (
        <SmartCalorieRecommendation profile={profile} />
      )}
    </>
  );
};

export default GoalForecast;