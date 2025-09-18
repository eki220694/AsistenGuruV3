const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  attendance: {
    type: String,
    enum: ['Hadir', 'Sakit', 'Izin', 'Alpa', 'Bolos'],
    default: 'Hadir'
  },
  participation: {
    type: Number,
    default: 0
  },
  grades: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);