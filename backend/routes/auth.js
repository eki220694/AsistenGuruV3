const express = require('express');
const { googleLogin, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Google login
router.post('/google', googleLogin);

// Get teacher profile (protected route)
router.get('/profile', auth, getProfile);

module.exports = router;