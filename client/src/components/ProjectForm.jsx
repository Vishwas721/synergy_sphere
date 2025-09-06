import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../services/api';
import '../pages/Auth.css';

const ProjectForm = ({ onProjectSaved, projectToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    projectManagerId: '',
    priority: 'Medium',
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users and tags for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tagsRes] = await Promise.all([
          api.get('/users'),
          api.get('/tags'),
        ]);
        setUsers(usersRes.data);
        setTagOptions(
          tagsRes.data.map(tag => ({ value: tag.tag_id, label: tag.name, color: tag.color }))
        );
      } catch (err) {
        console.error('Failed to fetch form data', err);
      }
    };
    fetchData();
  }, []);

  // Pre-populate form when editing
  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        description: projectToEdit.description || '',
        deadline: projectToEdit.deadline
          ? new Date(projectToEdit.deadline).toISOString().split('T')[0]
          : '',
        projectManagerId: projectToEdit.project_manager_id || '',
        priority: projectToEdit.priority || 'Medium',
      });

      // Pre-select tags if available
      if (projectToEdit.tags) {
        setSelectedTags(
          projectToEdit.tags.map(tag => ({
            value: tag.tag_id,
            label: tag.name,
            color: tag.color,
          }))
        );
      }
    }
  }, [projectToEdit]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const tagIds = selectedTags.map(tag => tag.value);
    const finalFormData = { ...formData, tagIds };

    try {
      let response;
      if (projectToEdit) {
        response = await api.put(`/projects/${projectToEdit.project_id}`, finalFormData);
      } else {
        response = await api.post('/projects', finalFormData);
      }
      onProjectSaved(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Project Name */}
      <div className="form-group">
        <label htmlFor="name">Project Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <Select
          isMulti
          value={selectedTags}
          onChange={setSelectedTags}
          options={tagOptions}
        />
      </div>

      {/* Project Manager */}
      <div className="form-group">
        <label htmlFor="projectManagerId">Project Manager</label>
        <select
          name="projectManagerId"
          value={formData.projectManagerId}
          onChange={handleChange}
        >
          <option value="">Select a manager</option>
          {users.map(user => (
            <option key={user.user_id} value={user.user_id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Deadline */}
      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>

      {/* Priority */}
      <div className="form-group">
        <label>Priority</label>
        <div className="radio-group">
          {['Low', 'Medium', 'High'].map(p => (
            <label key={p}>
              <input
                type="radio"
                name="priority"
                value={p}
                checked={formData.priority === p}
                onChange={handleChange}
              />{' '}
              {p}
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="auth-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : (projectToEdit ? 'Save Changes' : 'Create Project')}
      </button>
    </form>
  );
};

export default ProjectForm;
