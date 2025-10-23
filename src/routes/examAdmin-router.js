const express = require('express');
const { checkRole } = require('../middlewares/checkRole.js');
const { authenticateJWT }=require('../middlewares/userAuthenticate.js');
const router = express.Router();

const examAdminController = require('../controllers/examAdminController');

router.get('',examAdminController.getAllSubjects);
// router.get('',examAdminController.getAllSubjects);

router.get('/:subject', examAdminController.getExamBySubject);
// router.get('/:subject',examAdminController.getExamBySubject);

// router.get('/:subject/:topic', authenticateJWT,checkRole(['admin']),examAdminController.getExamByTopic);
router.get('/:subject/:topic',examAdminController.getExamByTopic);

// router.post('/add', authenticateJWT,checkRole(['admin']),examAdminController.addExam);
router.post('/add',authenticateJWT, checkRole(['admin']), examAdminController.addExam);

// router.put('/:subject/:topic', authenticateJWT, checkRole(['admin']),examAdminController.updateExam);
router.put('/:subject/:topic', authenticateJWT, checkRole(['admin']),examAdminController.updateExam);

// router.delete('/:subject/:topic', authenticateJWT, checkRole(['admin']), examAdminController.deleteExam);
router.delete('/:subject/:topic',authenticateJWT, checkRole(['admin']) ,examAdminController.deleteExam);

module.exports = router; 