const Quiz = require('../models/Quiz');

// Get quizzes for a classroom
const getQuizzes = async (req, res) => {
  try {
    const { classroomId } = req.query;
    
    const quizzes = await Quiz.find({ classroomId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { classroomId, title, topic, questions } = req.body;
    
    // Create quiz
    const quiz = new Quiz({
      classroomId,
      title,
      topic,
      questions,
    });
    
    await quiz.save();
    
    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getQuizzes,
  createQuiz,
};