import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ user, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    id: 0,
    username: '',
    email: '',
    password: '', // Doar pentru resetare, nu se încarcă din user existent
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validare
    if (!formData.username || !formData.email || !formData.role) {
      alert('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }
    
    // Construim obiectul de utilizator pentru actualizare
    const userData = {
      ...formData
    };
    
    // Dacă parola este goală, o excludem din obiect
    if (!formData.password) {
      delete userData.password;
    }
    
    onSave(userData);
  };

  return (
    <div className="user-form-container">
      <h2>Editare Utilizator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Nume Utilizator <span className="required">*</span></label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nume utilizator"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email utilizator"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Parolă nouă (lăsați gol pentru a păstra parola actuală)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Introduceți o parolă nouă"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Rol <span className="required">*</span></label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Utilizator obișnuit</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            Anulează
          </button>
          
          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Se salvează...' : 'Salvează Modificările'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;