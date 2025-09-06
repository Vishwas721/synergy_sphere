import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { FaPlus } from 'react-icons/fa';
import './ProjectsPage.css'; // Reuse styles
import ManageMembers from '../components/ManageMembers'; // Import the new component
import { FaUsers } from 'react-icons/fa'; 

const ProjectDetailPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch project details and tasks in parallel
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to fetch project details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

    const handleTaskUpdate = (updatedTask) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.task_id === updatedTask.task_id ? updatedTask : task
      )
    );
  };


  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  if (isLoading) return <div className="loading-state">Loading project...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!project) return <div className="empty-state">Project not found.</div>;

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p style={{color: 'var(--sidebar-text-muted)', marginTop: '5px'}}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="new-project-btn secondary-btn" onClick={() => setIsMembersModalOpen(true)}>
                <FaUsers /> Manage Members
            </button>
            <button className="new-project-btn" onClick={() => setIsTaskModalOpen(true)}>
                <FaPlus /> New Task
            </button>
        </div>
      </header>

      {/* This is where you would render the task board/list */}
      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.task_id} task={task} onTaskUpdate={handleTaskUpdate} />)
        ) : (
          <div className="empty-state">
            <h3>No tasks yet.</h3>
            <p>Add the first task to get started.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
        <TaskForm projectId={projectId} onTaskCreated={handleTaskCreated} />
      </Modal>

      {/* New Members Management Modal */}
      <Modal isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)} title="Manage Project Members">
        <ManageMembers projectId={projectId} />
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;