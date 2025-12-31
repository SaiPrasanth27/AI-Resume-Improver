import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUpload from '../components/FileUpload/FileUpload';
import './ResumeEditor.css';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    originalContent: '',
    jobDescription: '',
    targetRole: '',
    industry: ''
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'upload'

  useEffect(() => {
    if (isEditing) {
      fetchResume();
    }
  }, [id, isEditing]); // Remove fetchResume from dependencies to avoid infinite loop

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/api/resume/${id}`);
      setFormData(response.data);
    } catch (error) {
      setError('Failed to fetch resume');
      console.error('Fetch resume error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTextExtracted = (text, fileName) => {
    setFormData({
      ...formData,
      originalContent: text,
      title: formData.title || fileName.replace('.pdf', '')
    });
    setError('');
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`/api/resume/${id}`, formData);
      } else {
        const response = await axios.post('/api/resume', formData);
        navigate(`/resume/${response.data._id}/analysis`);
        return;
      }
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="resume-editor">
      <div className="editor-container">
        <div className="editor-header">
          <h1>{isEditing ? 'Edit Resume' : 'Create New Resume'}</h1>
          <p>Fill in the details below to create or update your resume</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Resume Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer Resume"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="targetRole">Target Role</label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="form-input"
              />
            </div>
            <div className="form-group half">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Healthcare"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Resume Content *</label>
            <div className="input-method-tabs">
              <button
                type="button"
                className={`method-tab ${inputMethod === 'text' ? 'active' : ''}`}
                onClick={() => setInputMethod('text')}
              >
                📝 Type/Paste Text
              </button>
              <button
                type="button"
                className={`method-tab ${inputMethod === 'upload' ? 'active' : ''}`}
                onClick={() => setInputMethod('upload')}
              >
                📄 Upload PDF
              </button>
            </div>

            {inputMethod === 'upload' && (
              <FileUpload
                onTextExtracted={handleTextExtracted}
                onError={handleUploadError}
              />
            )}

            {inputMethod === 'text' && (
              <textarea
                id="originalContent"
                name="originalContent"
                value={formData.originalContent}
                onChange={handleChange}
                required
                placeholder="Paste your resume content here..."
                className="form-textarea"
                rows="15"
              />
            )}

            {formData.originalContent && inputMethod === 'upload' && (
              <div className="extracted-preview">
                <h4>Extracted Text Preview:</h4>
                <textarea
                  name="originalContent"
                  value={formData.originalContent}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="10"
                />
              </div>
            )}

            <small className="form-help">
              {inputMethod === 'text' 
                ? 'Paste your complete resume content including contact info, experience, education, etc.'
                : 'Upload a PDF file and we\'ll extract the text for you. You can edit the extracted text if needed.'
              }
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description (Optional)</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the job description you're targeting (helps with AI optimization)..."
              className="form-textarea"
              rows="8"
            />
            <small className="form-help">
              Adding a job description helps our AI provide more targeted suggestions.
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Resume' : 'Create & Analyze')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeEditor;