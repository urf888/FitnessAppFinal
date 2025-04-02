import api from './axiosConfig';

export const getAllPrograms = async () => {
  try {
    const response = await api.get('/api/program');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProgramById = async (id) => {
  try {
    const response = await api.get(`/api/program/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFilteredPrograms = async (gender = null, diet = null, programType = null) => {
  try {
    let url = '/api/program?';
    
    if (gender && gender !== 'all') url += `gender=${gender}&`;
    if (diet && diet !== 'all') url += `diet=${diet}&`;
    if (programType && programType !== 'all') url += `programType=${programType}`;
    
    const response = await api.get(url);
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