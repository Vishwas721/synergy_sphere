const db = require('../config/db');

// Create a new project
// Update the createProject function
// ✅ Combined createProject function with tags + members
exports.createProject = async (req, res) => {
  const { name, description, deadline, priority, projectManagerId, tagIds } = req.body;
  const creatorId = req.user.id;

  try {
    // 1. Insert new project
    const newProject = await db.query(
      `INSERT INTO projects (name, description, project_manager_id, deadline, priority) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, projectManagerId, deadline, priority]
    );

    const projectId = newProject.rows[0].project_id;

    // 2. Add creator as Admin
    await db.query(
      `INSERT INTO project_members (project_id, user_id, role) 
       VALUES ($1, $2, $3)`,
      [projectId, creatorId, 'Admin']
    );

    // 3. If manager is different, add as Member (ignore if already exists)
    if (projectManagerId && projectManagerId !== creatorId) {
      await db.query(
        `INSERT INTO project_members (project_id, user_id, role) 
         VALUES ($1, $2, $3)
         ON CONFLICT (project_id, user_id) DO NOTHING`,
        [projectId, projectManagerId, 'Member']
      );
    }

    // 4. If tagIds provided, attach them
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await db.query(
          `INSERT INTO project_tags (project_id, tag_id) 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`, // prevents duplicate entries
          [projectId, tagId]
        );
      }
    }

    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error('❌ createProject error:', err.message);
    res.status(500).send('Server Error');
  }
};


// Get all projects for the logged-in user
// Get all projects for the logged-in user with dynamic data
exports.getProjects = async (req, res) => {
  try {
    // This new query uses LEFT JOIN and COUNT to get the number of tasks
    // and another JOIN to get the first tag associated with the project.
    const projects = await db.query(
      `SELECT 
        p.*, 
        COUNT(t.task_id) AS task_count,
        (SELECT name FROM tags tg JOIN project_tags pt ON tg.tag_id = pt.tag_id WHERE pt.project_id = p.project_id LIMIT 1) as tag_name,
        (SELECT color_hex FROM tags tg JOIN project_tags pt ON tg.tag_id = pt.tag_id WHERE pt.project_id = p.project_id LIMIT 1) as tag_color
      FROM projects p
      JOIN project_members pm ON p.project_id = pm.project_id
      LEFT JOIN tasks t ON p.project_id = t.project_id
      WHERE pm.user_id = $1
      GROUP BY p.project_id
      ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single project by its ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await db.query('SELECT * FROM projects WHERE project_id = $1', [req.params.id]);
    
    // TODO: Add logic to ensure the user is a member of this project before returning it
    
    if (project.rows.length === 0) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... (existing functions: createProject, getProjects, etc.)

// Get all members for a specific project
exports.getProjectMembers = async (req, res) => {
  try {
    const members = await db.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email 
       FROM users u 
       JOIN project_members pm ON u.user_id = pm.user_id 
       WHERE pm.project_id = $1`,
      [req.params.id]
    );
    res.json(members.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... existing functions

// Add a member to a project
exports.addProjectMember = async (req, res) => {
  const { email } = req.body;
  const { id: projectId } = req.params;

  try {
    // Find the user by email
    const user = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const userId = user.rows[0].user_id;

    // Insert the user into the project_members table
    await db.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO NOTHING',
      [projectId, userId, 'Member']
    );

    // Return the newly added member's info
    const newMember = await db.query('SELECT user_id, first_name, last_name, email FROM users WHERE user_id = $1', [userId]);
    res.status(201).json(newMember.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Remove a member from a project
exports.removeProjectMember = async (req, res) => {
  const { id: projectId, userId } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Member not found in this project' });
    }
    res.json({ msg: 'Member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... (existing functions)
// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await db.query(
      'DELETE FROM projects WHERE project_id = $1',
      [req.params.id]
    );

    if (deletedProject.rowCount === 0) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... (existing functions)

// Update a project
exports.updateProject = async (req, res) => {
  const { id: projectId } = req.params;
  const { name, description, deadline, priority, projectManagerId, tagIds } = req.body;

  try {
    // 1. Update the main project details
    const updatedProject = await db.query(
      `UPDATE projects SET name = $1, description = $2, deadline = $3, priority = $4, project_manager_id = $5 
       WHERE project_id = $6 RETURNING *`,
      [name, description, deadline, priority, projectManagerId, projectId]
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // 2. Sync the tags: Delete old tags and insert the new ones
    await db.query('DELETE FROM project_tags WHERE project_id = $1', [projectId]);
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await db.query(
          'INSERT INTO project_tags (project_id, tag_id) VALUES ($1, $2)',
          [projectId, tagId]
        );
      }
    }

    res.json(updatedProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};