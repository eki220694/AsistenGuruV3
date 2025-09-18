const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Teacher = require('../models/Teacher');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (teacherId) => {
  return jwt.sign({ id: teacherId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Verify Google token
const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

// Find or create teacher from Google payload
const findOrCreateTeacher = async (payload) => {
  const { sub: googleId, name, email, picture: avatar } = payload;
  
  let teacher = await Teacher.findOne({ email });
  
  if (teacher) {
    // Update teacher info if needed
    teacher.googleId = googleId;
    teacher.name = name;
    teacher.avatar = avatar;
    await teacher.save();
  } else {
    // Create new teacher
    teacher = await Teacher.create({
      googleId,
      name,
      email,
      avatar,
    });
  }
  
  return teacher;
};

module.exports = {
  generateToken,
  verifyGoogleToken,
  findOrCreateTeacher,
};