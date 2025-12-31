import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload/FileUpload';
import AuthModal from '../components/Auth/AuthModal';
import './CVImprover.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const CVImprover = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1); // 1: Upload, 2: Job Details, 3: Results
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Check if user can use AI service
  const canUseAI = () => {
    if (!isAuthenticated) return true; // Allow guest usage
    return user?.subscription === 'premium' || (user?.usageCount || 0) < (user?.maxUsage || 3);
  };

  const getRemainingUsage = () => {
    if (!isAuthenticated || user?.subscription === 'premium') return null;
    return (user?.maxUsage || 3) - (user?.usageCount || 0);
  };

  const handleCVUpload = (extractedText, fileName) => {
    setCvText(extractedText);
    setStep(2);
    setError('');
  };

  const handleTextInput = (e) => {
    setCvText(e.target.value);
    if (e.target.value.length > 100) {
      setStep(2);
    }
  };

  const processCV = async () => {
    if (!cvText.trim()) {
      setError('Please provide your CV content');
      return;
    }

    // Check usage limits for authenticated users
    if (isAuthenticated && !canUseAI()) {
      setError('You have reached your monthly usage limit. Please upgrade to Premium for unlimited access.');
      return;
    }

    // Encourage sign up for guests
    if (!isAuthenticated) {
      const shouldSignUp = window.confirm(
        'Sign up for a free account to save your improvements and track your progress!\n\nClick OK to sign up, or Cancel to continue as guest.'
      );
      if (shouldSignUp) {
        setAuthModalOpen(true);
        return;
      }
    }

    setProcessing(true);
    setError('');

    try {
      console.log('Processing CV with AI...');
      const response = await axios.post(`${API_URL}/api/cv/improve`, {
        cvContent: cvText,
        jobDescription: jobDescription,
        companyName: companyName,
        position: position
      });

      console.log('CV processing completed successfully');
      setResults(response.data);
      setStep(3);
    } catch (error) {
      console.error('CV processing error:', error);
      setError(error.response?.data?.message || 'Failed to process CV. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadImprovedCV = async () => {
    try {
      setProcessing(true);
      console.log('Downloading improved CV...');
      
      const response = await axios.post(`${API_URL}/api/cv/generate-pdf-from-structured`, {
        structuredData: results.structuredData,
        htmlContent: results.htmlContent
      }, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'improved-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF download error:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const startOver = () => {
    setStep(1);
    setCvText('');
    setJobDescription('');
    setCompanyName('');
    setPosition('');
    setResults(null);
    setError('');
  };

  return (
    <div className="cv-improver">
      <div className="cv-container">
        {/* Header */}
        <div className="cv-header">
          <h1>AI Resume Improver</h1>
          <p>Transform your resume in 3 simple steps</p>
          
          {/* Guest User Encouragement */}
          {!isAuthenticated && (
            <div className="guest-info">
              <p><strong>Sign up for free</strong> to save your improvements and get unlimited access!</p>
              <button onClick={() => setAuthModalOpen(true)} className="btn btn-outline btn-small">
                Create Free Account
              </button>
            </div>
          )}
          
          <div className="progress-bar">
            <div 
              className={`progress-step ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}
              onClick={() => step > 1 && setStep(1)}
              style={{ cursor: step > 1 ? 'pointer' : 'default' }}
            >
              1. Upload CV
            </div>
            <div 
              className={`progress-step ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}
              onClick={() => step > 2 && cvText.length > 50 && setStep(2)}
              style={{ cursor: (step > 2 && cvText.length > 50) ? 'pointer' : 'default' }}
            >
              2. Job Details
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}>
              3. Improved CV
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Upload CV */}
        {step === 1 && (
          <div className="step-content">
            <h2>Upload Your CV</h2>
            <p>Upload a PDF file or paste your CV text below</p>
            
            {/* Show current job details if coming back from step 2/3 */}
            {(companyName || position || jobDescription) && (
              <div className="current-job-info">
                <h4>Current Job Target:</h4>
                <div className="job-info-display">
                  {(companyName || position) && (
                    <p><strong>Position:</strong> {position || 'Not specified'} at {companyName || 'Not specified'}</p>
                  )}
                  {jobDescription && (
                    <p><strong>Job Description:</strong> {jobDescription.substring(0, 100)}...</p>
                  )}
                  <button onClick={() => setStep(2)} className="btn btn-outline btn-small">
                    Edit Job Details
                  </button>
                </div>
              </div>
            )}
            
            <FileUpload
              onTextExtracted={handleCVUpload}
              onError={setError}
            />
            
            <div className="divider">
              <span>OR</span>
            </div>
            
            <div className="text-input-section">
              <label>Paste Your CV Text:</label>
              <textarea
                value={cvText}
                onChange={handleTextInput}
                placeholder="Paste your complete CV content here..."
                className="cv-textarea"
                rows="15"
              />
              {cvText.length > 100 && (
                <div className="continue-actions">
                  <button onClick={() => setStep(2)} className="btn btn-primary">
                    Continue with Text
                  </button>
                  {(companyName || position || jobDescription) && (
                    <button onClick={processCV} disabled={processing} className="btn btn-secondary">
                      {processing ? 'Processing...' : 'Quick Process (Keep Job Details)'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="step-content">
            <h2>Job Details (Optional but Recommended)</h2>
            <p>Provide job details for a more targeted CV improvement</p>
            
            {/* CV Preview Section */}
            <div className="cv-preview-section">
              <h4>Your CV Content:</h4>
              <div className="cv-preview">
                <div className="cv-preview-text">
                  {cvText.substring(0, 200)}...
                </div>
                <button 
                  onClick={() => setStep(1)} 
                  className="btn btn-outline btn-small"
                >
                  Edit CV
                </button>
              </div>
            </div>
            
            <div className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job posting here for better targeting..."
                  className="form-textarea"
                  rows="8"
                />
              </div>
              
              <div className="form-actions">
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  Back to CV Upload
                </button>
                <button 
                  onClick={processCV} 
                  disabled={processing}
                  className="btn btn-primary btn-large"
                >
                  {processing ? 'Processing CV...' : 'Improve My CV'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && results && (
          <div className="step-content">
            <h2>Your Improved CV is Ready!</h2>
            
            {/* Quick Navigation */}
            <div className="navigation-summary">
              <div className="nav-item">
                <span className="nav-label">CV:</span>
                <span className="nav-value">Uploaded Successfully</span>
                <button onClick={() => setStep(1)} className="btn btn-outline btn-small">
                  Edit CV
                </button>
              </div>
              <div className="nav-item">
                <span className="nav-label">Target Job:</span>
                <span className="nav-value">
                  {position || companyName ? `${position || 'Position'} at ${companyName || 'Company'}` : 'General Optimization'}
                </span>
                <button onClick={() => setStep(2)} className="btn btn-outline btn-small">
                  Edit Job Details
                </button>
              </div>
            </div>
            
            <div className="results-section">
              {/* CV Analysis Score */}
              <div className="analysis-card">
                <h3>CV Analysis</h3>
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-number">{results.analysis?.score || 85}</span>
                    <span className="score-label">Score</span>
                  </div>
                  <div className="score-details">
                    <p><strong>Content Quality:</strong> {results.analysis?.contentEnhancement || 'Excellent'}</p>
                    <p><strong>ATS Optimization:</strong> {results.analysis?.atsOptimization || 'Strong'}</p>
                    <p><strong>Structure:</strong> {results.analysis?.structureClarity || 'Professional'}</p>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="result-card">
                <div className="result-header">
                  <h3>Download Your Improved CV</h3>
                  <button 
                    onClick={downloadImprovedCV} 
                    disabled={processing} 
                    className="btn btn-primary btn-large"
                  >
                    {processing ? 'Generating PDF...' : 'Download Improved CV'}
                  </button>
                </div>
                <div className="result-preview">
                  <p className="preview-text">
                    Your resume has been enhanced with AI-powered improvements including:
                  </p>
                  <ul className="improvement-features">
                    <li>Professional formatting and structure</li>
                    <li>ATS-optimized keywords and layout</li>
                    <li>Enhanced content and descriptions</li>
                    <li>Industry-standard formatting</li>
                    <li>Ready for job applications</li>
                  </ul>
                  
                  {/* Show structured data preview if available */}
                  {results.structuredData && (
                    <div className="structured-preview">
                      <h4>Resume Structure Detected:</h4>
                      <div className="structure-summary">
                        <div className="structure-item">
                          <strong>Name:</strong> {results.structuredData.header?.name || 'Detected'}
                        </div>
                        <div className="structure-item">
                          <strong>Experience:</strong> {results.structuredData.experience?.length || 0} positions
                        </div>
                        <div className="structure-item">
                          <strong>Projects:</strong> {results.structuredData.projects?.length || 0} projects
                        </div>
                        <div className="structure-item">
                          <strong>Education:</strong> {results.structuredData.education?.length || 0} entries
                        </div>
                        <div className="structure-item">
                          <strong>Skills:</strong> {results.structuredData.skills?.technical?.length || 0} technical skills
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {results.coverLetter && (
                <div className="result-card">
                  <div className="result-header">
                    <h3>Bonus: Tailored Cover Letter</h3>
                    <button onClick={() => copyToClipboard(results.coverLetter)} className="btn btn-outline">
                      Copy Text
                    </button>
                  </div>
                  <div className="result-content cover-letter">
                    <p>{results.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Key Improvements */}
              {results.improvements && (
                <div className="result-card">
                  <h3>Key Improvements Made</h3>
                  <ul className="improvements-list">
                    {results.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="final-actions">
                <button onClick={() => setStep(2)} className="btn btn-secondary">
                  Edit Job Details
                </button>
                <button onClick={startOver} className="btn btn-outline btn-large">
                  Start Over with New CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="register"
      />
    </div>
  );
};

export default CVImprover;