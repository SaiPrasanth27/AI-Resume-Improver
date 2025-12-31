import React, { useState } from 'react';
import axios from 'axios';
import './CoverLetter.css';

const CoverLetter = ({ resumeId }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: ''
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateCoverLetter = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');

    try {
      const response = await axios.post(`/api/ai/cover-letter/${resumeId}`, formData);
      setCoverLetter(response.data.coverLetter);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate cover letter';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    // You could add a toast notification here
  };

  return (
    <div className="cover-letter-generator">
      <div className="generator-header">
        <h3>📝 AI Cover Letter Generator</h3>
        <p>Generate a personalized cover letter paragraph based on your resume</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={generateCoverLetter} className="generator-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., Google, Microsoft"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Senior Software Engineer"
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="btn btn-primary"
        >
          {generating ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </form>

      {coverLetter && (
        <div className="cover-letter-result">
          <div className="result-header">
            <h4>Generated Cover Letter Paragraph</h4>
            <button
              onClick={copyToClipboard}
              className="btn btn-outline btn-small"
            >
              📋 Copy
            </button>
          </div>
          <div className="cover-letter-text">
            {coverLetter}
          </div>
          <small className="result-note">
            This is a starting point. Feel free to customize it further to match your voice and the specific role.
          </small>
        </div>
      )}
    </div>
  );
};

export default CoverLetter;