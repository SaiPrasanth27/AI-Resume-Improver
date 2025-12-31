import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import CVImprover from './pages/CVImprover';
import './App.css';

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>
      <div style={{ marginBottom: '10px' }}>🚀 Loading AI CV Improver...</div>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}></div>
    </div>
  </div>
);

// Main app content wrapper
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CVImprover />} />
            <Route path="/cv-improver" element={<CVImprover />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  // Clear console on app start to avoid browser extension noise
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.clear();
      console.log('🚀 AI CV Improver - Development Mode');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
