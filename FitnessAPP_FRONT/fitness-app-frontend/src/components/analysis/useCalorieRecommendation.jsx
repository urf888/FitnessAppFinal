// useCalorieRecommendation.jsx - versiune reparată
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import CalorieRecommendationModel from './calorieRecommendationModel';

const useCalorieRecommendation = (userProfile) => {
  const [modelReady, setModelReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [model] = useState(() => new CalorieRecommendationModel());

  // Inițializăm modelul când hook-ul este folosit prima dată
  useEffect(() => {
    let isMounted = true; // Flag pentru a evita actualizarea stării după demontare
    
    const initializeModel = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);
        
        console.log('Inițializare model...');
        
        // Asigurăm că există un model
        if (!model.model) {
          console.log('Crearea modelului de bază...');
          model.createModel();
        }
        
        // Încercăm să încărcăm un model existent din localStorage
        try {
          await model.loadModel();
          console.log('Model încărcat din localStorage cu succes');
          
          // Opțional, putem încerca să reantrenăm modelul cu date noi dacă este nevoie
          if (!model.isUsingRealData) {
            console.log('Modelul existent folosește date sintetice. Încercăm să obținem date reale...');
            // Vom lăsa acest proces să ruleze în fundal, fără să blocăm UI-ul
            setTimeout(async () => {
              try {
                await model.trainModel();
                await model.saveModel();
                console.log('Model reantrenat cu succes');
              } catch (e) {
                console.warn('Nu s-a putut reantrenare modelul în fundal:', e.message);
              }
            }, 1000);
          }
          
          if (!isMounted) return;
          setModelReady(true);
        } catch (loadError) {
          console.log('Nu s-a putut încărca modelul existent:', loadError.message);
          console.log('Se antrenează un model nou...');
          
          try {
            // Reset model
            model.model = null;
            model.createModel();
            
            // Antrenăm modelul cu date sintetice pentru început
            const syntheticData = model.generateSyntheticTrainingData(100);
            await model.trainModel(syntheticData.inputs, syntheticData.outputs);
            
            // Salvăm modelul
            await model.saveModel();
            console.log('Model nou antrenat și salvat cu succes');
            
            if (!isMounted) return;
            setModelReady(true);
          } catch (trainError) {
            console.error('Eroare la antrenarea modelului nou:', trainError);
            
            if (!isMounted) return;
            setError('Nu s-a putut antrena modelul. Se vor folosi calculele standard.');
            // Setăm modelReady ca true oricum pentru a permite folosirea metodei de backup
            setModelReady(true);
          }
        }
      } catch (err) {
        console.error('Eroare generală la inițializarea modelului:', err);
        
        if (!isMounted) return;
        setError('Nu s-a putut inițializa modelul. Se vor folosi calculele standard.');
        setModelReady(true); // Pentru a permite folosirea metodei de backup
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Inițializăm modelul
    initializeModel();
    
    // Curățare la demontarea componentei
    return () => {
      isMounted = false;
      
      // Eliberăm memoria folosită de tensori
      try {
        if (tf.memory().numTensors > 0) {
          console.log(`Curățare tensori la demontare: ${tf.memory().numTensors} tensori`);
          tf.disposeVariables();
        }
      } catch (e) {
        console.warn('Eroare la eliberarea memoriei tensorilor:', e);
      }
    };
  }, [model]);

  // Generăm recomandarea când profilul utilizatorului se schimbă
  useEffect(() => {
    let isMounted = true;
    
    const generateRecommendation = async () => {
      if (!modelReady || !userProfile) return;

      try {
        setLoading(true);
        
        // Verificăm dacă profilul conține toate datele necesare
        if (!userProfile.age || !userProfile.height || !userProfile.weight || 
            !userProfile.sex || !userProfile.activityLevel || !userProfile.weightGoal) {
          setError('Profilul utilizatorului este incomplet pentru a genera o recomandare.');
          return;
        }

        // Calculăm rata optimă de schimbare a greutății bazată pe obiectiv
        const weightDifference = userProfile.weight - userProfile.weightGoal;
        const isWeightLoss = weightDifference > 0;
        
        // Rate recomandate (kg/săptămână)
        let targetRate;
        if (isWeightLoss) {
          // Pentru slăbit: între 0.5 și 1kg pe săptămână, în funcție de nivelul de activitate
          const rates = {
            'sedentary': 0.5,
            'light': 0.6,
            'moderate': 0.7,
            'active': 0.8,
            'very active': 0.9
          };
          targetRate = rates[userProfile.activityLevel.toLowerCase()] || 0.5;
        } else {
          // Pentru câștig în greutate: între 0.2 și 0.4kg pe săptămână
          const rates = {
            'sedentary': 0.2,
            'light': 0.25,
            'moderate': 0.3,
            'active': 0.35,
            'very active': 0.4
          };
          targetRate = rates[userProfile.activityLevel.toLowerCase()] || 0.25;
        }

        // Adăugăm rata la profilul utilizatorului pentru predicție
        const profileWithRate = {
          ...userProfile,
          targetRate
        };

        // Generăm recomandarea
        const calories = await model.predictCalories(profileWithRate);
        
        // Calculăm un minim sănătos și personalizat de calorii
        // Nu mergem niciodată sub metabolismul bazal pentru siguranță
        let minSafeCalories;
        if (userProfile.sex === 'masculin') {
          // Pentru bărbați, minim ~1500-1800 kcal în funcție de înălțime și nivel de activitate
          minSafeCalories = Math.max(1500, 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5);
        } else {
          // Pentru femei, minim ~1200-1500 kcal în funcție de înălțime și nivel de activitate
          minSafeCalories = Math.max(1200, 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161);
        }
        
        // Ajustăm minimul cu un factor de siguranță în funcție de activitate
        const activityFactors = {
          'sedentary': 1.0,
          'light': 1.05,
          'moderate': 1.1,
          'active': 1.15,
          'very active': 1.2
        };
        const activityFactor = activityFactors[userProfile.activityLevel.toLowerCase()] || 1.0;
        minSafeCalories = Math.round(minSafeCalories * activityFactor);
        
        // Ajustăm recomandarea pentru a ne asigura că este rezonabilă și sănătoasă
        const adjustedCalories = Math.max(minSafeCalories, Math.min(calories, 4000));
        
        // Calculăm macronutrienții recomandați
        const macros = calculateMacronutrients(adjustedCalories, userProfile, isWeightLoss);
        
        if (!isMounted) return;
        
        // Setăm recomandarea finală
        setRecommendation({
          calories: adjustedCalories,
          macros,
          targetRate,
          isRealDataModel: model.isUsingRealData
        });
        
      } catch (err) {
        console.error('Eroare la generarea recomandării:', err);
        
        if (!isMounted) return;
        setError('Nu s-a putut genera recomandarea calorică. Se folosesc calculele standard.');
        
        // Folosim calculul standard ca backup
        const backupRecommendation = calculateBackupRecommendation(userProfile);
        setRecommendation(backupRecommendation);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    generateRecommendation();
    
    return () => {
      isMounted = false;
    };
  }, [modelReady, userProfile, model]);

  // Funcție de backup pentru calculul recomandării
  const calculateBackupRecommendation = (profile) => {
    // Calculăm BMR
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
    
    // Calculăm TDEE
    const maintenanceCalories = bmr * activityFactor;
    
    // Calculăm diferența de greutate și direcția
    const weightDifference = profile.weight - profile.weightGoal;
    const isWeightLoss = weightDifference > 0;
    
    // Calculăm rata optimă
    let targetRate;
    if (isWeightLoss) {
      const rates = {
        'sedentary': 0.5,
        'light': 0.6,
        'moderate': 0.7,
        'active': 0.8,
        'very active': 0.9
      };
      targetRate = rates[profile.activityLevel.toLowerCase()] || 0.5;
    } else {
      const rates = {
        'sedentary': 0.2,
        'light': 0.25,
        'moderate': 0.3,
        'active': 0.35,
        'very active': 0.4
      };
      targetRate = rates[profile.activityLevel.toLowerCase()] || 0.25;
    }
    
    // Calculăm ajustarea calorică
    const caloriesPerKg = 7700;
    const dailyCalorieAdjustment = (targetRate * caloriesPerKg) / 7;
    
    // Calculăm recomandarea finală
    const targetCalories = isWeightLoss 
      ? maintenanceCalories - dailyCalorieAdjustment
      : maintenanceCalories + dailyCalorieAdjustment;
    
    // Calculăm macronutrienții
    const macros = calculateMacronutrients(targetCalories, profile, isWeightLoss);
    
    return {
      calories: Math.round(targetCalories),
      macros,
      targetRate,
      isRealDataModel: false // Indicăm că aceasta este o recomandare bazată pe formulă, nu pe AI
    };
  };

  // Funcție pentru calculul macronutrienților recomandați
  const calculateMacronutrients = (calories, profile, isWeightLoss) => {
    let proteinPercentage, carbsPercentage, fatPercentage;
    
    if (isWeightLoss) {
      // Pentru slăbit: mai multe proteine, mai puține carbohidrați
      proteinPercentage = 0.35; // 35%
      fatPercentage = 0.30;    // 30%
      carbsPercentage = 0.35;  // 35%
    } else {
      // Pentru câștig în masă: mai multe carbohidrați pentru energie
      proteinPercentage = 0.30; // 30%
      fatPercentage = 0.25;    // 25%
      carbsPercentage = 0.45;  // 45%
    }
    
    // Ajustăm în funcție de nivelul de activitate
    if (profile.activityLevel === 'very active' || profile.activityLevel === 'active') {
      // Activitate intensă - mai mulți carbohidrați pentru energie
      carbsPercentage += 0.05;
      fatPercentage -= 0.05;
    } else if (profile.activityLevel === 'sedentary') {
      // Activitate redusă - mai puțini carbohidrați
      carbsPercentage -= 0.05;
      proteinPercentage += 0.05;
    }
    
    // Calculăm gramele pentru fiecare macronutrient
    // Proteine: 4 calorii/gram, Carbohidrați: 4 calorii/gram, Grăsimi: 9 calorii/gram
    const proteinGrams = Math.round((calories * proteinPercentage) / 4);
    const carbsGrams = Math.round((calories * carbsPercentage) / 4);
    const fatGrams = Math.round((calories * fatPercentage) / 9);
    
    return {
      protein: {
        percentage: Math.round(proteinPercentage * 100),
        grams: proteinGrams
      },
      carbs: {
        percentage: Math.round(carbsPercentage * 100),
        grams: carbsGrams
      },
      fat: {
        percentage: Math.round(fatPercentage * 100),
        grams: fatGrams
      }
    };
  };

  return { recommendation, loading, error };
};

export default useCalorieRecommendation;