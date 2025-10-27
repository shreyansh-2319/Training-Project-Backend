const express = require('express');
const router = express.Router();
const {getCourses, getTopicsByCourse, getQuestionsByTopic,createQuestion,updateQuestion, deleteQuestion} = require('../controllers/questionsController.js');
const { validateNewQuestion, handleValidationErrors } = require('../middlewares/questionsValidation.js');

// List of all courses
router.get('/', getCourses);

router.get('/:courseName/topics', getTopicsByCourse);//topics

router.get('/:courseName/topics/:topicName/questions', getQuestionsByTopic);//questions of a topic

//Create a new question
router.post(
    '/:courseName/topics/:topicName/questions/add', 
    validateNewQuestion,
    handleValidationErrors,
    createQuestion
);

//patch
router.patch('/:courseName/:topicName/questions/:questionId', updateQuestion);

//Delete a question
router.delete( '/:courseName/topics/:topicName/questions/:questionId',  deleteQuestion);

module.exports = router;