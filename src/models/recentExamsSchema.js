const userStudentTemplate = require("./userStudentSchema"); 

const recentExams = {
    examId: 0, 
    examName: '', 
    date: '', 
    studentId: userStudentTemplate.studentId, 
    studentName: userStudentTemplate.firstname + " " + userStudentTemplate.lastname, 
    score: 0, 
    totalQuestions: 0, 
    correctAnswers: 0, 
    status: '', 
};

module.exports = recentExams;

