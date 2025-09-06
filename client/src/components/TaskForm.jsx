import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Select from 'react-select'; 
import '../pages/Auth.css'; // Reusing auth form styles

const TaskForm = ({ projectId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    assigneeId: '',
  });
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project members for the assignee dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/members`);
        setMembers(response.data);
      } catch (err) {
        console.error('Failed to fetch project members', err);
      }
    };
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Add projectId to the form data before sending
    const taskData = { ...formData, projectId };

    try {
      const response = await api.post('/tasks', taskData);
      onTaskCreated(response.data); // Callback to parent
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
<div className="form-group">
        <label htmlFor="name">Task Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      {/* TAGS - Multi-Select Dropdown (UI only for now) */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <Select isMulti options={[{value: 'bug', label: 'Bug'}, {value: 'feature', label: 'Feature Request'}]} />
      </div>
      
      {/* IMAGE UPLOAD - UI only for now */}
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input type="file" name="image" />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
      </div>
      <div className="form-group-inline">
        <div className="form-group">
          <label htmlFor="assigneeId">Assign To</label>
          <select id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange}>
            <option value="">Unassigned</option>
            {members.map(member => (
              <option key={member.user_id} value={member.user_id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} />
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="auth-button" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Task...' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;