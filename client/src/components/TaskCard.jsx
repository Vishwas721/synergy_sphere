import React, { useState } from 'react';
import { FaFlag, FaEllipsisV } from 'react-icons/fa';
import api from '../services/api'; // 1. Import api service
import './TaskCard.css';

// 2. Accept a new prop 'onTaskUpdate' to notify the parent page of changes
const TaskCard = ({ task, onTaskUpdate }) => { 
  // 3. Add local state to manage the status for immediate UI feedback
  const [currentStatus, setCurrentStatus] = useState(task.status);

  const formattedDate = task.deadline
    ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No deadline';

  const assigneeAvatar = 'https://i.pravatar.cc/30?u=' + task.assignee_id;

  // 4. Create the handler for status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus); // Update UI optimistically

    try {
      const response = await api.put(`/tasks/${task.task_id}/status`, { status: newStatus });
      // Call the parent's update function with the full updated task from the server
      if (onTaskUpdate) {
        onTaskUpdate(response.data);
      }
    } catch (err) {
      console.error('Failed to update task status', err);
      setCurrentStatus(task.status); // Revert on error
    }
  };

  return (
    <div className={`task-card status-${currentStatus.toLowerCase().replace(' ', '-')}`}>

<div className="task-card-header">
    {/* Display the task ID as a numbered tag */}
    <span className="task-id-tag">#{task.task_id}</span>
    <FaEllipsisV className="menu-icon" />
</div>
      <div className="task-card-body">
        <h3 className="task-name">{task.name}</h3>
      </div>
      <div className="task-card-footer">
        <div className="footer-item">
          <FaFlag />
          <span>{formattedDate}</span>
        </div>
        
        {/* 5. Add the status dropdown */}
        <div className="task-status-selector">
          <select value={currentStatus} onChange={handleStatusChange}>
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        
        <img src={assigneeAvatar} alt="Assignee" className="assignee-avatar" />
      </div>
    </div>
  );
};

export default TaskCard;