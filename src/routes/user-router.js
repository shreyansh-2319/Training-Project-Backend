const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const { authenticateJWT } = require('../middlewares/userAuthenticate'); 
const { checkRole } = require('../middlewares/checkRole'); 


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);


router.get('/all', authenticateJWT, checkRole(['admin']), userController.getAllUsers);

router.get('/:id', authenticateJWT, checkRole(['admin', 'student']), userController.getUserByID);// Allow authenticated users access

// Update Student: Only Admins should update others; students can update their own data.
// The controller must be updated to restrict what a 'student' can update (e.g., password, name, but NOT role).
router.put('/:id', authenticateJWT, checkRole(['admin', 'student']), userController.updateUserById);

router.delete('/:id', authenticateJWT, checkRole(['admin']), userController.deleteUserById);

module.exports = router;