const express = require('express');
const {
  getStudents,
  createStudent,
  updateAttendance,
  updateParticipation,
} = require('../controllers/studentController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Get all students
router.get('/', getStudents);

// Create a new student
router.post('/', createStudent);

// Update student attendance
router.put('/:studentId/attendance', updateAttendance);

// Update student participation
router.put('/:studentId/participation', updateParticipation);

module.exports = router;