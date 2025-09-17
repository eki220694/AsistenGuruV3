const Student = require('../models/Student');

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ id: 1 });
    
    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { id, name, avatar } = req.body;
    
    // Check if student with this id already exists
    const existingStudent = await Student.findOne({ id });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this ID already exists',
      });
    }
    
    // Create student
    const student = new Student({
      id,
      name,
      avatar,
      attendance: 'Hadir',
      participation: 0,
      grades: {},
    });
    
    await student.save();
    
    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update student attendance
const updateAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { attendance } = req.body;
    
    // Update student
    const student = await Student.findOneAndUpdate(
      { id: studentId },
      { attendance },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }
    
    res.json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update student participation
const updateParticipation = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { change } = req.body;
    
    // Get current student
    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }
    
    // Update participation (ensure it doesn't go below 0)
    student.participation = Math.max(0, student.participation + change);
    await student.save();
    
    res.json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateAttendance,
  updateParticipation,
};