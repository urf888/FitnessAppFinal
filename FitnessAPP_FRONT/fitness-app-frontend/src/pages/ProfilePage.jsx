/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileView from '../components/profile/ProfileView';
import { getUserProfile, createUserProfile, updateUserProfile } from '../api/profileService';
import './ProfilePage.css';
import Navbar from '../components/layout/Navbar';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        // Dacă primim 404, înseamnă că nu există profil, ceea ce este ok
        if (error.response && error.response.status === 404) {
          setProfile(null);
        } else {
          setError('Eroare la încărcarea profilului. Încearcă din nou mai târziu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (profileData) => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      let response;
      
      if (profile) {
        // Actualizare profil existent
        response = await updateUserProfile(profileData);
        setSuccess('Profilul a fost actualizat cu succes!');
      } else {
        // Creare profil nou
        response = await createUserProfile({
          ...profileData,
          userId: currentUser.id
        });
        setSuccess('Profilul a fost creat cu succes!');
      }
      
      setProfile(response);
      setIsEditing(false); // Revenim la modul de vizualizare după salvare
    } catch (error) {
      setError('Eroare la salvarea profilului. Verifică datele și încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1>Profilul Meu</h1>
          <p className="profile-subtitle">Gestionează informațiile tale personale și preferințele pentru antrenament</p>
        </div>
        
        <div className="user-info">
          <div className="user-info-header">
            <div className="avatar">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h2>{currentUser.username}</h2>
              <p>{currentUser.email}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Se încarcă profilul...</div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {/* Afișăm formularul de creare de profil dacă utilizatorul nu are încă un profil */}
            {!profile && !isEditing ? (
              <div className="no-profile-message">
                <p>Nu ai încă un profil. Completează informațiile de mai jos pentru a-ți crea profilul.</p>
                <ProfileForm 
                  profile={null} 
                  onSave={handleSaveProfile} 
                  isLoading={saving}
                  onCancel={null} // Nu oferim opțiunea de a anula prima creare
                />
              </div>
            ) : isEditing ? (
              // Modul de editare profil
              <ProfileForm 
                profile={profile} 
                onSave={handleSaveProfile} 
                isLoading={saving}
                onCancel={handleCancelEdit}
              />
            ) : (
              // Modul de vizualizare profil
              <ProfileView 
                profile={profile} 
                onEdit={handleEditProfile}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;