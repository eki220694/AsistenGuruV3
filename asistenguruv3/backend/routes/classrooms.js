const express = require('express');
const {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get all classrooms
router.get('/', getClassrooms);

// Create a new classroom
router.post('/', createClassroom);

// Update a classroom
router.put('/:id', updateClassroom);

// Delete a classroom
router.delete('/:id', deleteClassroom);

module.exports = router;