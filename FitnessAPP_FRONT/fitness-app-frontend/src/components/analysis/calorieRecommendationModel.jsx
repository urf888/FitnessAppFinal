// calorieRecommendationModel.jsx - versiune reparată
import * as tf from '@tensorflow/tfjs';
import api from '../../api/axiosConfig'; // Presupun că ai un serviciu de API configurat

class CalorieRecommendationModel {
  constructor() {
    this.model = null;
    this.inputMin = null;
    this.inputMax = null;
    this.outputMin = null;
    this.outputMax = null;
    this.isUsingRealData = false;
    this.isTraining = false; // Flag pentru a urmări dacă modelul este în antrenare
  }

  // Normalizarea datelor de intrare - cu verificări de siguranță
  normalizeInput(data) {
    return tf.tidy(() => {
      // Verificăm dacă avem toate datele necesare pentru normalizare
      if (!this.inputMin || !this.inputMax) {
        console.error('Valorile de normalizare nu sunt inițializate');
        // Returnăm datele neschimbate ca fallback
        return data;
      }
      return data.sub(this.inputMin).div(this.inputMax.sub(this.inputMin));
    });
  }

  // Denormalizarea ieșirii - cu verificări de siguranță
  denormalizeOutput(normalizedOutput) {
    return tf.tidy(() => {
      // Verificăm dacă avem toate datele necesare pentru denormalizare
      if (!this.outputMin || !this.outputMax) {
        console.error('Valorile de normalizare pentru ieșire nu sunt inițializate');
        // Returnăm datele neschimbate ca fallback
        return normalizedOutput;
      }
      return normalizedOutput
        .mul(this.outputMax.sub(this.outputMin))
        .add(this.outputMin);
    });
  }

  // Crearea modelului cu verificări
  createModel() {
    // Verificăm dacă modelul există deja
    if (this.model) {
      console.log('Modelul există deja, nu este necesară recrearea');
      return this.model;
    }

    // Construim un model nou
    console.log('Crearea unui model nou');
    const model = tf.sequential();
    
    // Adăugăm straturi pentru rețeaua neurală
    model.add(tf.layers.dense({
      inputShape: [7], // [vârstă, înălțime, greutate, sex, nivelActivitate, obiectivGreutate, ritmSchimbare]
      units: 16,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 1 // Ieșire: calorii recomandate
    }));
    
    // Compilăm modelul
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
    
    this.model = model;
    return model;
  }

  // Încărcarea datelor reale de antrenare cu gestionare mai bună a erorilor
  async loadRealTrainingData() {
    try {
      const response = await api.get('/api/profile/training-data');
      const profiles = response.data;
      
      if (!profiles || profiles.length < 5) { // Am redus la 5 pentru testare
        console.log(`Prea puține date reale pentru antrenament (${profiles?.length || 0}), vom folosi date sintetice`);
        return null;
      }
      
      // Transformăm datele primite în formatul așteptat de model
      const inputData = [];
      const outputData = [];
      
      profiles.forEach(profile => {
        // Calculăm rata de schimbare pe baza diferenței dintre greutatea curentă și obiectiv
        const weightDifference = profile.weight - profile.weightGoal;
        const isWeightLoss = weightDifference > 0;
        
        // Determinăm o rată rezonabilă bazată pe obiectiv
        let targetRate;
        if (isWeightLoss) {
          targetRate = Math.min(Math.abs(weightDifference) * 0.1, 1.0); // Maximum 1kg/săptămână
        } else {
          targetRate = Math.min(Math.abs(weightDifference) * 0.05, 0.5); // Maximum 0.5kg/săptămână
        }
        
        // Codificăm nivelul de activitate
        const activityLevel = this.encodeActivityLevel(profile.activityLevel);
        
        // Codificăm sexul
        const sex = profile.sex === 'masculin' ? 1 : 0;
        
        // Adăugăm datele de intrare
        inputData.push([
          profile.age,
          profile.height,
          profile.weight,
          sex,
          activityLevel,
          profile.weightGoal,
          targetRate
        ]);
        
        // Adăugăm datele de ieșire
        outputData.push([profile.calorieIntake]);
      });
      
      this.isUsingRealData = true;
      console.log(`Model antrenat cu ${inputData.length} profile reale`);
      
      return {
        inputs: inputData,
        outputs: outputData
      };
    } catch (error) {
      console.error('Eroare la încărcarea datelor reale:', error);
      return null;
    }
  }

