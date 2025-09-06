import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- 1. Install this: npm install jwt-decode
import socket from '../services/socket'; // <-- 2. Import the socket

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // When the app loads and finds a token, join the socket room
      const decodedToken = jwtDecode(storedToken);
      socket.emit('join_room', decodedToken.user.id); // <-- 3. Join room
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // When the user logs in, join the socket room
    const decodedToken = jwtDecode(newToken);
    socket.emit('join_room', decodedToken.user.id); // <-- 4. Join room
  };

  const logout = () => {
    // We could add a 'leave_room' event here if needed
    localStorage.removeItem('token');
    setToken(null);
  };

  // The value provided to consuming components
  const value = {
    token,
    isAuthenticated: !!token, // A handy boolean to check if logged in
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};