import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignIn = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            AI Resume Improver
          </Link>
          
          <div className="navbar-menu">
            <div className="navbar-auth">
              {isAuthenticated ? (
                <div className="user-menu">
                  <button 
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar-small">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user?.name}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-info-compact">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                          <span className={`subscription-badge ${user.subscription}`}>
                            {user.subscription === 'premium' ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>
                      
                      {user.subscription === 'free' && (
                        <div className="usage-info-compact">
                          <span>Usage: {user.usageCount}/{user.maxUsage}</span>
                          <div className="usage-bar-small">
                            <div 
                              className="usage-progress-small" 
                              style={{ width: `${Math.min((user.usageCount / user.maxUsage) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="user-dropdown-actions">
                        <button onClick={logout} className="dropdown-action">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="header-auth">
                  <button onClick={handleSignIn} className="btn btn-outline">
                    Sign In
                  </button>
                  <button onClick={handleSignUp} className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;