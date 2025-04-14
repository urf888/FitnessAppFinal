import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Pagini publice
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';

// Pagini protejate pentru utilizatori
import ProfilePage from './pages/ProfilePage';
import FitnessAnalysisPage from './pages/FitnessAnalysisPage';
import RecipeRecommendationPage from './pages/RecipeRecommendationPage';
import PersonalizedRecommendationPage from './pages/PersonalizedRecommendationPage';
import RecommendationPage from './pages/RecommendationPage'; // Pagina de recomandare AI
import AIRecipePage from './pages/AIRecipePage';
import RecipesPage from './pages/RecipesPage';

// Pagini de administrare
import ProgramAdminPage from './pages/admin/ProgramAdminPage';
import UserAdminPage from './pages/admin/UserAdminPage';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            {/* Rute publice */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            
            {/* Rute protejate pentru utilizatori autentificați */}
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/analysis" element={
              <PrivateRoute>
                <FitnessAnalysisPage />
              </PrivateRoute>
            } />
            <Route path="/recipes" element={
              <PrivateRoute>
                <RecipeRecommendationPage />
              </PrivateRoute>
            } />
            <Route path="/recipes-2" element={
              <PrivateRoute>
                <RecipesPage />
              </PrivateRoute>
            } />
            {/* Noua rută pentru pagina de rețete AI */}
            <Route path="/ai-recipes" element={
              <PrivateRoute>
                <AIRecipePage />
              </PrivateRoute>
            } />
            <Route path="/recommendations" element={
              <PrivateRoute>
                <PersonalizedRecommendationPage />
              </PrivateRoute>
            } />
            {/* Ruta pentru recomandările de programe bazate pe AI */}
            <Route path="/ai-programs" element={
              <PrivateRoute>
                <RecommendationPage />
              </PrivateRoute>
            } />
            
            
            {/* Rute protejate pentru administratori */}
            <Route path="/admin/programs" element={
              <PrivateRoute requiredRole="admin">
                <ProgramAdminPage />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute requiredRole="admin">
                <UserAdminPage />
              </PrivateRoute>
            } />
            
            {/* Rută pentru redirecționare în cazul unei adrese inexistente */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
    
    </AuthProvider>
  );
}

export default App;