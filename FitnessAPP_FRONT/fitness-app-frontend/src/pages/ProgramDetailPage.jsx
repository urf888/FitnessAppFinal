import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import WorkoutDayCard from '../components/program/WorkoutDayCard';
import { getProgramById } from '../api/programService';
import './ProgramDetailPage.css';
import ProgramImage from '../components/program/ProgramImage';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' sau 'workoutPlan'

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Includem zilele de antrenament și exercițiile
      const data = await getProgramById(id, true);
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

  // Creează un array de zile ale săptămânii pentru planificare
  const weekDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

  // Organizează zilele de antrenament pe zile ale săptămânii
  const getWorkoutsByDay = () => {
    const workoutsByDay = [];
    
    if (program && program.workoutDays) {
      // Inițializăm array-ul cu 7 zile (1-7, unde 1 este Luni)
      for (let i = 1; i <= 7; i++) {
        const workoutsForDay = program.workoutDays.filter(workout => workout.dayOfWeek === i);
        workoutsByDay.push({
          dayNumber: i,
          dayName: weekDays[i-1],
          workouts: workoutsForDay
        });
      }
    }
    
    return workoutsByDay;
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
                <span className="program-badge difficulty-badge">{program.difficultyLevel}</span>
              </div>
            </div>
            
            <div className="program-tabs">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} 
                onClick={() => setActiveTab('overview')}
              >
                Prezentare generală
              </button>
              <button 
                className={`tab-button ${activeTab === 'workoutPlan' ? 'active' : ''}`} 
                onClick={() => setActiveTab('workoutPlan')}
              >
                Plan de antrenament
              </button>
            </div>
            
            {activeTab === 'overview' ? (
              <div className="program-detail-grid">
                <div className="program-image-section">
  <ProgramImage program={program} className="detail-page-image" />
</div>
                
                <div className="program-info-section">
                  <div className="program-description">
                    <h2>Descriere</h2>
                    <p>{program.description || 'Nu există o descriere pentru acest program.'}</p>
                  </div>
                  
                  <div className="program-goals">
                    <h2>Obiective</h2>
                    <p>{program.goals || 'Nu au fost specificate obiective pentru acest program.'}</p>
                  </div>
                  
                  <div className="program-specs">
                    <div className="spec-item">
                      <span className="spec-label">Durată:</span>
                      <span className="spec-value">{program.durationWeeks} săptămâni</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Antrenamente pe săptămână:</span>
                      <span className="spec-value">{program.workoutsPerWeek}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Nivel:</span>
                      <span className="spec-value">{program.difficultyLevel}</span>
                    </div>
                    {program.ageRangeMin && program.ageRangeMax && (
                      <div className="spec-item">
                        <span className="spec-label">Vârstă recomandată:</span>
                        <span className="spec-value">{program.ageRangeMin} - {program.ageRangeMax} ani</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="program-equipment">
                    <h2>Echipament necesar</h2>
                    <p>{program.requiredEquipment || 'Nu este specificat echipamentul necesar.'}</p>
                  </div>
                  
                  <div className="program-actions">
                    <button className="enroll-button">Înscrie-te în program</button>
                    <button className="save-button">Salvează programul</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="workout-plan-container">
                <h2>Planul de antrenament săptămânal</h2>
                
                <div className="workouts-instructions">
                  <div className="instruction-icon">ℹ️</div>
                  <div className="instruction-text">
                    Selectează o zi pentru a vedea exercițiile programate. Zilele cu antrenamente sunt marcate special.
                  </div>
                </div>
                
                <div className="vertical-schedule">
                  {getWorkoutsByDay().map((day) => (
                    <div key={day.dayNumber} className={`day-row ${day.workouts.length > 0 ? 'has-workouts' : ''}`}>
                      <div className="day-header">
                        <span>{day.dayName}</span>
                        {day.workouts.length > 0 && (
                          <span className="workout-count">{day.workouts.length} antrenament(e)</span>
                        )}
                      </div>
                      <div className="day-workouts">
                        {day.workouts.length > 0 ? (
                          day.workouts.map((workout) => (
                            <WorkoutDayCard key={workout.id} workoutDay={workout} />
                          ))
                        ) : (
                          <div className="rest-day">Zi de odihnă</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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