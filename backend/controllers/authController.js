const authService = require('../services/authService');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

// Token verification middleware
const verifyToken = (req, res, next) => {
  // Implementation will be in middleware
  next();
};

// Refresh token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found',
    });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Teacher not found',
      });
    }
    
    // Generate new access token
    const newAccessToken = authService.generateAccessToken(teacher._id);
    
    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

// Google login
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify Google token
    const payload = await authService.verifyGoogleToken(tokenId);
    
    // Find or create teacher
    const teacher = await authService.findOrCreateTeacher(payload);
    
    // Generate Access and Refresh tokens
    const accessToken = authService.generateAccessToken(teacher._id);
    const refreshToken = authService.generateRefreshToken(teacher._id);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({
      success: true,
      accessToken,
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
  verifyToken,
  refreshToken,
  googleLogin,
  getProfile,
};