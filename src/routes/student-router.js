const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

router.post('/register', studentController.registerStudent);
router.post('/login',studentController.loginStudent);

router.get('', studentController.getAllStudents);

router.get('/:id', studentController.getStudentByID);

router.put('/:id', studentController.updateStudentById);

router.delete('/:id', studentController.deleteStudentById);

module.exports = router;