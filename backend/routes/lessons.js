const express = require('express');
const {
  getLessons,
  createLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get lessons
router.get('/', getLessons);

// Create a new lesson
router.post('/', createLesson);

// Delete a lesson
router.delete('/:id', deleteLesson);

module.exports = router;