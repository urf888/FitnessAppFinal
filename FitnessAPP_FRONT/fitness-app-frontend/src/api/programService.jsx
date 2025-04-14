import api from './axiosConfig';

// Get all fitness programs
export const getAllPrograms = async () => {
  try {
    const response = await api.get('/api/program');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get program by ID with optional inclusion of workout days
export const getProgramById = async (id, includeWorkouts = false) => {
  try {
    const response = await api.get(`/api/program/${id}?includeWorkouts=${includeWorkouts}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get filtered programs
export const getFilteredPrograms = async (gender = null, diet = null, programType = null, difficultyLevel = null, ageMin = null, ageMax = null) => {
  try {
    let url = '/api/program?';
    
    if (gender && gender !== 'all') url += `gender=${gender}&`;
    if (diet && diet !== 'all') url += `diet=${diet}&`;
    if (programType && programType !== 'all') url += `programType=${programType}&`;
    if (difficultyLevel && difficultyLevel !== 'all') url += `difficultyLevel=${difficultyLevel}&`;
    if (ageMin) url += `ageMin=${ageMin}&`;
    if (ageMax) url += `ageMax=${ageMax}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get workout days for a program
export const getWorkoutDaysForProgram = async (programId) => {
  try {
    const response = await api.get(`/api/program/${programId}/WorkoutDays`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get workout day by ID
export const getWorkoutDayById = async (id, includeExercises = false) => {
  try {
    const response = await api.get(`/api/program/WorkoutDay/${id}?includeExercises=${includeExercises}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Funcții pentru administratori

export const createProgram = async (programData) => {
  try {
    const response = await api.post('/api/program', programData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProgram = async (id, programData) => {
  try {
    const response = await api.put(`/api/program/${id}`, programData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProgram = async (id) => {
  try {
    const response = await api.delete(`/api/program/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Workout Day Management - funcții noi adăugate
export const addWorkoutDayToProgram = async (programId, workoutDayData) => {
  try {
    const response = await api.post(`/api/program/${programId}/WorkoutDay`, workoutDayData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateWorkoutDay = async (id, workoutDayData) => {
  try {
    const response = await api.put(`/api/program/WorkoutDay/${id}`, workoutDayData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteWorkoutDay = async (id) => {
  try {
    const response = await api.delete(`/api/program/WorkoutDay/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Exercise Management in Workout Days - funcții noi adăugate
export const addExerciseToWorkoutDay = async (workoutDayId, exerciseWorkoutData) => {
  try {
    const response = await api.post(`/api/program/WorkoutDay/${workoutDayId}/Exercise`, exerciseWorkoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateExerciseWorkout = async (id, exerciseWorkoutData) => {
  try {
    const response = await api.put(`/api/program/ExerciseWorkout/${id}`, exerciseWorkoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteExerciseFromWorkoutDay = async (id) => {
  try {
    const response = await api.delete(`/api/program/ExerciseWorkout/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};