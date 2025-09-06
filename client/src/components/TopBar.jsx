import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import socket from '../services/socket';
import './TopBar.css';

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  // ✅ Dynamic breadcrumbs
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) {
      return <span>Dashboard</span>;
    }

    return (
      <div className="breadcrumbs">
        {/* Always link back to Projects */}
        <Link to="/projects" className="breadcrumb-link">Projects</Link>

        {/* If inside a specific project */}
        {pathnames[0] === 'projects' && pathnames[1] && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">Details</span>
          </>
        )}

        {/* If on My Tasks page */}
        {pathnames[0] === 'mytasks' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">My Tasks</span>
          </>
        )}

        {/* Fallback for other routes */}
        {pathnames[0] !== 'projects' && pathnames[0] !== 'mytasks' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">{pathnames[0]}</span>
          </>
        )}
      </div>
    );
  };

  // ✅ Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    };
    socket.on('new_notification', handleNewNotification);
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, []);

  return (
    <header className="topbar">
      {/* Breadcrumbs */}
      {generateBreadcrumbs()}

      {/* Right side actions */}
      <div className="topbar-right-content">
        {/* Search bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Notifications + Settings */}
        <div className="action-icons">
          <div className="notification-wrapper">
            <button
              className="icon-btn"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            {isDropdownOpen && (
              <NotificationDropdown notifications={notifications} />
            )}
          </div>
          <Link to="/settings" className="icon-btn">
            <FaCog />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
