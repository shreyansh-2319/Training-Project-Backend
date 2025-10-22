const mongoose = require('mongoose');

const examAdminSchema = new mongoose.Schema({
    examId: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    duration: {
        type: Number,
        default: 60
    },
});

const examAdmin = mongoose.model('examAdmin', examAdminSchema);
module.exports = examAdmin;


