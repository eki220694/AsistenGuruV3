const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema({
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  objectives: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  assessment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);