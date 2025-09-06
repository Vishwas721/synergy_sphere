const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// All task routes are protected
router.use(authMiddleware);

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', taskController.createTask);

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a specific project
router.get('/project/:projectId', taskController.getTasksByProject);

// @route   GET /api/tasks/mytasks
// @desc    Get all tasks assigned to the logged-in user
router.get('/mytasks', taskController.getMyTasks);

// @route   PUT /api/tasks/:id/status
// @desc    Update a task's status
router.put('/:id/status', taskController.updateTaskStatus);

module.exports = router;