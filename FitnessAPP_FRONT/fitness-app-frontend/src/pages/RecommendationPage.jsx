import React, { useState, useEffect } from 'react';
import { getPersonalizedProgram, getRecommendedPrograms } from '../api/recommendationService';
import Navbar from '../components/layout/Navbar';
import { FaDumbbell, FaCalendarAlt, FaClock, FaStar, FaMagic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './RecommendationPage.css';

const RecommendationPage = () => {
  const [personalizedProgram, setPersonalizedProgram] = useState(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isGeneratingProgram, setIsGeneratingProgram] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true);
      const programs = await getRecommendedPrograms(3);
      setRecommendedPrograms(programs);
    } catch (error) {
      toast.error('Nu am putut încărca recomandările: ' + (error.toString() || 'Eroare necunoscută'));
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const generatePersonalizedProgram = async () => {
    try {
      setIsGeneratingProgram(true);
      
      toast.info('Generăm un program personalizat pentru tine. Acest proces poate dura până la 1 minut...', {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        toastId: 'generating-program'
      });
      
      const program = await getPersonalizedProgram();
      setPersonalizedProgram(program);
      
      toast.dismiss('generating-program');
      toast.success('Program personalizat generat cu succes!');
    } catch (error) {
      toast.dismiss('generating-program');
      toast.error('Nu s-a putut genera programul personalizat: ' + (error.toString() || 'Eroare necunoscută'));
    } finally {
      setIsGeneratingProgram(false);
    }
  };

  const viewProgramDetails = (programId) => {
    window.location.href = `/programs/${programId}`;
  };

  const mapProgramTypeToText = (type) => {
    switch(type) {
      case 'slabit': return 'Slăbire';
      case 'masa': return 'Masă musculară';
      default: return 'Tonifiere';
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="recommendation-container">
        <div className="page-title">
          <h1><FaMagic /> Programe de Fitness Personalizate cu AI</h1>
          <p>
            Obține un program de fitness generat de inteligența artificială, adaptat perfect pentru profilul, 
            obiectivele și nevoile tale specifice.
          </p>
        </div>
        
        {/* Secțiune pentru program personalizat */}
        <div className="personal-program-section">
          <div className="section-header personal-program-header">
            <h2><FaStar /> Program Personalizat cu AI</h2>
            <p>Un program creat special pentru tine bazat pe profilul tău complet</p>
          </div>
          
          <div className="section-content">
            {personalizedProgram ? (
              <div className="program-card">
                <div className="program-card-content">
                  <h3>{personalizedProgram.name}</h3>
                  <div className="program-meta">
                    <span className="program-meta-item">
                      <FaCalendarAlt />
                      {personalizedProgram.durationWeeks} săptămâni
                    </span>
                    <span className="program-meta-item">
                      <FaClock />
                      {personalizedProgram.workoutsPerWeek} antrenamente/săptămână
                    </span>
                    <span className="program-meta-item">
                      <FaDumbbell />
                      {personalizedProgram.difficultyLevel}
                    </span>
                  </div>
                  
                  <p className="program-description">{personalizedProgram.description}</p>
                  
                  <div className="program-tags">
                    <span className="program-tag type">
                      {mapProgramTypeToText(personalizedProgram.programType)}
                    </span>
                    <span className="program-tag diet">
                      {personalizedProgram.diet}
                    </span>
                    <span className="program-tag gender">
                      {personalizedProgram.gender}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => viewProgramDetails(personalizedProgram.id)}
                    className="view-button primary"
                  >
                    Vezi Detalii Program
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                {isGeneratingProgram ? (
                  <div>
                    <div className="spinner"></div>
                    <h3>Creăm un program unic pentru tine!</h3>
                    <p>Acest proces poate dura până la un minut.</p>
                  </div>
                ) : (
                  <div>
                    <div className="empty-state-icon">
                      <FaMagic />
                    </div>
                    <h3>Niciun program personalizat generat încă</h3>
                    <p>
                      Apasă butonul pentru a obține un program personalizat creat de AI, 
                      bazat pe profilul tău, obiectivele și preferințele tale.
                    </p>
                    <button
                      onClick={generatePersonalizedProgram}
                      disabled={isGeneratingProgram}
                      className="generate-button"
                    >
                      Generează Program Personalizat
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Secțiune pentru programe recomandate */}
        <div className="personal-program-section">
          <div className="section-header recommended-programs-header">
            <h2>Programe Recomandate pentru Tine</h2>
            <p>
              Programe care se potrivesc cel mai bine cu profilul tău și obiectivele tale
            </p>
          </div>
          
          <div className="section-content">
            {isLoadingRecommendations ? (
              <div className="empty-state">
                <div className="spinner"></div>
              </div>
            ) : recommendedPrograms.length > 0 ? (
              <div className="programs-grid">
                {recommendedPrograms.map(program => (
                  <div key={program.id} className="program-card">
                    <div className="program-card-content">
                      <h3>{program.name}</h3>
                      <div className="program-meta">
                        <span className="program-meta-item">
                          <FaCalendarAlt />
                          {program.durationWeeks} săptămâni
                        </span>
                        <span className="program-meta-item">
                          <FaDumbbell />
                          {program.difficultyLevel}
                        </span>
                      </div>
                      
                      <p className="program-description">{program.description.substring(0, 100)}...</p>
                      
                      <div className="program-tags">
                        <span className="program-tag type">
                          {mapProgramTypeToText(program.programType)}
                        </span>
                        <span className="program-tag diet">
                          {program.diet}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => viewProgramDetails(program.id)}
                        className="view-button secondary"
                      >
                        Vezi Detalii
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Nu am găsit programe recomandate</h3>
                <p>
                  Completează-ți profilul cu mai multe informații pentru recomandări mai bune.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Secțiune informativă */}
        <div className="personal-program-section">
          <div className="section-header info-section-header">
            <h2>Cum funcționează?</h2>
          </div>
          
          <div className="section-content">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3>1. Analizăm Profilul Tău</h3>
                <p>
                  Sistemul nostru de AI analizează profilul tău complet, inclusiv vârsta, greutatea, 
                  nivelul de experiență și obiectivele tale fitness.
                </p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3>2. Generăm Soluții Personalizate</h3>
                <p>
                  Algoritmul nostru avansează creează un program complet personalizat, 
                  selectând exerciții potrivite nivelului tău și obiectivelor specifice.
                </p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3>3. Primești Programul Complet</h3>
                <p>
                  Primești instant un program detaliat cu zile de antrenament, 
                  exerciții, seturi, repetări și recomandări specifice pentru tine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;