import React, { useState } from 'react';
import { FaFlag, FaTasks, FaEllipsisV } from 'react-icons/fa';
import './ProjectCard.css';

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tagStyle = project.tag_color
    ? {
        backgroundColor: `${project.tag_color}20`, // Add opacity
        color: project.tag_color,
      }
    : {};

  // Format deadline date nicely
  const formattedDate = project.deadline
    ? new Date(project.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No deadline';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (
      window.confirm(
        'Are you sure you want to delete this project and all its tasks?'
      )
    ) {
      onDelete(project.project_id);
    }
    setIsMenuOpen(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(project); // Pass the project to parent
    setIsMenuOpen(false);
  };

  return (
    <div className="project-card">
      <div className="card-header">
        {/* Tag */}
        <span className="project-tag" style={tagStyle}>
          {project.tag_name || 'No Tag'}
        </span>

        {/* Menu */}
        <div className="menu-container">
          <FaEllipsisV
            className="menu-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          />
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete} className="delete">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-description">
          {project.description?.substring(0, 100) || 'No description provided.'}
          {project.description?.length > 100 && '...'}
        </p>
      </div>

      <div className="card-footer">
        <div className="footer-item">
          <FaFlag />
          <span>{formattedDate}</span>
        </div>
        <div className="footer-item">
          <FaTasks />
          <span>{project.task_count} Task(s)</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
