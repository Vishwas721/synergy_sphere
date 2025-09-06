const db = require('../config/db');

// Create a new task
// ... (existing code)
// Create a new task
exports.createTask = async (req, res) => {
  const { projectId, name, description, assigneeId, deadline } = req.body;
  const createdById = req.user.id; // The person creating the task

  try {
    const newTask = await db.query(
      'INSERT INTO tasks (project_id, name, description, assignee_id, deadline, created_by_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [projectId, name, description, assigneeId, deadline, createdById]
    );

    // --- REAL-TIME NOTIFICATION LOGIC ---
    if (assigneeId && assigneeId !== createdById) {
      const sender = await db.query('SELECT first_name, last_name FROM users WHERE user_id = $1', [createdById]);
      const senderName = `${sender.rows[0].first_name} ${sender.rows[0].last_name}`;
      
      const message = `${senderName} assigned you a new task: "${name}"`;
      const linkTo = `/projects/${projectId}`; // Or link directly to the task later

      // 1. Save notification to the database
      const newNotification = await db.query(
          `INSERT INTO notifications (recipient_id, sender_id, type, message, link_to) 
           VALUES ($1, $2, 'NEW_TASK_ASSIGNMENT', $3, $4) RETURNING *`,
          [assigneeId, createdById, message, linkTo]
      );
      
      // 2. Emit a socket event to the specific user's room
      req.io.to(assigneeId).emit('new_notification', newNotification.rows[0]);
    }
    // --- END OF NOTIFICATION LOGIC ---

    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all tasks for a specific project
exports.getTasksByProject = async (req, res) => {
    const { projectId } = req.params;
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get tasks assigned to the current user
exports.getMyTasks = async (req, res) => {
    try {
        // UPDATED QUERY: Join with the projects table to get the project name
        const tasks = await db.query(
            `SELECT t.*, p.name as project_name 
             FROM tasks t 
             JOIN projects p ON t.project_id = p.project_id 
             WHERE t.assignee_id = $1`, 
            [req.user.id]
        );
        res.json(tasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Update a task's status
exports.updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        const updatedTask = await db.query(
            'UPDATE tasks SET status = $1 WHERE task_id = $2 RETURNING *',
            [status, id]
        );
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};