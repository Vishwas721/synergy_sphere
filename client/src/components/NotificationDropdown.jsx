import React from 'react';
import { Link } from 'react-router-dom';
import './NotificationDropdown.css';

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Link to={notif.link_to || '#'} key={notif.notification_id} className="notification-item">
              <p>{notif.message}</p>
              <span className="notification-time">
                {new Date(notif.created_at).toLocaleString()}
              </span>
            </Link>
          ))
        ) : (
          <div className="no-notifications">
            <p>You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;