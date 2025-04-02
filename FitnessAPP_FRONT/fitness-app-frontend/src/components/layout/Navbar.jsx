import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Verifică dacă utilizatorul este admin
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="navbar-container">
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <button onClick={() => { navigate('/'); setIsOpen(false); }}>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => { navigate('/programs'); setIsOpen(false); }}>
              Programe
            </button>
          </li>
          
          {!isLoggedIn ? (
            <>
              <li>
                <button onClick={() => { navigate('/login'); setIsOpen(false); }}>
                  Login
                </button>
              </li>
              <li>
                <button onClick={() => { navigate('/register'); setIsOpen(false); }}>
                  Register
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => { navigate('/profile'); setIsOpen(false); }}>
                  Profilul Meu
                </button>
              </li>
              <li>
                <button onClick={() => { navigate('/analysis'); setIsOpen(false); }}>
                  Analiză Personalizată
                </button>
              </li>
              
              {isAdmin && (
                <>
                  <li className="admin-section-title">Administrare</li>
                  <li>
                    <button onClick={() => { navigate('/admin/users'); setIsOpen(false); }}>
                      Administrare Utilizatori
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { navigate('/admin/programs'); setIsOpen(false); }}>
                      Administrare Programe
                    </button>
                  </li>
                </>
              )}
              
              <li>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;