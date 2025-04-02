import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title || 'Confirmare ștergere'}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="modal-body">
          <p>{message || 'Ești sigur că vrei să ștergi acest element?'}</p>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="cancel-modal-button"
            disabled={isLoading}
          >
            Anulează
          </button>
          
          <button
            onClick={onConfirm}
            className="confirm-delete-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se șterge...' : 'Șterge'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;