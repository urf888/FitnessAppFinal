import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1>Bine ai venit pe Fitness App!</h1>
        <p>Platforma pentru un stil de viață sănătos și activ.</p>
        
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Programe Personalizate</h3>
            <p>Descoperă programe adaptate nevoilor tale.</p>
            <button onClick={() => navigate('/programs')}>
              Vezi Programe
            </button>
          </div>
          
          <div className="feature-card">
            <h3>Profilul Tău</h3>
            <p>Creează-ți profilul și personalizează experiența.</p>
            <button onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}>
              {isLoggedIn ? 'Profilul Meu' : 'Autentificare'}
            </button>
          </div>
          
          <div className="feature-card">
            <h3>Analiză Personalizată</h3>
            <p>Obține recomandări de nutriție și prognoze ale progresului bazate pe AI.</p>
            <button onClick={() => navigate(isLoggedIn ? '/analysis' : '/login')}>
              Analizează Profilul Meu
            </button>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;