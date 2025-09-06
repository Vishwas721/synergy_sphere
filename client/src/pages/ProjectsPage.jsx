import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { FaPlus } from 'react-icons/fa';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import './ProjectsPage.css';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // ✅ track edit mode
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Save handler works for both Create and Edit
  const handleProjectSaved = (savedProject) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === savedProject.project_id ? savedProject : p
        )
      );
    } else {
      setProjects([savedProject, ...projects]);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((currentProjects) =>
        currentProjects.filter((p) => p.project_id !== projectId)
      );
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (isLoading) return <div className="loading-state">Loading projects...</div>;
    if (error) return <div className="error-state">{error}</div>;

    if (projects.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Projects Found</h3>
          <p>Get started by creating your first project.</p>
          <button className="new-project-btn" onClick={openCreateModal}>
            <FaPlus /> Create Project
          </button>
        </div>
      );
    }

    return (
      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.project_id}
            onClick={() => handleCardClick(project.project_id)}
          >
            <ProjectCard
              project={project}
              onDelete={handleProjectDelete}
              onEdit={() => openEditModal(project)} // ✅ edit action
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="projects-page">
      <header className="page-header">
        <h1>Projects</h1>
        <button className="new-project-btn" onClick={openCreateModal}>
          <FaPlus /> New Project
        </button>
      </header>

      {renderContent()}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? 'Edit Project' : 'Create New Project'}
        >
          <ProjectForm
            onProjectSaved={handleProjectSaved}
            projectToEdit={editingProject} // ✅ pass project for edit mode
          />
        </Modal>
      )}
    </div>
  );
};

export default ProjectsPage;
