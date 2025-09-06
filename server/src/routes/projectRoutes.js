const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// All project routes are protected
router.use(authMiddleware);

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', projectController.createProject);

// @route   GET /api/projects
// @desc    Get all projects for a user
router.get('/', projectController.getProjects);

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
router.get('/:id', projectController.getProjectById);

// Add routes for updating and deleting projects as needed
router.get('/:id/members', projectController.getProjectMembers);
// ... existing routes

// @route   POST /api/projects/:id/members
// @desc    Add a member to a project
router.post('/:id/members', projectController.addProjectMember);

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove a member from a project
router.delete('/:id/members/:userId', projectController.removeProjectMember);
// ... (existing routes)
// @route   DELETE /api/projects/:id
// @desc    Delete a project
// ... (existing routes)

// @route   PUT /api/projects/:id
// @desc    Update a project
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
module.exports = router;