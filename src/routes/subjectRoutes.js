const express = require('express');
const router = express.Router();
const {
  getSubjects,
  createSubject,
  updateSubjectByIndex,
  deleteSubjectByIndex
} = require('../controllers/subjectController');


router.get('/exams', getSubjects);

router.post('/exams', createSubject);

router.put('/exams/:index', updateSubjectByIndex);

router.delete('/exams/:index', deleteSubjectByIndex);

module.exports = router;
