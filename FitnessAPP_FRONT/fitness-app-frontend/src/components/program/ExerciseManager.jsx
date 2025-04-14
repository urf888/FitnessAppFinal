/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getAllExercises, getExerciseById, createExercise, updateExercise, deleteExercise } from '../../api/exerciseService';
import { addExerciseToWorkoutDay } from '../../api/programService';
import ExercisePreviewModal from './ExercisePreviewModal';
import './ExerciseManager.css';

const ExerciseManager = ({ workoutDay, onBack }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewExercise, setPreviewExercise] = useState(null);
  
  // Formular pentru exercițiu
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficultyLevel: 'intermediar',
    description: '',
    instructions: '',
    imageUrl: '',
    videoUrl: '',
    targetMuscles: '',
    secondaryMuscles: '',
    equipment: 'nici unul'
  });

  // Categorii de exerciții pentru filter și formular
  const exerciseCategories = [
    'piept', 'spate', 'picioare', 'umeri', 'brațe', 'abdomen', 'cardio', 'compus', 'altele'
  ];
  
  // Nivele de dificultate
  const difficultyLevels = ['începător', 'intermediar', 'avansat'];

  // Încărcăm exercițiile la montarea componentei
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllExercises();
      setExercises(data);
    } catch (error) {
      setError('Nu am putut încărca exercițiile. Te rugăm să încerci din nou.');
      console.error('Error fetching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedExercise(null);
    setFormData({
      name: '',
      category: '',
      difficultyLevel: 'intermediar',
      description: '',
      instructions: '',
      imageUrl: '',
      videoUrl: '',
      targetMuscles: '',
      secondaryMuscles: '',
      equipment: 'nici unul'
    });
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name,
      category: exercise.category,
      difficultyLevel: exercise.difficultyLevel,
      description: exercise.description,
      instructions: exercise.instructions,
      imageUrl: exercise.imageUrl || '',
      videoUrl: exercise.videoUrl || '',
      targetMuscles: exercise.targetMuscles,
      secondaryMuscles: exercise.secondaryMuscles,
      equipment: exercise.equipment
    });
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handlePreviewExercise = (exercise) => {
    setPreviewExercise(exercise);
  };

  const handleClosePreview = () => {
    setPreviewExercise(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ești sigur că dorești să ștergi acest exercițiu?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await deleteExercise(id);
      await fetchExercises();
      setSuccess('Exercițiul a fost șters cu succes!');
    } catch (error) {
      setError('Eroare la ștergerea exercițiului. Te rugăm să încerci din nou.');
      console.error('Error deleting exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWorkout = async (exercise) => {
    if (!workoutDay) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Creăm datele pentru noul exercițiu în ziua de antrenament
      const exerciseWorkoutData = {
        exerciseId: exercise.id,
        order: 1, // Implicit - va fi ajustat după adăugare
        sets: 3,  // Valori implicite
        reps: 10,
        restSeconds: 60
      };
      
      // Adăugăm exercițiul la ziua de antrenament
      await addExerciseToWorkoutDay(workoutDay.id, exerciseWorkoutData);
      
      setSuccess(`Exercițiul "${exercise.name}" a fost adăugat la antrenament cu succes!`);
      
      // Opțional: Întoarcem utilizatorul la pagina de exerciții pentru zi
      if (onBack) {
        setTimeout(() => onBack(), 1500);
      }
    } catch (error) {
      setError('Eroare la adăugarea exercițiului în antrenament. Te rugăm să încerci din nou.');
      console.error('Error adding exercise to workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      setError('Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (selectedExercise) {
        // Actualizare exercițiu existent
        const updatedExercise = {
          ...selectedExercise,
          ...formData
        };
        await updateExercise(selectedExercise.id, updatedExercise);
        setSuccess(`Exercițiul "${formData.name}" a fost actualizat cu succes!`);
      } else {
        // Creare exercițiu nou
        await createExercise(formData);
        setSuccess(`Exercițiul "${formData.name}" a fost adăugat cu succes!`);
      }
      
      // Actualizăm lista de exerciții
      await fetchExercises();
      
      // Închidem formularul
      setIsFormVisible(false);
    } catch (error) {
      setError('Eroare la salvarea exercițiului. Verifică datele și încearcă din nou.');
      console.error('Error saving exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedExercise(null);
  };

  // Filtrarea exercițiilor pe baza căutării și a categoriei
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === '' || exercise.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="exercise-manager">
      <div className="manager-header">
        <h2>{workoutDay ? 'Exerciții pentru Antrenament' : 'Administrare Exerciții'}</h2>
        
        {/* Buton pentru înapoi */}
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &larr; Înapoi
          </button>
        )}
      </div>
      
      {/* Mesaje de eroare/succes */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!isFormVisible ? (
        <div className="exercises-section">
          {/* Bară de căutare și filtrare */}
          <div className="search-filter-bar">
            <div className="search-input">
              <input
                type="text"
                placeholder="Caută exerciții..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Toate categoriile</option>
                {exerciseCategories.map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
            </div>
            
            {/* Buton pentru adăugare */}
            <button 
              className="add-button"
              onClick={handleAddNew}
              disabled={isLoading}
            >
              <i className="icon-add"></i> Adaugă Exercițiu
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-spinner">Se încarcă...</div>
          ) : filteredExercises.length === 0 ? (
            <div className="no-items">
              {searchQuery || filterCategory ? 'Nu am găsit exerciții care să corespundă criteriilor de căutare.' : 'Nu există exerciții adăugate.'}
            </div>
          ) : (
            <div className="exercises-grid">
              {filteredExercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-card-header">
                    <h3>{exercise.name}</h3>
                    <span className={`difficulty-badge ${exercise.difficultyLevel}`}>
                      {exercise.difficultyLevel}
                    </span>
                  </div>
                  
                  <div className="exercise-card-image">
                    {exercise.imageUrl ? (
                      <img src={exercise.imageUrl} alt={exercise.name} />
                    ) : (
                      <div className="placeholder-image">
                        <span>Fără imagine</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="exercise-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Categorie:</span>
                      <span className="detail-value">{exercise.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mușchi:</span>
                      <span className="detail-value">{exercise.targetMuscles}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Echipament:</span>
                      <span className="detail-value">{exercise.equipment}</span>
                    </div>
                  </div>
                  
                  <div className="exercise-card-actions">
                    <button 
                      className="preview-button"
                      onClick={() => handlePreviewExercise(exercise)}
                    >
                      Previzualizare
                    </button>
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(exercise)}
                    >
                      Editează
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(exercise.id)}
                    >
                      Șterge
                    </button>
                    {workoutDay && (
                      <button 
                        className="add-to-workout-button"
                        onClick={() => handleAddToWorkout(exercise)}
                      >
                        Adaugă la antrenament
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="exercise-form">
          <h3>{selectedExercise ? 'Editează Exercițiu' : 'Adaugă Exercițiu Nou'}</h3>
          
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nume <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Ex: Flotări"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Categorie <span className="required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selectează categorie</option>
                  {exerciseCategories.map(category => (
                    <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficultyLevel">Nivel de Dificultate</label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleFormChange}
                >
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="equipment">Echipament</label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleFormChange}
                  placeholder="Ex: gantere, bandă elastică, bara"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="targetMuscles">Mușchi Țintă</label>
                <input
                  type="text"
                  id="targetMuscles"
                  name="targetMuscles"
                  value={formData.targetMuscles}
                  onChange={handleFormChange}
                  placeholder="Ex: piept, triceps"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="secondaryMuscles">Mușchi Secundari</label>
                <input
                  type="text"
                  id="secondaryMuscles"
                  name="secondaryMuscles"
                  value={formData.secondaryMuscles}
                  onChange={handleFormChange}
                  placeholder="Ex: umeri, abdomen"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Descriere</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Descriere detaliată a exercițiului"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="instructions">Instrucțiuni</label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleFormChange}
                placeholder="Instrucțiuni pas cu pas pentru executarea corectă a exercițiului"
                rows={4}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="imageUrl">URL Imagine</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="videoUrl">URL Video</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleFormChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleFormCancel}
                disabled={isLoading}
              >
                Anulează
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={isLoading}
              >
                {isLoading ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de previzualizare */}
      {previewExercise && (
        <ExercisePreviewModal 
          exercise={previewExercise} 
          onClose={handleClosePreview} 
        />
      )}
    </div>
  );
};

export default ExerciseManager;