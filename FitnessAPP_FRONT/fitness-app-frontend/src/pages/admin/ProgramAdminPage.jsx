/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import ProgramAdminTable from '../../components/admin/ProgramAdminTable';
import ProgramForm from '../../components/admin/ProgramForm';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programService';
import './ProgramAdminPage.css';

const ProgramAdminPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    setError('');
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setIsFormVisible(true);
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
      } else {
        // Creare program nou
        response = await createProgram(programData);
        setSuccess(`Programul "${programData.name}" a fost creat cu succes!`);
      }
      
      // Actualizare listă de programe
      await fetchPrograms();
      
      // Închide formularul
      setIsFormVisible(false);
      setSelectedProgram(null);
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

  return (
    <div className="program-admin-page">
      <Navbar />
      
      <div className="program-admin-content">
        <h1>Administrare Programe</h1>
        <p className="subtitle">Adaugă, modifică sau șterge programele de fitness disponibile pentru utilizatori.</p>
        
        {/* Mesaje de succes/eroare */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* Buton de adăugare program nou */}
        {!isFormVisible && (
          <div className="admin-actions">
            <button 
              className="add-program-button"
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
        <ProgramAdminTable 
          programs={programs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
        
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