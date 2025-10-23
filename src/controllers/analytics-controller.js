const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/analytics.json');

function readAnalytics() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

// Get all analytics (computed)
exports.getAllAnalytics = (req, res) => {
  const data = readAnalytics();
  const processed = data.map(a => ({
    ...a,
    accuracy: (a.correctAnswers / a.attemptedQuestions) * 100,
    percentage: (a.score / a.totalQuestions) * 100,
    passStatus: (a.score / a.totalQuestions) * 100 >= 50 ? 'Passed' : 'Failed'
  }));
  res.json(processed);
};

// Get student analytics
exports.getStudentAnalytics = (req, res) => {
  const data = readAnalytics().filter(a => a.studentId === req.params.id);
  if (!data.length) return res.status(404).json({ message: 'No data for this student' });

  const processed = data.map(a => ({
    ...a,
    accuracy: (a.correctAnswers / a.attemptedQuestions) * 100,
    percentage: (a.score / a.totalQuestions) * 100,
    passStatus: (a.score / a.totalQuestions) * 100 >= 50 ? 'Passed' : 'Failed'
  }));

  const averageScore = processed.reduce((sum, a) => sum + a.score, 0) / processed.length;
  res.json({ studentId: req.params.id, averageScore, attempts: processed });
};

// Add analytics (admin only)
exports.addAnalytics = (req, res) => {
  const data = readAnalytics();
  const newEntry = { id: Date.now(), ...req.body };
  data.push(newEntry);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.status(201).json({ message: 'Analytics added successfully', newEntry });
};

// Leaderboard
exports.getLeaderboard = (req, res) => {
  const data = readAnalytics();

  const leaderboard = data.reduce((acc, curr) => {
    const student = acc.find(a => a.studentId === curr.studentId);
    if (student) {
      student.totalScore += curr.score;
      student.exams += 1;
    } else {
      acc.push({
        studentId: curr.studentId,
        studentName: curr.studentName,
        totalScore: curr.score,
        exams: 1
      });
    }
    return acc;
  }, []);

  leaderboard.forEach(s => {
    s.averageScore = s.totalScore / s.exams;
  });

  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  res.json(leaderboard.slice(0, 5));
};