  // Antrenarea modelului cu verificări suplimentare
  async trainModel(inputData = null, outputData = null) {
    // Verificăm dacă modelul este deja în antrenare
    if (this.isTraining) {
      console.log('Modelul este deja în proces de antrenare. Se așteaptă finalizarea.');
      return null;
    }
    
    // Verificăm dacă modelul există
    if (!this.model) {
      console.log('Modelul nu există. Se creează...');
      this.createModel();
    }
    
    try {
      // Setăm flag-ul că modelul este în antrenare
      this.isTraining = true;
      
      // Încercăm să încărcăm date reale dacă nu sunt furnizate
      if (!inputData || !outputData) {
        try {
          const realData = await this.loadRealTrainingData();
          
          if (realData && realData.inputs.length > 0) {
            console.log(`Folosim ${realData.inputs.length} profile reale pentru antrenare`);
            inputData = realData.inputs;
            outputData = realData.outputs;
          } else {
            // Dacă nu avem date reale, generăm date sintetice
            console.log('Nu s-au găsit date reale, se generează date sintetice');
            const syntheticData = this.generateSyntheticTrainingData(200); // Am redus pentru viteză
            inputData = syntheticData.inputs;
            outputData = syntheticData.outputs;
          }
        } catch (dataError) {
          console.error('Eroare la încărcarea datelor, se folosesc date sintetice:', dataError);
          const syntheticData = this.generateSyntheticTrainingData(200);
          inputData = syntheticData.inputs;
          outputData = syntheticData.outputs;
        }
      }
      
      // Verificăm dacă am primit date valide
      if (!inputData || !outputData || inputData.length === 0 || outputData.length === 0) {
        throw new Error('Nu s-au putut obține date de antrenare valide');
      }
      
      console.log(`Antrenare model cu ${inputData.length} exemple`);
      
      // Convertim datele în tensori
      const inputs = tf.tensor2d(inputData);
      const outputs = tf.tensor2d(outputData, [outputData.length, 1]);
      
      // Calculăm valorile pentru normalizare
      this.inputMin = inputs.min(0);
      this.inputMax = inputs.max(0);
      this.outputMin = outputs.min(0);
      this.outputMax = outputs.max(0);
      
      // Normalizăm datele
      const normalizedInputs = inputs.sub(this.inputMin).div(this.inputMax.sub(this.inputMin));
      const normalizedOutputs = outputs.sub(this.outputMin).div(this.outputMax.sub(this.outputMin));
      
      // Configurăm procesul de antrenare
      const batchSize = 16; // Am redus pentru mai multă stabilitate
      const epochs = 30; // Am redus numărul de epoci pentru testare
      
      // Antrenăm modelul
      const result = await this.model.fit(normalizedInputs, normalizedOutputs, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      });
      
      // Eliberăm tensori manuali
      inputs.dispose();
      outputs.dispose();
      normalizedInputs.dispose();
      normalizedOutputs.dispose();
      
      return result;
    } catch (error) {
      console.error('Eroare în timpul antrenării:', error);
      throw error;
    } finally {
      // Resetăm flag-ul indiferent de rezultat
      this.isTraining = false;
      
      // Curățăm memoria tensorilor
      tf.engine().endScope();
      if (tf.memory().numTensors > 0) {
        console.log(`Tensori rămaşi: ${tf.memory().numTensors}, Curăţare...`);
        tf.disposeVariables();
      }
    }
  }
  
  // Predicția caloriilor recomandate cu verificări
  async predictCalories(userData) {
    try {
      // Verificăm dacă modelul și valorile de normalizare există
      if (!this.model || !this.inputMin || !this.inputMax || !this.outputMin || !this.outputMax) {
        console.error('Modelul sau valorile de normalizare nu sunt inițializate complet');
        // Folosim o formulă de backup pentru a calcula caloriile
        return this.calculateBackupCalories(userData);
      }
      
      // Transformăm datele utilizatorului în tensori
      const input = tf.tensor2d([
        [
          userData.age,
          userData.height,
          userData.weight,
          userData.sex === 'masculin' ? 1 : 0,
          this.encodeActivityLevel(userData.activityLevel),
          userData.weightGoal,
          userData.targetRate || 0.5 // Rata de schimbare dorită (kg/săptămână)
        ]
      ]);
      
      // Normalizăm datele
      const normalizedInput = this.normalizeInput(input);
      
      // Facem predicția
      const normalizedOutput = this.model.predict(normalizedInput);
      
      // Denormalizăm rezultatul
      const output = this.denormalizeOutput(normalizedOutput);
      
      // Extragem valoarea recomandată
      const caloriesRecommended = await output.data();
      
      // Eliberăm tensori
      input.dispose();
      normalizedInput.dispose();
      normalizedOutput.dispose();
      output.dispose();
      
      // Verificăm dacă rezultatul este rezonabil
      const calories = Math.round(caloriesRecommended[0]);
      if (isNaN(calories) || calories < 800 || calories > 5000) {
        console.warn('Predicție de calorii nerezonabilă, se folosește varianta de backup');
        return this.calculateBackupCalories(userData);
      }
      
      return calories;
    } catch (error) {
      console.error('Eroare la generarea predicției:', error);
      // Folosim formula clasică ca backup
      return this.calculateBackupCalories(userData);
    }
  }
  
  // Formulă clasică pentru calculul caloriilor (backup)
  calculateBackupCalories(userData) {
    console.log('Se folosește formula clasică de backup pentru calorii');
    
    // Calculăm BMR folosind formula Harris-Benedict
    let bmr;
    if (userData.sex === 'masculin') {
      bmr = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    } else {
      bmr = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * userData.age);
    }
    
    // Factori de activitate
    const activityFactors = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very active': 1.9
    };
    
    const activityFactor = activityFactors[userData.activityLevel.toLowerCase()] || 1.2;
    
    // TDEE (Total Daily Energy Expenditure)
    const maintenanceCalories = bmr * activityFactor;
    
    // Calculăm diferența de greutate și direcția
    const weightDifference = userData.weight - userData.weightGoal;
    const isWeightLoss = weightDifference > 0;
    
    // Ajustăm caloriile în funcție de obiectiv
    const caloriesPerKg = 7700; // ~7700 calorii per kg
    let targetRate = userData.targetRate || (isWeightLoss ? 0.5 : 0.25); // rate implicite
    const dailyCalorieAdjustment = (targetRate * caloriesPerKg) / 7;
    
    // Calculăm recomandarea finală
    const targetCalories = isWeightLoss 
      ? maintenanceCalories - dailyCalorieAdjustment
      : maintenanceCalories + dailyCalorieAdjustment;
    
    return Math.round(targetCalories);
  }
  
  // Codificarea nivelului de activitate într-o valoare numerică
  encodeActivityLevel(activityLevel) {
    const activityMap = {
      'sedentary': 1,
      'light': 2,
      'moderate': 3,
      'active': 4,
      'very active': 5
    };
    
    return activityMap[activityLevel?.toLowerCase()] || 1;
  }
  
  // Salvarea modelului în localStorage cu tratarea erorilor
  async saveModel() {
    if (!this.model) {
      throw new Error('Nu există niciun model de salvat');
    }
    
    try {
      // Salvăm modelul în format JSON
      const modelJson = this.model.toJSON();
      localStorage.setItem('calorieRecommendationModel', JSON.stringify(modelJson));
      
      // Salvăm valorile de normalizare
      if (this.inputMin && this.inputMax && this.outputMin && this.outputMax) {
        const normalizationValues = {
          inputMin: Array.from(await this.inputMin.data()),
          inputMax: Array.from(await this.inputMax.data()),
          outputMin: Array.from(await this.outputMin.data()),
          outputMax: Array.from(await this.outputMax.data()),
          isUsingRealData: this.isUsingRealData
        };
        
        localStorage.setItem('normalizationValues', JSON.stringify(normalizationValues));
        console.log('Model și valori de normalizare salvate în localStorage');
      } else {
        console.error('Nu se pot salva valorile de normalizare - unele valori lipsesc');
        // Ștergem modelul salvat pentru a evita inconsistențele
        localStorage.removeItem('calorieRecommendationModel');
        throw new Error('Valorile de normalizare lipsesc');
      }
    } catch (error) {
      console.error('Eroare la salvarea modelului:', error);
      throw error;
    }
  }
  
  // Încărcarea modelului din localStorage cu verificări mai bune
  async loadModel() {
    const modelJson = localStorage.getItem('calorieRecommendationModel');
    const normValues = localStorage.getItem('normalizationValues');
    
    if (!modelJson || !normValues) {
      throw new Error('Nu există model salvat');
    }
    
    try {
      // Restaurăm modelul
      const modelData = JSON.parse(modelJson);
      this.model = await tf.models.modelFromJSON(modelData);
      
      // Restaurăm valorile de normalizare
      const normalizationValues = JSON.parse(normValues);
      
      // Verificăm dacă avem toate valorile necesare
      if (!normalizationValues.inputMin || !normalizationValues.inputMax ||
          !normalizationValues.outputMin || !normalizationValues.outputMax) {
        throw new Error('Valorile de normalizare sunt incomplete');
      }
      
      this.inputMin = tf.tensor1d(normalizationValues.inputMin);
      this.inputMax = tf.tensor1d(normalizationValues.inputMax);
      this.outputMin = tf.tensor1d(normalizationValues.outputMin);
      this.outputMax = tf.tensor1d(normalizationValues.outputMax);
      this.isUsingRealData = normalizationValues.isUsingRealData || false;
      
      console.log('Model și valori de normalizare încărcate cu succes');
      return this.model;
    } catch (error) {
      console.error('Eroare la încărcarea modelului:', error);
      
      // Curățăm localStorage-ul în caz de date corupte
      localStorage.removeItem('calorieRecommendationModel');
      localStorage.removeItem('normalizationValues');
      
      throw new Error(`Eroare la încărcarea modelului: ${error.message}`);
    }
  }
  
  // Date de antrenare sintetice pentru început
  generateSyntheticTrainingData(numSamples = 200) {
    const inputData = [];
    const outputData = [];
    
    // Generăm date sintetice bazate pe formule comune pentru calculul caloriilor
    for (let i = 0; i < numSamples; i++) {
      // Generăm caracteristici aleatorii
      const sex = Math.random() > 0.5 ? 1 : 0; // 1 pentru masculin, 0 pentru feminin
      const age = 18 + Math.floor(Math.random() * 60); // 18-77 ani
      const height = 150 + Math.floor(Math.random() * 50); // 150-200 cm
      const weight = 50 + Math.floor(Math.random() * 70); // 50-120 kg
      const activityLevel = 1 + Math.floor(Math.random() * 5); // 1-5
      const weightGoal = weight * (0.8 + Math.random() * 0.4); // 80%-120% din greutatea actuală
      const targetRate = 0.2 + Math.random() * 0.8; // 0.2-1.0 kg pe săptămână
      
      // Calculăm BMR folosind ecuația Harris-Benedict
      let bmr;
      if (sex === 1) { // masculin
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else { // feminin
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Factori de activitate
      const activityFactors = [1.2, 1.375, 1.55, 1.725, 1.9];
      const tdee = bmr * activityFactors[activityLevel - 1];
      
      // Ajustăm caloriile în funcție de obiectiv
      const isWeightLoss = weightGoal < weight;
      const caloriesPerKg = 7700; // ~7700 calorii per kg de grăsime
      const dailyCalorieAdjustment = (targetRate * caloriesPerKg) / 7;
      
      // Calculăm recomandarea calorică
      const recommendedCalories = isWeightLoss
        ? tdee - dailyCalorieAdjustment
        : tdee + dailyCalorieAdjustment;
      
      // Adăugăm un pic de variație aleatorie pentru a face datele mai realiste
      const caloriesWithNoise = recommendedCalories * (0.95 + Math.random() * 0.1);
      
      // Adăugăm în setul de date
      inputData.push([age, height, weight, sex, activityLevel, weightGoal, targetRate]);
      outputData.push([Math.round(caloriesWithNoise)]);
    }
    
    return {
      inputs: inputData,
      outputs: outputData
    };
  }
}

export default CalorieRecommendationModel;