const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../db/recentExams.json");

function readData() {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

const addExam= (req, res) => {
  const exams = readData();
  const { examId, examName, studentId, studentName, score, totalQuestions, correctAnswers, status } = req.body;
  const date = new Date().toLocaleString();
  const newExam = {
    examId,
    examName,
    studentId,
    studentName,
    score,
    totalQuestions,
    correctAnswers,
    status,
    date,
  };
  exams.push(newExam);
  writeData(exams);
  res.status(201).json({ message: "Exam record added successfully", newExam });
};

const getAllExams= (req, res) => {
  const exams = readData();
  res.json(exams);
};

const getExamById= (req, res) => {
  const exams = readData();
  const id = req.params.id;
  const found = exams.filter(e => e.studentId == id || e.examId == id);

  if (found.length === 0) return res.status(404).json({ message: "Record not found" });
  res.json(found);
};

module.exports = {
    addExam,
    getAllExams,
    getExamById,
}