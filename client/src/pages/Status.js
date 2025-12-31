import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Status = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/health`);
      setStatus(response.data);
    } catch (error) {
      setStatus({ error: 'Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Checking System Status...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>System Status</h1>
      
      {status.error ? (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {status.error}
        </div>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: status.status === 'ok' ? '#d4edda' : '#f8d7da',
            color: status.status === 'ok' ? '#155724' : '#721c24',
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <strong>Server Status:</strong> {status.status}
          </div>
          
          <div style={{ 
            backgroundColor: status.mongodb === 'connected' ? '#d4edda' : '#fff3cd',
            color: status.mongodb === 'connected' ? '#155724' : '#856404',
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <strong>MongoDB Status:</strong> {status.mongodb}
          </div>
          
          {status.mongodb !== 'connected' && (
            <div style={{ 
              backgroundColor: '#e2e3e5', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3>MongoDB Connection Issue</h3>
              <p>Your MongoDB Atlas cluster is not connected. This is likely due to IP whitelist restrictions.</p>
              <p><strong>To fix this:</strong></p>
              <ol>
                <li>Go to <a href="https://cloud.mongodb.com/" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a></li>
                <li>Navigate to "Network Access"</li>
                <li>Click "Add IP Address"</li>
                <li>Add your current IP or use 0.0.0.0/0 for development</li>
                <li>Wait 1-2 minutes for changes to apply</li>
              </ol>
            </div>
          )}
          
          <p><strong>Last checked:</strong> {status.timestamp}</p>
        </div>
      )}
      
      <button 
        onClick={checkStatus}
        style={{
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Refresh Status
      </button>
    </div>
  );
};

export default Status;