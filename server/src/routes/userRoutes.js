const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/users
// @desc    Get all users for dropdowns
router.get('/', async (req, res) => {
  try {
    const users = await db.query('SELECT user_id, first_name, last_name FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;