const express = require('express');
const router = express.Router();
const {
  addTopic,
  getAllTopics,
  updateTopicByIndex,
  deleteTopicByIndex
} = require('../controllers/topicController');


router.post('/subjects/:subjectName/topics', addTopic);
router.get('/subjects/:subjectName/topics/:topicName', getAllTopics);
router.put('/:subjectName/topics/:index', updateTopicByIndex);
router.delete('/:subjectName/topics/:index', deleteTopicByIndex);

module.exports = router;
