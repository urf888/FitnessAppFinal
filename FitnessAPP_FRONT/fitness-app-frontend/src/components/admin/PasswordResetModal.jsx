import React, { useState } from 'react';
import './PasswordResetModal.css';

const PasswordResetModal = ({ isOpen, onClose, onConfirm, title, user, isLoading }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleResetPassword = () => {
    // Validare
    if (!newPassword) {
      setError('Te rugăm să introduci o parolă nouă.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Parolele nu coincid.');
      return;
    }

    // Verificare lungime minimă
    if (newPassword.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere.');
      return;
    }

    // Trimite parola nouă
    onConfirm(newPassword);
  };

  // Curăță starea la închiderea modalului
  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title || 'Resetare parolă'}</h3>
          <button onClick={handleClose} className="close-button">&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Introduceți o nouă parolă pentru utilizatorul <strong>{user.username}</strong>.</p>
          
          <div className="form-group">
            <label htmlFor="newPassword">Parolă nouă <span className="required">*</span></label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Introduceți parola nouă"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmă parola <span className="required">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmați parola nouă"
              required
            />
          </div>
          
          {error && <div className="error-message-small">{error}</div>}
        </div>
        
        <div className="modal-footer">
          <button
            onClick={handleClose}
            className="cancel-modal-button"
            disabled={isLoading}
          >
            Anulează
          </button>
          
          <button
            onClick={handleResetPassword}
            className="confirm-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se procesează...' : 'Resetează Parola'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;