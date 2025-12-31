import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import CoverLetter from '../components/CoverLetter/CoverLetter';
import './ResumeAnalysis.css';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    fetchResume();
  }, [id]); // Remove fetchResume from dependencies to avoid infinite loop

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/api/resume/${id}`);
      setResume(response.data);
    } catch (error) {
      setError('Failed to fetch resume');
      console.error('Fetch resume error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!user.canUseAI) {
      setError('You have reached your usage limit. Please upgrade to continue.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      await axios.post(`/api/ai/analyze/${id}`);
      
      // Refresh resume data
      await fetchResume();
      
      // Update user usage count
      updateUser({ usageCount: user.usageCount + 1 });
      
      setActiveTab('analysis');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-container">
        <h2>Resume not found</h2>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="resume-analysis">
      <div className="analysis-container">
        <div className="analysis-header">
          <div className="header-content">
            <h1>{resume.title}</h1>
            <div className="header-actions">
              <Link to={`/resume/${id}/edit`} className="btn btn-secondary">
                Edit Resume
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Analysis Status */}
        {resume.status === 'draft' && (
          <div className="analysis-prompt">
            <div className="prompt-content">
              <h3>Ready to analyze your resume?</h3>
              <p>Our AI will provide detailed feedback and suggestions for improvement.</p>
              <button
                onClick={analyzeResume}
                disabled={analyzing}
                className="btn btn-primary btn-large"
              >
                {analyzing ? 'Analyzing...' : 'Start AI Analysis'}
              </button>
            </div>
          </div>
        )}

        {resume.status === 'analyzing' && (
          <div className="analyzing-status">
            <div className="loading-spinner"></div>
            <h3>Analyzing your resume...</h3>
            <p>This may take a few moments. Please don't refresh the page.</p>
          </div>
        )}

        {resume.status === 'completed' && resume.aiAnalysis && (
          <>
            {/* Tabs */}
            <div className="analysis-tabs">
              <button
                className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveTab('analysis')}
              >
                AI Analysis
              </button>
              <button
                className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparison')}
              >
                Before & After
              </button>
              <button
                className={`tab ${activeTab === 'improvements' ? 'active' : ''}`}
                onClick={() => setActiveTab('improvements')}
              >
                Improvements
              </button>
              <button
                className={`tab ${activeTab === 'cover-letter' ? 'active' : ''}`}
                onClick={() => setActiveTab('cover-letter')}
              >
                Cover Letter
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'analysis' && (
              <div className="analysis-content">
                {/* Overall Score */}
                <div className="score-card">
                  <div className="score-circle">
                    <div 
                      className="score-fill"
                      style={{ 
                        background: `conic-gradient(${getScoreColor(resume.aiAnalysis.overallScore)} ${resume.aiAnalysis.overallScore * 3.6}deg, #e9ecef 0deg)`
                      }}
                    >
                      <div className="score-inner">
                        <span className="score-number">{resume.aiAnalysis.overallScore}</span>
                        <span className="score-label">{getScoreLabel(resume.aiAnalysis.overallScore)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Sections */}
                <div className="analysis-sections">
                  {resume.aiAnalysis.strengths?.length > 0 && (
                    <div className="analysis-section strengths">
                      <h3>✅ Strengths</h3>
                      <ul>
                        {resume.aiAnalysis.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.aiAnalysis.weaknesses?.length > 0 && (
                    <div className="analysis-section weaknesses">
                      <h3>⚠️ Areas for Improvement</h3>
                      <ul>
                        {resume.aiAnalysis.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.aiAnalysis.suggestions?.length > 0 && (
                    <div className="analysis-section suggestions">
                      <h3>💡 Suggestions</h3>
                      <ul>
                        {resume.aiAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.aiAnalysis.keywordOptimization?.length > 0 && (
                    <div className="analysis-section keywords">
                      <h3>🔍 Keyword Optimization</h3>
                      <div className="keyword-tags">
                        {resume.aiAnalysis.keywordOptimization.map((keyword, index) => (
                          <span key={index} className="keyword-tag">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div className="comparison-content">
                <div className="comparison-grid">
                  <div className="comparison-section">
                    <h3>Original Resume</h3>
                    <div className="content-box">
                      <pre>{resume.originalContent}</pre>
                    </div>
                  </div>
                  <div className="comparison-section">
                    <h3>Improved Resume</h3>
                    <div className="content-box">
                      {resume.improvedContent ? (
                        <pre>{resume.improvedContent}</pre>
                      ) : (
                        <div className="no-content">
                          <p>No improved version available yet.</p>
                          <button className="btn btn-primary">
                            Generate Improved Version
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'improvements' && (
              <div className="improvements-content">
                {resume.improvements?.length > 0 ? (
                  <div className="improvements-list">
                    {resume.improvements.map((improvement, index) => (
                      <div key={index} className="improvement-item">
                        <div className="improvement-header">
                          <h4>{improvement.section}</h4>
                          <span className="improvement-date">
                            {new Date(improvement.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="improvement-comparison">
                          <div className="before">
                            <h5>Before:</h5>
                            <p>{improvement.original}</p>
                          </div>
                          <div className="after">
                            <h5>After:</h5>
                            <p>{improvement.improved}</p>
                          </div>
                        </div>
                        <div className="improvement-reason">
                          <strong>Why this change:</strong> {improvement.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-improvements">
                    <p>No specific improvements tracked yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cover-letter' && (
              <div className="cover-letter-content">
                <CoverLetter resumeId={id} />
              </div>
            )}
          </>
        )}

        {resume.status === 'error' && (
          <div className="error-state">
            <h3>Analysis Failed</h3>
            <p>There was an error analyzing your resume. Please try again.</p>
            <button
              onClick={analyzeResume}
              className="btn btn-primary"
            >
              Retry Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;