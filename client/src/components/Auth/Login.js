import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Submitting login form...');
      const result = await login(formData.email.trim(), formData.password);
      
      if (result.success) {
        console.log('Login successful, closing modal...');
        onClose();
      } else {
        console.log('Login failed:', result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>🔐 Sign In</h2>
        <p>Welcome back! Sign in to access your CV improvements</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form-content">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-large"
        >
          {loading ? '🔄 Signing In...' : '🚀 Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="link-button"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;