const mongoose = require('mongoose');

const userStudentSchema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: true,
    unique: true
  },   
  firstname: {
    type: String,
    required: true
  }, 
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
        type: String,
        enum: ['student', 'admin'], 
        default: 'student'         
    }
});

const userStudent = mongoose.model('userStudent', userStudentSchema);
module.exports = userStudent;