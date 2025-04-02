import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import UserAdminTable from '../../components/admin/UserAdminTable';
import UserForm from '../../components/admin/UserForm';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import PasswordResetModal from '../../components/admin/PasswordResetModal';
import { getAllUsers, updateUser, deleteUser, resetUserPassword, getUserStats } from '../../api/userAdminService';
import './AdminPages.css';

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    usersWithProfiles: 0,
    usersWithoutProfiles: 0
  });

  // Încărcare utilizatori la montarea componentei
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Nu am putut încărca utilizatorii. Te rugăm să încerci din nou.');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const stats = await getUserStats();
      console.log("User stats received:", stats); // Debugging
      
      // Convertim cheile din format Pascal Case (backend) în camelCase (frontend)
      setUserStats({
        totalUsers: stats.totalUsers || 0,
        adminUsers: stats.adminUsers || 0,
        regularUsers: stats.regularUsers || 0,
        usersWithProfiles: stats.usersWithProfiles || 0,
        usersWithoutProfiles: stats.usersWithoutProfiles || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Păstrăm statisticile implicite în caz de eroare
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormVisible(true);
    setSuccess('');
    setError('');
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handlePasswordReset = (user) => {
    setUserToResetPassword(user);
    setIsPasswordModalOpen(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedUser(null);
  };

  const handleFormSave = async (userData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateUser(userData.id, userData);
      setSuccess(`Utilizatorul "${userData.username}" a fost actualizat cu succes!`);
      
      // Actualizare listă de utilizatori
      await fetchUsers();
      await fetchUserStats(); // Re-încarcă statisticile după actualizare
      
      // Închide formularul
      setIsFormVisible(false);
      setSelectedUser(null);
    } catch (error) {
      setError('Eroare la salvarea utilizatorului. Verifică datele și încearcă din nou.');
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    
    try {
      await deleteUser(userToDelete.id);
      
      // Actualizare listă de utilizatori
      await fetchUsers();
      await fetchUserStats(); // Re-încarcă statisticile după ștergere
      
      setSuccess(`Utilizatorul "${userToDelete.username}" a fost șters cu succes!`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Eroare la ștergerea utilizatorului. Te rugăm să încerci din nou.');
      console.error('Error deleting user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (newPassword) => {
    if (!userToResetPassword) return;
    
    setIsLoading(true);
    
    try {
      await resetUserPassword(userToResetPassword.id, newPassword);
      setSuccess(`Parola utilizatorului "${userToResetPassword.username}" a fost resetată cu succes!`);
      setIsPasswordModalOpen(false);
      setUserToResetPassword(null);
    } catch (error) {
      setError('Eroare la resetarea parolei. Te rugăm să încerci din nou.');
      console.error('Error resetting password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="admin-content">
        <h1>Administrare Utilizatori</h1>
        <p className="subtitle">Gestionează utilizatorii aplicației.</p>
        
        {/* Statistici */}
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Utilizatori</h3>
            <p className="stat-value">{userStats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Administratori</h3>
            <p className="stat-value">{userStats.adminUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Utilizatori Obișnuiți</h3>
            <p className="stat-value">{userStats.regularUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Profiluri Create</h3>
            <p className="stat-value">{userStats.usersWithProfiles}</p>
          </div>
        </div>
        
        {/* Mesaje de succes/eroare */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* Formular pentru editare utilizator */}
        {isFormVisible && (
          <UserForm 
            user={selectedUser}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        )}
        
        {/* Tabel utilizatori */}
        <UserAdminTable 
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handlePasswordReset}
          isLoading={isLoading}
        />
        
        {/* Modal confirmare ștergere */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmare ștergere utilizator"
          message={userToDelete ? `Ești sigur că dorești să ștergi utilizatorul "${userToDelete.username}"? Această acțiune nu poate fi anulată.` : ''}
          isLoading={isLoading}
        />
        
        {/* Modal resetare parolă */}
        <PasswordResetModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onConfirm={handleConfirmPasswordReset}
          title="Resetare parolă"
          user={userToResetPassword}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default UserAdminPage;