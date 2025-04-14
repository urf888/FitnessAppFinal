import React from 'react';
import './WeightGoalProgress.css';

const WeightGoalProgress = ({ currentWeight, goalWeight }) => {
  // Verifică dacă ambele valori sunt disponibile
  if (!currentWeight || !goalWeight) {
    return null;
  }

  // Calculează diferența și progresul
  const difference = currentWeight - goalWeight;
  const isWeightLoss = difference > 0;
  const absGoalDifference = Math.abs(difference);
  
  // Determină textul de afișat în funcție de tipul de obiectiv
  const goalType = isWeightLoss ? 'slăbire' : 'creștere în greutate';
  const remainingText = isWeightLoss 
    ? `Mai ai ${absGoalDifference.toFixed(1)} kg de pierdut` 
    : `Mai ai ${absGoalDifference.toFixed(1)} kg de câștigat`;

  // Calculează procentul de progres (simplificat)
  // Pentru obiective mai realiste, ai putea limita la un procent din greutatea inițială
  const initialDifference = isWeightLoss 
    ? (currentWeight * 0.2) // Presupunem că un obiectiv rezonabil de slăbit e 20% din greutatea inițială
    : (goalWeight * 0.2); // Presupunem că un obiectiv rezonabil de creștere e 20% din greutatea țintă
  
  const progress = Math.min(100, Math.max(0, 100 - (absGoalDifference / initialDifference * 100)));

  return (
    <div className="weight-goal-container">
      <h3>Obiectiv de {goalType}</h3>
      
      <div className="weight-values">
        <div className="current-weight">
          <span className="weight-label">Greutate actuală</span>
          <span className="weight-value">{currentWeight} kg</span>
        </div>
        
        <div className="goal-weight">
          <span className="weight-label">Greutate dorită</span>
          <span className="weight-value">{goalWeight} kg</span>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">{remainingText}</div>
      </div>
      
      <div className="weight-tips">
        {isWeightLoss ? (
          <p>Sfat: Combină exercițiile cardio cu o alimentație echilibrată pentru rezultate optime.</p>
        ) : (
          <p>Sfat: Focusează-te pe exerciții de forță și un surplus caloric sănătos.</p>
        )}
      </div>
    </div>
  );
};

export default WeightGoalProgress;