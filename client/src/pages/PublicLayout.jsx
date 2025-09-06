import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaProjectDiagram } from 'react-icons/fa';
import './PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="logo-container">
          <FaProjectDiagram size={24} />
          <h1>SynergySphere</h1>
        </div>
        <nav className="public-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/solutions">Solutions</NavLink>
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="public-actions">
          <NavLink to="/login" className="login-btn">Login</NavLink>
          <NavLink to="/signup" className="signup-btn">Sign Up</NavLink>
        </div>
      </header>
      <main className="public-content">
        <Outlet /> {/* This will render the specific page like HomePage */}
      </main>
    </div>
  );
};

export default PublicLayout;