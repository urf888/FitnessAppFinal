/* eslint-disable no-unused-vars */
// SmartCalorieRecommendation.jsx
import React, { useState, useEffect } from 'react';
import useCalorieRecommendation from './useCalorieRecommendation';
import MacronutrientChart from './MacronutrientChart';
import './GoalForecast.css'; // Reutilizăm stilurile existente

const SmartCalorieRecommendation = ({ profile }) => {
  const { recommendation, loading, error } = useCalorieRecommendation(profile);
  const [compareWithCurrent, setCompareWithCurrent] = useState(false);
  const [currentCalculation, setCurrentCalculation] = useState(null);

  // Calculăm caloriile curente utilizând formula clasică (pentru comparație)
  useEffect(() => {
    if (profile) {
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
      
      const activityFactor = activityFactors[profile.activityLevel.toLowerCase()] || 1.2;
      
      // Calcularea TDEE (Total Daily Energy Expenditure)
      const maintenanceCalories = Math.round(bmr * activityFactor);
      
      // Calculăm dacă este obiectiv de slăbire sau creștere
      const isWeightLoss = profile.weight > profile.weightGoal;
      
      // Calculăm caloriile recomandate utilizând metoda clasică
      const caloriesPerKg = 7700; // ~7700 calorii per kg de grăsime
      const weightDifference = Math.abs(profile.weight - profile.weightGoal);
      const weeklyRate = isWeightLoss ? 0.5 : 0.25; // Rate standard recomandate
      const dailyCalorieAdjustment = Math.round((weeklyRate * caloriesPerKg) / 7);
      
      const targetCalories = isWeightLoss 
        ? maintenanceCalories - dailyCalorieAdjustment
        : maintenanceCalories + dailyCalorieAdjustment;
      
      setCurrentCalculation({
        maintenance: maintenanceCalories,
        target: targetCalories,
        adjustment: dailyCalorieAdjustment,
        isWeightLoss
      });
    }
  }, [profile]);

  if (!profile || !profile.weightGoal) {
    return (
      <div className="goal-forecast no-goal">
        <h3>Recomandare inteligentă de calorii</h3>
        <p>
          Nu ai setat încă un obiectiv de greutate. 
          Adaugă un obiectiv în profilul tău pentru a vedea o recomandare personalizată.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="goal-forecast">
        <h3>Recomandare inteligentă de calorii</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Se calculează recomandarea personalizată...</p>
          {/* Aici ai putea adăuga un spinner sau o animație de loading */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="goal-forecast">
        <h3>Recomandare inteligentă de calorii</h3>
        <div className="forecast-disclaimer" style={{ background: '#ffebee', borderLeftColor: '#f44336' }}>
          <p><strong>Eroare:</strong> {error}</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const { calories, macros, targetRate } = recommendation;
  const isWeightLoss = profile.weight > profile.weightGoal;
  const objectiveType = isWeightLoss ? 'slăbire' : 'creștere în greutate';
  const rateInGramsPerWeek = (targetRate * 1000).toFixed(0);

  return (
    <div className="goal-forecast">
      <h3>Recomandare inteligentă de calorii</h3>
      
      <div className="goal-summary">
        <div className="goal-metrics">
          <div className="goal-metric highlight">
            <span className="metric-value">{calories}</span>
            <span className="metric-label">calorii/zi</span>
          </div>
          <div className="goal-metric">
            <span className="metric-value">{rateInGramsPerWeek}g</span>
            <span className="metric-label">pe săptămână</span>
          </div>
        </div>
        
        <div className="goal-description">
          <p>
            Algoritmul nostru de AI a analizat datele tale și a generat o recomandare personalizată 
            pentru obiectivul tău de <strong>{objectiveType}</strong>.
            Această recomandare ține cont de metabolismul tău, nivelul de activitate și obiectivul propus.
          </p>
        </div>
      </div>
      
      {macros && (
        <div className="macro-recommendations">
          <h4>Distribuția recomandată a macronutrienților</h4>
          <MacronutrientChart macros={macros} />
          <div className="calories-info" style={{ marginTop: '20px' }}>
            <div className="calorie-metric">
              <span className="calorie-type">Proteine:</span>
              <span className="calorie-value">{macros.protein.grams}g ({macros.protein.percentage}%)</span>
            </div>
            <div className="calorie-metric">
              <span className="calorie-type">Carbohidrați:</span>
              <span className="calorie-value">{macros.carbs.grams}g ({macros.carbs.percentage}%)</span>
            </div>
            <div className="calorie-metric">
              <span className="calorie-type">Grăsimi:</span>
              <span className="calorie-value">{macros.fat.grams}g ({macros.fat.percentage}%)</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle pentru comparație cu calculul standard */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <button 
          onClick={() => setCompareWithCurrent(!compareWithCurrent)}
          className="set-goal-button"
          style={{ 
            backgroundColor: compareWithCurrent ? '#2196F3' : '#9e9e9e', 
            padding: '8px 16px',
            fontSize: '0.9rem'
          }}
        >
          {compareWithCurrent ? 'Ascunde comparația' : 'Compară cu calculul standard'}
        </button>
      </div>
      
      {/* Secțiunea de comparație */}
      {compareWithCurrent && currentCalculation && (
        <div className="calories-plan" style={{ backgroundColor: '#f0f7ff' }}>
          <h4>Comparație cu calculul standard</h4>
          <div className="calories-info">
            <div className="calorie-metric">
              <span className="calorie-type">Calculul standard:</span>
              <span className="calorie-value">{currentCalculation.target} kcal/zi</span>
            </div>
            <div className="calorie-metric highlight">
              <span className="calorie-type">Recomandare AI:</span>
              <span className="calorie-value">{calories} kcal/zi</span>
            </div>
            <div className="calorie-metric">
              <span className="calorie-type">Diferență:</span>
              <span className="calorie-value">
                {Math.abs(calories - currentCalculation.target)} kcal/zi
                ({calories > currentCalculation.target ? '+' : '-'}
                {Math.round(Math.abs(calories - currentCalculation.target) / currentCalculation.target * 100)}%)
              </span>
            </div>
          </div>
          <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}>
            <p>
              Recomandarea AI ia în considerare mai mulți factori, inclusiv date statistice 
              despre persoane cu profil similar, pentru a optimiza planul tău caloric.
            </p>
          </div>
        </div>
      )}
      
      <div className="forecast-tips">
        <h4>Sfaturi pentru implementare</h4>
        <ul>
          {isWeightLoss ? (
            <>
              <li><strong>Timing:</strong> Încearcă să mănânci porții mai mici, dar mai frecvente pentru a-ți menține nivelul de energie și a evita senzația de foame severă.</li>
              <li><strong>Alegeri inteligente:</strong> Bazează-ți masa pe legume și proteine, adăugând carbohidrați complecși pentru energie susținută.</li>
            </>
          ) : (
            <>
              <li><strong>Timing:</strong> Asigură-te că consumi un mic dejun consistent și o masă post-antrenament bogată în proteine și carbohidrați.</li>
              <li><strong>Alegeri inteligente:</strong> Concentrează-te pe alimente dense caloric dar nutritive - nuci, unt de arahide, avocado, batoane proteice.</li>
            </>
          )}
          <li><strong>Monitorizare:</strong> Ține un jurnal alimentar în primele săptămâni pentru a te asigura că respecți planul caloric recomandat.</li>
          <li><strong>Flexibilitate:</strong> Permite-ți mici abateri ocazionale, dar revino la plan - consistența pe termen lung este cheia.</li>
        </ul>
      </div>
      
      <div className="forecast-disclaimer">
        <p>
          <strong>Notă:</strong> Această recomandare calorică este calculată utilizând algoritmi de învățare automată 
          {recommendation.isRealDataModel ? ' antrenați pe date reale de la utilizatori cu profil similar' : ' bazați pe formulele nutriționale standard'}.
          Modelul se perfecționează continuu. Ajustează consumul în funcție de cum se simte corpul tău și de progresul observat.
        </p>
      </div>
    </div>
  );
};

export default SmartCalorieRecommendation;