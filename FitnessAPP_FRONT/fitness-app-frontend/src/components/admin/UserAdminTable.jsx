import React, { useState } from 'react';
import './UserAdminTable.css';

const UserAdminTable = ({ users, onEdit, onDelete, onResetPassword, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'admin', 'user'

  // Filtrare utilizatori
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.role.toLowerCase() === filter;
  });

  // Sortare utilizatori după ID (cel mai nou primul)
  const sortedUsers = [...filteredUsers].sort((a, b) => b.id - a.id);

  return (
    <div className="user-admin-table-container">
      <div className="table-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Caută după nume sau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <label>Filtrează după rol:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Toți utilizatorii</option>
            <option value="admin">Administratori</option>
            <option value="user">Utilizatori obișnuiți</option>
          </select>
        </div>
      </div>
      
      <table className="user-admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume utilizator</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Profil</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="loading-cell">
                <div className="loading-spinner-small"></div>
                Se încarcă utilizatorii...
              </td>
            </tr>
          ) : sortedUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-table-message">
                {searchTerm || filter !== 'all' 
                  ? 'Nu există utilizatori care să corespundă criteriilor de căutare.'
                  : 'Nu există utilizatori în sistem.'}
              </td>
            </tr>
          ) : (
            sortedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.profile ? (
                    <span className="profile-badge has-profile">Da</span>
                  ) : (
                    <span className="profile-badge no-profile">Nu</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-button edit-button"
                    onClick={() => onEdit(user)}
                    title="Editează utilizator"
                  >
                    <i className="icon-edit"></i>
                  </button>
                  
                  <button 
                    className="action-button password-button"
                    onClick={() => onResetPassword(user)}
                    title="Resetează parola"
                  >
                    <i className="icon-key"></i>
                  </button>
                  
                  <button 
                    className="action-button delete-button"
                    onClick={() => onDelete(user)}
                    title="Șterge utilizator"
                  >
                    <i className="icon-delete"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdminTable;