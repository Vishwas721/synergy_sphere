import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-card">
        <h2>Account</h2>
        <p>Manage your account preferences.</p>
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;