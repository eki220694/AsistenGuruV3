const authService = require('../services/authService');
const Teacher = require('../models/Teacher');

// Google login
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify Google token
    const payload = await authService.verifyGoogleToken(tokenId);
    
    // Find or create teacher
    const teacher = await authService.findOrCreateTeacher(payload);
    
    // Generate JWT token
    const token = authService.generateToken(teacher._id);
    
    res.json({
      success: true,
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        avatar: teacher.avatar,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Google login failed',
    });
  }
};

// Get teacher profile
const getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select('-__v');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
    
    res.json({
      success: true,
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  googleLogin,
  getProfile,
};