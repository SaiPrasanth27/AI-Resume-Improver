import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usageStats, setUsageStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchResumes();
    fetchUsageStats();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resume');
      setResumes(response.data.resumes);
    } catch (error) {
      setError('Failed to fetch resumes');
      console.error('Fetch resumes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    try {
      const response = await axios.get('/api/ai/usage');
      setUsageStats(response.data);
    } catch (error) {
      console.error('Fetch usage stats error:', error);
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await axios.delete(`/api/resume/${resumeId}`);
      setResumes(resumes.filter(resume => resume._id !== resumeId));
    } catch (error) {
      setError('Failed to delete resume');
      console.error('Delete resume error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'status-draft',
      analyzing: 'status-analyzing',
      completed: 'status-completed',
      error: 'status-error'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your resumes and track your AI usage</p>
        </div>

        {/* Usage Stats */}
        {usageStats && (
          <div className="usage-stats">
            <div className="stats-card">
              <h3>AI Usage This Month</h3>
              <div className="usage-bar">
                <div 
                  className="usage-fill"
                  style={{ 
                    width: `${(usageStats.usageCount / usageStats.maxUsage) * 100}%` 
                  }}
                ></div>
              </div>
              <p>
                {usageStats.usageCount} / {usageStats.maxUsage} analyses used
                {usageStats.subscription === 'free' && (
                  <span className="upgrade-hint">
                    {' '}• <Link to="/upgrade">Upgrade for unlimited</Link>
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/resume/new" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Create New Resume</h3>
            <p>Start building a new resume from scratch</p>
          </Link>
        </div>

        {/* Resumes List */}
        <div className="resumes-section">
          <div className="section-header">
            <h2>Your Resumes</h2>
            <Link to="/resume/new" className="btn btn-primary">
              New Resume
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first resume to get started with AI-powered improvements</p>
              <Link to="/resume/new" className="btn btn-primary">
                Create Your First Resume
              </Link>
            </div>
          ) : (
            <div className="resumes-grid">
              {resumes.map(resume => (
                <div key={resume._id} className="resume-card">
                  <div className="resume-header">
                    <h3>{resume.title}</h3>
                    {getStatusBadge(resume.status)}
                  </div>
                  
                  <div className="resume-meta">
                    <p className="resume-date">
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                    {resume.targetRole && (
                      <p className="resume-role">
                        Target: {resume.targetRole}
                      </p>
                    )}
                  </div>

                  {resume.aiAnalysis?.overallScore && (
                    <div className="resume-score">
                      <span className="score-label">AI Score:</span>
                      <span className="score-value">
                        {resume.aiAnalysis.overallScore}/100
                      </span>
                    </div>
                  )}

                  <div className="resume-actions">
                    <Link 
                      to={`/resume/${resume._id}/edit`}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </Link>
                    {resume.status === 'completed' ? (
                      <Link 
                        to={`/resume/${resume._id}/analysis`}
                        className="btn btn-primary btn-small"
                      >
                        View Analysis
                      </Link>
                    ) : (
                      <Link 
                        to={`/resume/${resume._id}/analysis`}
                        className="btn btn-outline btn-small"
                      >
                        Analyze
                      </Link>
                    )}
                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;