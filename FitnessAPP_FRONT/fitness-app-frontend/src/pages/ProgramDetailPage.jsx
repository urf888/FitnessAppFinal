import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { getProgramById } from '../api/programService';
import './ProgramDetailPage.css';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getProgramById(id);
      setProgram(data);
    } catch (error) {
      setError('Nu am putut încărca detaliile programului. Te rugăm să încerci din nou.');
      console.error('Error fetching program details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determinăm clasele CSS pe baza tipului de program
  const getProgramClasses = () => {
    if (!program) return '';
    
    let typeClass = '';
    switch (program.programType.toLowerCase()) {
      case 'slabit':
        typeClass = 'program-slabit';
        break;
      case 'masa musculara':
      case 'masa':
        typeClass = 'program-masa';
        break;
      case 'fit':
        typeClass = 'program-fit';
        break;
      default:
        typeClass = '';
    }
    
    return typeClass;
  };

  return (
    <div className="program-detail-page">
      <Navbar />
      
      <div className="program-detail-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Se încarcă detaliile programului...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={fetchProgramDetails} className="retry-button">
                Încearcă din nou
              </button>
              <button onClick={() => navigate('/programs')} className="back-button">
                Înapoi la programe
              </button>
            </div>
          </div>
        ) : program ? (
          <div className={`program-detail-card ${getProgramClasses()}`}>
            <div className="program-header">
              <button onClick={() => navigate('/programs')} className="back-link">
                &larr; Înapoi la programe
              </button>
              <h1>{program.name}</h1>
              <div className="program-badges">
                <span className="program-badge gender-badge">{program.gender}</span>
                <span className="program-badge diet-badge">{program.diet}</span>
                <span className="program-badge type-badge">{program.programType}</span>
              </div>
            </div>
            
            <div className="program-detail-grid">
              <div className="program-image-section">
                <img 
                  src={program.imageUrl || '/placeholders/default-program.jpg'} 
                  alt={program.name} 
                  className="program-detail-image" 
                />
              </div>
              
              <div className="program-info-section">
                <div className="program-description">
                  <h2>Descriere</h2>
                  <p>{program.description || 'Nu există o descriere pentru acest program.'}</p>
                </div>
                
                <div className="program-ideal-for">
                  <h2>Ideal pentru</h2>
                  <ul>
                    <li>Persoane de gen: <strong>{program.gender}</strong></li>
                    <li>Cu dietă: <strong>{program.diet}</strong></li>
                    <li>Care doresc: <strong>{program.programType}</strong></li>
                  </ul>
                </div>
                
                <div className="program-actions">
                  <button className="enroll-button">Înscrie-te în program</button>
                  <button className="save-button">Salvează programul</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="not-found-container">
            <h2>Programul nu a fost găsit</h2>
            <p>Ne pare rău, programul pe care îl cauți nu există sau a fost șters.</p>
            <button onClick={() => navigate('/programs')} className="back-button">
              Înapoi la programe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;