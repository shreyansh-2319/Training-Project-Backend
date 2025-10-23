const express = require('express');
const router = express.Router();

const recentExamsController = require('../controllers/recentExamsController');

const {
    addExam,
    getAllExams,
    getExamById,
} = require("../controllers/recentExamsController");

router.get('/', recentExamsController.getAllExams);

router.get('/exam/:id', recentExamsController.getExamById);

router.post('/add', recentExamsController.addExam);


module.exports = router;