const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import security setup
const { setupSecurity, dbSecurity } = require('./utils/security-setup');

// Import logger
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quizzes');
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Add request logging with Morgan
app.use(morgan('combined', { 
  stream: { 
    write: (message) => logger.info(message.trim()) 
  }
}));

// Middleware (before security setup)
app.use(cors());
app.use(express.json());

// Setup security middleware (after database connection, before routes)
setupSecurity(app);

// Database connection
const dbOptions = dbSecurity.getSecureMongoOptions();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asistenguru', dbOptions)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    url: req.url,
    method: req.method
  });
  
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server is running on port ${PORT}`);
});