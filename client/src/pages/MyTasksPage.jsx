import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import './ProjectsPage.css'; // We can reuse the same layout styles

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/tasks/mytasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch your tasks.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

    const handleTaskUpdate = (updatedTask) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.task_id === updatedTask.task_id ? updatedTask : task
      )
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-state">Loading your tasks...</div>;
    }

    if (error) {
      return <div className="error-state">{error}</div>;
    }

    if (tasks.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Tasks Assigned to You</h3>
          <p>You're all caught up!</p>
        </div>
      );
    }

    // Here you could group tasks by status (To-Do, In Progress, Done) for a Kanban view
    return (
      <div className="tasks-list">
        {tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} onTaskUpdate={handleTaskUpdate} />
        ))}
      </div>
    );
  };

  return (
    <div className="projects-page"> {/* Reusing the page wrapper class */}
      <header className="page-header">
        <h1>My Tasks</h1>
      </header>
      {renderContent()}
    </div>
  );
};

export default MyTasksPage;