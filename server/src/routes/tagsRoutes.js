const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/tags
// @desc    Get all available tags
router.get('/', async (req, res) => {
  try {
    const tags = await db.query('SELECT tag_id, name, color_hex FROM tags');
    res.json(tags.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;