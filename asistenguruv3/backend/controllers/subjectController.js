const Subject = require('../models/Subject');

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    
    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject already exists',
      });
    }
    
    // Create subject
    const subject = new Subject({ name });
    await subject.save();
    
    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getSubjects,
  createSubject,
};