import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ onTextExtracted, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const file = files[0];
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      onError('Please select a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cv/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onTextExtracted(response.data.text, file.name);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload file';
      onError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <p>Extracting text from PDF...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📄</div>
            <h3>Upload PDF Resume</h3>
            <p>Drag and drop your PDF here, or click to browse</p>
            <small>Maximum file size: 5MB</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;