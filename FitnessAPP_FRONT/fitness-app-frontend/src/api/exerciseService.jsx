import api from './axiosConfig';

// Get all exercises
export const getAllExercises = async () => {
  try {
    const response = await api.get('/api/exercise');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get exercise by ID
export const getExerciseById = async (id) => {
  try {
    const response = await api.get(`/api/exercise/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get exercises by category
export const getExercisesByCategory = async (category) => {
  try {
    const response = await api.get(`/api/exercise?category=${category}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get exercises by difficulty level
export const getExercisesByDifficulty = async (difficulty) => {
  try {
    const response = await api.get(`/api/exercise?difficulty=${difficulty}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get exercises by equipment type
export const getExercisesByEquipment = async (equipment) => {
  try {
    const response = await api.get(`/api/exercise?equipment=${equipment}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Functions for administrators

export const createExercise = async (exerciseData) => {
  try {
    const response = await api.post('/api/exercise', exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await api.put(`/api/exercise/${id}`, exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await api.delete(`/api/exercise/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};