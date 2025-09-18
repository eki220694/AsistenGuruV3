const Classroom = require('../models/Classroom');
const Subject = require('../models/Subject');

// Get all classrooms for a teacher
const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.teacher.id })
      .populate('subject')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      classrooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create a new classroom
const createClassroom = async (req, res) => {
  try {
    const { name, subjectId } = req.body;
    
    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }
    
    // Create classroom
    const classroom = new Classroom({
      name,
      subject: subjectId,
      teacher: req.teacher.id,
      studentIds: [],
    });
    
    await classroom.save();
    
    // Populate subject
    await classroom.populate('subject');
    
    res.status(201).json({
      success: true,
      classroom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update a classroom
const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subjectId } = req.body;
    
    // Check if classroom exists and belongs to teacher
    let classroom = await Classroom.findOne({ _id: id, teacher: req.teacher.id });
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }
    
    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }
    
    // Update classroom
    classroom.name = name;
    classroom.subject = subjectId;
    await classroom.save();
    
    // Populate subject
    await classroom.populate('subject');
    
    res.json({
      success: true,
      classroom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete a classroom
const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if classroom exists and belongs to teacher
    const classroom = await Classroom.findOne({ _id: id, teacher: req.teacher.id });
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }
    
    // Delete classroom
    await classroom.remove();
    
    res.json({
      success: true,
      message: 'Classroom deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
};