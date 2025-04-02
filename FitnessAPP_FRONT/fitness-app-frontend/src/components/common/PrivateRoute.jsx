import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Componentă pentru a proteja rutele care necesită autentificare
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isLoggedIn, currentUser } = useAuth();
  
  // Verifică dacă utilizatorul este autentificat
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  // Dacă este necesară o anumită rolă și utilizatorul nu o are
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  // Returneză componenta dacă toate condițiile sunt îndeplinite
  return children;
};

export default PrivateRoute;