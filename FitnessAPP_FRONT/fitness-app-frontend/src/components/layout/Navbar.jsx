import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Închide dropdown-ul când se face click în afara lui
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.navbar-user')) {
        setDropdownOpen(false);
      }
      
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && 
          !event.target.closest('.mobile-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  // Închide meniurile la schimbarea rutei
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  // Verifică dacă utilizatorul este admin
  const isAdmin = currentUser?.role === 'admin';

  // Funcție pentru a verifica dacă un link este activ
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };
  
  // Obține prima literă a numelui utilizatorului pentru avatar
  const getUserInitial = () => {
    if (currentUser && currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="navbar-container">
      {/* Buton pentru meniul mobil */}
      <button 
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        ☰
      </button>
      
      {/* Brand/Logo */}
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">💪</span> FitnessApp
      </Link>
      
      {/* Linkuri principale - vizibile pe desktop */}
      <nav className="navbar-links desktop-links">
        <Link 
          to="/" 
          className={`navbar-link ${isActive('/')}`}
        >
          Acasă
        </Link>
        
        <Link 
          to="/programs" 
          className={`navbar-link ${isActive('/programs')}`}
        >
          Programe
        </Link>
        
        {isLoggedIn && (
          <>
            <Link 
              to="/recipes-2" 
              className={`navbar-link ${isActive('/recipes-2')}`}
            >
              Rețete
            </Link>
            
            <Link 
              to="/analysis" 
              className={`navbar-link ${isActive('/analysis')}`}
            >
              Analiză
            </Link>
          </>
        )}
      </nav>
      
      {/* Meniu mobil */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link 
            to="/" 
            className={`mobile-link ${isActive('/')}`}
          >
            Acasă
          </Link>
          
          <Link 
            to="/programs" 
            className={`mobile-link ${isActive('/programs')}`}
          >
            Programe
          </Link>
          
          {isLoggedIn && (
            <>
              <Link 
                to="/recipes-2" 
                className={`mobile-link ${isActive('/recipes-2')}`}
              >
                Rețete
              </Link>
              
              <Link 
                to="/analysis" 
                className={`mobile-link ${isActive('/analysis')}`}
              >
                Analiză
              </Link>
              
              <Link 
                to="/profile" 
                className={`mobile-link ${isActive('/profile')}`}
              >
                <span className="menu-icon">👤</span> Profilul Meu
              </Link>
              
              <Link 
                to="/recipes" 
                className={`mobile-link ${isActive('/recipes')}`}
              >
                <span className="menu-icon">🍲</span> Rețete Recomandate
              </Link>
              
              <Link 
                to="/ai-recipes" 
                className={`mobile-link ${isActive('/ai-recipes')}`}
              >
                <span className="menu-icon">🤖</span> Rețete AI
              </Link>
              
              <Link 
                to="/ai-programs" 
                className={`mobile-link ${isActive('/ai-programs')}`}
              >
                <span className="menu-icon">📊</span> Programe AI
              </Link>
              
              {isAdmin && (
                <div className="admin-section-mobile">
                  <h3>Administrare</h3>
                  
                  <Link 
                    to="/admin/users" 
                    className={`mobile-link admin-link ${isActive('/admin/users')}`}
                  >
                    <span className="menu-icon">👥</span> Utilizatori
                  </Link>
                  
                  <Link 
                    to="/admin/programs" 
                    className={`mobile-link admin-link ${isActive('/admin/programs')}`}
                  >
                    <span className="menu-icon">📋</span> Programe
                  </Link>
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="mobile-logout-button"
              >
                <span className="menu-icon">🚪</span> Logout
              </button>
            </>
          )}
          
          {!isLoggedIn && (
            <>
              <Link 
                to="/login" 
                className={`mobile-link ${isActive('/login')}`}
              >
                <span className="menu-icon">🔑</span> Login
              </Link>
              
              <Link 
                to="/register" 
                className={`mobile-link ${isActive('/register')}`}
              >
                <span className="menu-icon">📝</span> Register
              </Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Secțiune utilizator (login sau profil) */}
      <div className="navbar-user">
        {isLoggedIn ? (
          <>
            <button 
              className="navbar-user-button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <div className="user-avatar">
                {getUserInitial()}
              </div>
              <span className="username-text">{currentUser.username}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {/* Dropdown Menu cu iconițe */}
            <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
              <ul>
                <li>
                  <button onClick={() => { 
                    navigate('/profile'); 
                    setDropdownOpen(false);
                  }}>
                    <span className="dropdown-icon">👤</span>
                    Profilul Meu
                  </button>
                </li>
                
                <li>
                  <button onClick={() => { 
                    navigate('/recipes'); 
                    setDropdownOpen(false);
                  }}>
                    <span className="dropdown-icon">🍲</span>
                    Rețete Recomandate
                  </button>
                </li>
                
                <li>
                  <button onClick={() => { 
                    navigate('/ai-recipes'); 
                    setDropdownOpen(false);
                  }}>
                    <span className="dropdown-icon">🤖</span>
                    Rețete AI
                  </button>
                </li>
                
                <li>
                  <button onClick={() => { 
                    navigate('/ai-programs'); 
                    setDropdownOpen(false);
                  }}>
                    <span className="dropdown-icon">📊</span>
                    Programe AI
                  </button>
                </li>
                
                {isAdmin && (
                  <div className="admin-section">
                    <li>
                      <button onClick={() => { 
                        navigate('/admin/users'); 
                        setDropdownOpen(false);
                      }}>
                        <span className="dropdown-icon">👥</span>
                        Administrare Utilizatori
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { 
                        navigate('/admin/programs'); 
                        setDropdownOpen(false);
                      }}>
                        <span className="dropdown-icon">📋</span>
                        Administrare Programe
                      </button>
                    </li>
                  </div>
                )}
                
                <li>
                  <button 
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link 
              to="/login" 
              className={`navbar-link auth-link ${isActive('/login')}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`navbar-link auth-link ${isActive('/register')}`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;