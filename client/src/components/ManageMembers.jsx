import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTrash } from 'react-icons/fa';
import './ManageMembers.css';

const ManageMembers = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await api.get(`/projects/${projectId}/members`);
      setMembers(response.data);
    };
    fetchMembers();
  }, [projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.post(`/projects/${projectId}/members`, { email });
      setMembers([...members, response.data]);
      setSuccess(`${email} was added successfully.`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      setMembers(members.filter(m => m.user_id !== userId));
    } catch (err) {
      setError('Failed to remove member.');
    }
  };

  return (
    <div className="manage-members">
      <h4>Current Members</h4>
      <ul className="members-list">
        {members.map(member => (
          <li key={member.user_id}>
            <span>{member.first_name} {member.last_name} ({member.email})</span>
            <button onClick={() => handleRemoveMember(member.user_id)} className="remove-btn"><FaTrash /></button>
          </li>
        ))}
      </ul>

      <h4 className="add-member-title">Add New Member</h4>
      <form onSubmit={handleAddMember} className="add-member-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          required
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ManageMembers;