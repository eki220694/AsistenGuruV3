const LessonPlan = require('../models/LessonPlan');

// Get lessons for a classroom
const getLessons = async (req, res) => {
  try {
    const { classroomId } = req.query;
    
    const lessons = await LessonPlan.find({ classroomId })
      .sort({ date: 1 });
    
    res.json({
      success: true,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create a new lesson
const createLesson = async (req, res) => {
  try {
    const { classroomId, title, date, topic, objectives, materials, activities, assessment } = req.body;
    
    // Create lesson
    const lesson = new LessonPlan({
      classroomId,
      title,
      date,
      topic,
      objectives,
      materials,
      activities,
      assessment,
    });
    
    await lesson.save();
    
    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete a lesson
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete lesson
    const lesson = await LessonPlan.findByIdAndDelete(id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getLessons,
  createLesson,
  deleteLesson,
};