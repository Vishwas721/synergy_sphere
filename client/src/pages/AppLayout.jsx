import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './AppLayout.css';
import TopBar from '../components/TopBar';

const AppLayout = () => {
  // Basic state for theme toggling - we can move this to a context later
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // This will toggle a class on the body to apply dark mode styles
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="app-layout">
      <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="content-wrapper">
        <TopBar /> {/* <-- 2. ADD TopBar COMPONENT */}
        <main className="main-content">
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;