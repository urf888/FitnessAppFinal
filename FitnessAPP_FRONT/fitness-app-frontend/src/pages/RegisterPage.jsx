import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validare
    if (password !== confirmPassword) {
      setError('Parolele nu coincid!');
      return;
    }
    
    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Înregistrare eșuată. Încearcă din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Înregistrare</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Nume utilizator</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Parolă</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmă parola</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="error-container">
              <p className="error-message">⚠️ {error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se încarcă...' : 'Înregistrare'}
          </button>
        </form>
        
        <div className="auth-link">
          <p>
            Ai deja cont? <Link to="/login">Conectează-te aici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;