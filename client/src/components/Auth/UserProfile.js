import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const usagePercentage = (user.usageCount / user.maxUsage) * 100;

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className={`subscription-badge ${user.subscription}`}>
            {user.subscription === 'premium' ? '⭐ Premium' : '🆓 Free'}
          </span>
        </div>
      </div>

      {user.subscription === 'free' && (
        <div className="usage-info">
          <div className="usage-header">
            <span>Monthly Usage</span>
            <span>{user.usageCount}/{user.maxUsage}</span>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-progress" 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          {user.usageCount >= user.maxUsage && (
            <p className="usage-limit">
              You've reached your monthly limit. Upgrade to Premium for unlimited access!
            </p>
          )}
        </div>
      )}

      <div className="user-actions">
        <button onClick={logout} className="btn btn-outline">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;