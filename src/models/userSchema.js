const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
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

const User = mongoose.model('user', userSchema);
module.exports = User;