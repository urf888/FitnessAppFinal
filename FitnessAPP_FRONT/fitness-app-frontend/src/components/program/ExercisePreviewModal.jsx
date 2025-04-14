import React from 'react';
import './ExercisePreviewModal.css';

const ExercisePreviewModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="exercise-preview-overlay" onClick={onClose}>
      <div className="exercise-preview-content" onClick={(e) => e.stopPropagation()}>
        <div className="exercise-preview-header">
          <h2>{exercise.name}</h2>
          <span className={`difficulty-badge ${exercise.difficultyLevel}`}>
            {exercise.difficultyLevel}
          </span>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="exercise-preview-body">
          {exercise.imageUrl && (
            <div className="exercise-image">
              <img src={exercise.imageUrl} alt={exercise.name} />
            </div>
          )}

          <div className="exercise-details">
            <div className="detail-section">
              <h3>Detalii</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Categorie:</span>
                  <span className="detail-value">{exercise.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mușchi țintă:</span>
                  <span className="detail-value">{exercise.targetMuscles}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mușchi secundari:</span>
                  <span className="detail-value">{exercise.secondaryMuscles || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Echipament:</span>
                  <span className="detail-value">{exercise.equipment}</span>
                </div>
              </div>
            </div>

            {exercise.description && (
              <div className="description-section">
                <h3>Descriere</h3>
                <p>{exercise.description}</p>
              </div>
            )}

            {exercise.instructions && (
              <div className="instructions-section">
                <h3>Instrucțiuni</h3>
                <p>{exercise.instructions}</p>
              </div>
            )}

            {exercise.videoUrl && (
              <div className="video-section">
                <h3>Video demonstrativ</h3>
                <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                  Vezi video
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="exercise-preview-footer">
          <button className="close-preview-button" onClick={onClose}>Închide</button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePreviewModal;