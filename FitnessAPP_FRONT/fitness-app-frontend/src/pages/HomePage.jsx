/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import './HomePage.css';

// Importurile pentru imaginile cardurilor
// Notă: Acestea trebuie să existe în directorul public/images sau să fie importate ca module
// Dacă folosești importuri de module, declară-le la începutul fișierului

const HomePage = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  // Calea către imagini presupunând că sunt în directorul public
  const imagesPath = {
    programs: '/images/programs.jpg',
    analysis: '/images/analysis.jpg',
    recipes: '/images/recipes.jpg'
  };

  // Fallback pentru imagini (în cazul în care imaginile lipsesc)
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg'; // Imagine placeholder
  };

  return (
    <div className="homepage-container">
      {/* Navbar-ul orizontal */}
      <Navbar />
      
      <div className="homepage-content">
        <h1>Bine ai venit pe Fitness App!</h1>
        <p>Platforma pentru un stil de viață sănătos și activ.</p>
        
        <div className="feature-cards">
          {/* Card pentru Programe */}
          <div 
            className="feature-card"
            onClick={() => navigate('/programs')}
          >
            <img 
              src={imagesPath.programs} 
              alt="Programe Personalizate" 
              className="card-image"
              onError={handleImageError}
            />
            <div className="card-overlay">
              <h3>Programe Personalizate</h3>
              <button className="card-button">
                Vezi Programe
              </button>
            </div>
          </div>
          
          {/* Card pentru Analiză */}
          <div 
            className="feature-card"
            onClick={() => navigate(isLoggedIn ? '/analysis' : '/login')}
          >
            <img 
              src={imagesPath.analysis} 
              alt="Analiză Personalizată" 
              className="card-image"
              onError={handleImageError}
            />
            <div className="card-overlay">
              <h3>Analiză Personalizată</h3>
              <button className="card-button">
                {isLoggedIn ? 'Analizează Profilul' : 'Autentifică-te'}
              </button>
            </div>
          </div>
          
          {/* Card pentru Rețete */}
          <div 
            className="feature-card"
            onClick={() => navigate(isLoggedIn ? '/recipes' : '/login')}
          >
            <img 
              src={imagesPath.recipes} 
              alt="Recomandări de Rețete" 
              className="card-image"
              onError={handleImageError}
            />
            <div className="card-overlay">
              <h3>Recomandări de Rețete</h3>
              <button className="card-button">
                {isLoggedIn ? 'Vezi Rețete' : 'Autentifică-te'}
              </button>
            </div>
          </div>
        </div>
        
        {isLoggedIn && (
          <div className="welcome-back">
            <h2>Bine ai revenit, {currentUser.username}!</h2>
            <p>Continuă de unde ai rămas.</p>
            <div className="welcome-actions">
              <button onClick={() => navigate('/profile')}>
                Profilul Meu
              </button>
              <button onClick={() => navigate('/analysis')} className="analysis-button">
                Analiză Personalizată
              </button>
              <button onClick={() => navigate('/recipes')} className="recipes-button">
                Recomandări Rețete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;