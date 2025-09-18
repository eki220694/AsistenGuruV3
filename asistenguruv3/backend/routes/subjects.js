const express = require('express');
const {
  getSubjects,
  createSubject,
} = require('../controllers/subjectController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get all subjects
router.get('/', getSubjects);

// Create a new subject
router.post('/', createSubject);

module.exports = router;