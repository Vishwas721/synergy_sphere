import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.token); // Log the user in immediately after signup
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create an account.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create an account</h2>
        <p>Start your journey with SynergySphere.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group-inline">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">Create account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;