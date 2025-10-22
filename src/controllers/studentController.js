const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userStudent = require('../models/userStudentSchema'); 


const getAllStudents = async (req, res, next) => {
    try {
        const users = await userStudent.find().select('-password'); 
        res.json(users);
    } catch (err) {
        console.error("Error fetching all students:", err);
        next(err);
    }
};

const getStudentByID = async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const user = await userStudent.findOne({ studentId: studentId }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error finding student by ID:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const registerStudent = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
      try {
        const userExists = await userStudent.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const lastStudent = await userStudent.findOne().sort({ studentId: -1 });
        const newStudentId = lastStudent ? lastStudent.studentId + 1 : 1;
        const newUser = await userStudent.create({
            studentId: newStudentId, 
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: req.body.role || 'student'
        });
        const userResponse = newUser.toObject(); 
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Error registering student', error: error.message });
    }
};

const loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userStudent.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const Payload = {
            studentId: user.studentId,
            email: user.email,
            role: user.role, 
        };
        
        const token = jwt.sign(Payload, process.env.JWT_Secret, { expiresIn: '1h' });
        
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: { ...Payload } 
        });
        
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
};


const updateStudentById = async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { role, ...updatedData } = req.body; 

    try {
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        const updatedStudent = await userStudent.findOneAndUpdate(
            { studentId: studentId },
            { $set: updatedData },
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        res.status(200).json(updatedStudent);

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Internal server error during update', error: error.message });
    }
};


const deleteStudentById = async (req, res) => {
    const studentId = parseInt(req.params.id);
    
    try {
        const deletedStudent = await userStudent.findOneAndDelete({ studentId: studentId });

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const deletedStudentResponse = deletedStudent.toObject();
        delete deletedStudentResponse.password;

        res.status(200).json({ 
            message: `Student with ID ${studentId} deleted successfully.`, 
            student: deletedStudentResponse 
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Internal server error during delete' });
    }
};

module.exports = {
    getAllStudents,
    getStudentByID,
    registerStudent,
    updateStudentById, 
    deleteStudentById,
    loginStudent  
};