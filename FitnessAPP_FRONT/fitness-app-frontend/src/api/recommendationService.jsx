import api from './axiosConfig';

/**
 * Obține un program de fitness personalizat, generat de AI
 * 
 * @returns {Promise} Promise care rezolvă la programul personalizat
 */
export const getPersonalizedProgram = async () => {
  try {
    const response = await api.get('/api/recommendation/personalized');
    return response.data;
  } catch (error) {
    console.error('Eroare la obținerea programului personalizat:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Obține lista de programe de fitness recomandate pentru utilizator
 * 
 * @param {number} count - Numărul de programe de returnat (implicit 3)
 * @returns {Promise} Promise care rezolvă la lista de programe recomandate
 */
export const getRecommendedPrograms = async (count = 3) => {
  try {
    const response = await api.get(`/api/recommendation?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Eroare la obținerea recomandărilor:', error);
    throw error.response?.data || error.message;
  }
};