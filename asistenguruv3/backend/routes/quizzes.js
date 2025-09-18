const express = require('express');
const {
  getQuizzes,
  createQuiz,
} = require('../controllers/quizController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get quizzes
router.get('/', getQuizzes);

// Create a new quiz
router.post('/', createQuiz);

module.exports = router;