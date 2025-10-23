const express = require('express');
const router = express.Router();
const {getCourses, getTopicsByCourse, getQuestionsByTopic,createQuestion, deleteQuestion} = require('../controllers/questionsController.js');
const { validateNewQuestion, handleValidationErrors } = require('../middlewares/questionsValidation.js');

// List of all courses
router.get('/', getCourses);

router.get('/:courseName/topics', getTopicsByCourse);


router.get('/:courseName/topics/:topicName/questions', getQuestionsByTopic);

//Create a new question
router.post(
    '/:courseName/topics/:topicName/questions/add', 
    validateNewQuestion,
    handleValidationErrors,
    createQuestion
);

//Delete a question
router.delete( '/:courseName/topics/:topicName/questions/:questionId',  deleteQuestion);

module.exports = router;