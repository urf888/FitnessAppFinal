import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import ProgramAdminTable from '../../components/admin/ProgramAdminTable';
import ProgramForm from '../../components/admin/ProgramForm';
import WorkoutDayManager from '../../components/program/WorkoutDayManager';
import ExerciseWorkoutManager from '../../components/program/ExerciseWorkoutManager';
import ExerciseManager from '../../components/program/ExerciseManager';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programService';
import './ProgramAdminPage.css';

const ProgramAdminPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeView, setActiveView] = useState('programs'); // 'programs', 'exercises', 'workoutDays', 'workoutExercises'
  const [showSuccessOptions, setShowSuccessOptions] = useState(false); // Opțiuni după creare/editare cu succes
  
  // Încărcare programe la montarea componentei
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllPrograms();
      setPrograms(data);
    } catch (error) {
      setError('Nu am putut încărca programele. Te rugăm să încerci din nou.');
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedProgram(null);
    setIsFormVisible(true);
    setShowSuccessOptions(false);
    setSuccess('');
    setError('');
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setIsFormVisible(true);
    setShowSuccessOptions(false);
    setSuccess('');
    setError('');
  };

  const handleDelete = (id) => {
    const programToDelete = programs.find(p => p.id === id);
    setProgramToDelete(programToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedProgram(null);
  };

  const handleFormSave = async (programData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      
      if (programData.id) {
        // Actualizare program existent
        response = await updateProgram(programData.id, programData);
        setSuccess(`Programul "${programData.name}" a fost actualizat cu succes!`);
        setSelectedProgram(response);
      } else {
        // Creare program nou
        response = await createProgram(programData);
        setSuccess(`Programul "${programData.name}" a fost creat cu succes!`);
        setSelectedProgram(response);
      }
      
      // Actualizare listă de programe
      await fetchPrograms();
      
      // Afișăm opțiunile pentru pașii următori
      setShowSuccessOptions(true);
    } catch (error) {
      setError('Eroare la salvarea programului. Verifică datele și încearcă din nou.');
      console.error('Error saving program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;
    
    setIsLoading(true);
    
    try {
      await deleteProgram(programToDelete.id);
      
      // Actualizare listă de programe
      await fetchPrograms();
      
      setSuccess(`Programul "${programToDelete.name}" a fost șters cu succes!`);
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (error) {
      setError('Eroare la ștergerea programului. Te rugăm să încerci din nou.');
      console.error('Error deleting program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProgramToDelete(null);
  };

  // Gestionare zile de antrenament
  const handleManageWorkoutDays = (program) => {
    setSelectedProgram(program);
    setActiveView('workoutDays');
    setIsFormVisible(false);
    setShowSuccessOptions(false);
    setSuccess('');
    setError('');
  };

  // Gestionare exerciții în zi de antrenament
  const handleManageWorkoutExercises = (workoutDay) => {
    setSelectedWorkoutDay(workoutDay);
    setActiveView('workoutExercises');
    setSuccess('');
    setError('');
  };

  // Afișare secțiune pentru exerciții
  const handleShowExercises = () => {
    setActiveView('exercises');
    setSelectedProgram(null);
    setSelectedWorkoutDay(null);
    setIsFormVisible(false);
    setShowSuccessOptions(false);
    setSuccess('');
    setError('');
  };

  // Înapoi la lista de programe
  const handleBackToPrograms = () => {
    setActiveView('programs');
    setSelectedProgram(null);
    setSelectedWorkoutDay(null);
    setIsFormVisible(false);
    setShowSuccessOptions(false);
    setSuccess('');
    setError('');
  };

  // Înapoi la zilele de antrenament
  const handleBackToWorkoutDays = () => {
    setActiveView('workoutDays');
    setSelectedWorkoutDay(null);
    setSuccess('');
    setError('');
  };

  // Renderăm breadcrumbs pentru navigare
  const renderBreadcrumbs = () => {
    if (activeView === 'workoutDays' && selectedProgram) {
      return (
        <div className="breadcrumbs">
          <button onClick={handleBackToPrograms} className="breadcrumb-link">
            Programe
          </button>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">{selectedProgram.name} - Zile de Antrenament</span>
        </div>
      );
    }
    
    if (activeView === 'workoutExercises' && selectedWorkoutDay) {
      return (
        <div className="breadcrumbs">
          <button onClick={handleBackToPrograms} className="breadcrumb-link">
            Programe
          </button>
          <span className="breadcrumb-separator"> / </span>
          <button onClick={handleBackToWorkoutDays} className="breadcrumb-link">
            {selectedProgram?.name} - Zile de Antrenament
          </button>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">{selectedWorkoutDay.name} - Exerciții</span>
        </div>
      );
    }
    
    return null;
  };

  // Renderăm opțiunile după salvarea cu succes a unui program
  const renderSuccessOptions = () => {
    if (!showSuccessOptions || !selectedProgram) return null;
    
    return (
      <div className="success-options">
        <p>Ce dorești să faci în continuare?</p>
        <div className="success-buttons">
          <button 
            className="option-button continue-editing"
            onClick={() => setShowSuccessOptions(false)}
          >
            Continuă editarea programului
          </button>
          <button 
            className="option-button manage-workout-days"
            onClick={() => handleManageWorkoutDays(selectedProgram)}
          >
            Administrează zilele de antrenament
          </button>
          <button 
            className="option-button back-to-list"
            onClick={handleBackToPrograms}
          >
            Înapoi la lista de programe
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="program-admin-page">
      <Navbar />
      
      <div className="program-admin-content">
        <h1>Administrare Programe</h1>
        <p className="subtitle">Adaugă, modifică sau șterge programele de fitness disponibile pentru utilizatori.</p>
        
        {/* Tab-uri pentru navigarea între secțiuni */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeView === 'programs' ? 'active' : ''}`}
            onClick={handleBackToPrograms}
          >
            Programe
          </button>
          <button 
            className={`tab-button ${activeView === 'exercises' ? 'active' : ''}`}
            onClick={handleShowExercises}
          >
            Exerciții
          </button>
          
          {/* Breadcrumbs pentru navigare contextuală */}
          {renderBreadcrumbs()}
        </div>
        
        {/* Mesaje de eroare/succes */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* Opțiuni după salvare cu succes */}
        {renderSuccessOptions()}
        
        {/* Conținut principal în funcție de secțiunea activă */}
        {activeView === 'programs' && (
          <>
            {/* Buton de adăugare program nou */}
            {!isFormVisible && (
              <div className="admin-actions">
                <button 
                  className="add-button"
                  onClick={handleAddNew}
                >
                  <i className="icon-add"></i> Adaugă Program Nou
                </button>
              </div>
            )}
            
            {/* Formular pentru adăugare/editare program */}
            {isFormVisible && (
              <ProgramForm 
                program={selectedProgram}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
                isLoading={isLoading}
              />
            )}
            
            {/* Tabel programe */}
            {!isFormVisible && (
              <ProgramAdminTable 
                programs={programs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageWorkoutDays={handleManageWorkoutDays}
                isLoading={isLoading}
              />
            )}
          </>
        )}
        
        {/* Secțiunea pentru administrarea exercițiilor */}
        {activeView === 'exercises' && (
          <ExerciseManager />
        )}
        
        {/* Secțiunea pentru administrarea zilelor de antrenament */}
        {activeView === 'workoutDays' && selectedProgram && (
          <WorkoutDayManager 
            programId={selectedProgram.id}
            onBack={handleBackToPrograms}
            onManageExercises={handleManageWorkoutExercises}
          />
        )}
        
        {/* Secțiunea pentru administrarea exercițiilor într-o zi de antrenament */}
        {activeView === 'workoutExercises' && selectedWorkoutDay && (
          <ExerciseWorkoutManager 
            workoutDayId={selectedWorkoutDay.id}
            onBack={handleBackToWorkoutDays}
          />
        )}
        
        {/* Modal confirmare ștergere */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Confirmare ștergere program"
          message={programToDelete ? `Ești sigur că dorești să ștergi programul "${programToDelete.name}"? Această acțiune nu poate fi anulată.` : ''}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProgramAdminPage;