import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTasks, FaProjectDiagram, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import './Sidebar.css';
import { Link } from 'react-router-dom'; 
const Sidebar = ({ isDarkMode, toggleTheme }) => {
  // Dummy user data - we'll replace this with real data later
  const user = { name: 'Test User', email: 'test.user@mail.com', avatar: 'https://i.pravatar.cc/40' };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <FaProjectDiagram size={30} />
        <h1>SynergySphere</h1>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/projects">
            <FaProjectDiagram />
            <span>Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/mytasks">
            <FaTasks />
            <span>My Tasks</span>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <div className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div className="user-profile">
          <img src={user.avatar} alt="User Avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <Link to="/settings"> {/* <-- WRAP THE ICON IN A LINK */}
            <FaCog className="settings-icon" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;