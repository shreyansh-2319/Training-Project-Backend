const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userSchema'); 


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (err) {
        console.error("Error fetching all users:", err);
        next(err);
    }
};

const getUserByID = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await User.findOne({ userId: userId }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error finding user by ID:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const registerUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
      try {
        console.log("Registering user with email:", email);
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const lastUser = await User.findOne().sort({ userId: -1 });
        const newUserId = lastUser ? lastUser.userId + 1 : 1;
        const newUser = await User.create({
            userId: newUserId, 
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: 'student'
        });
        const userResponse = newUser.toObject(); 
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const Payload = {
            userId: user.userId,
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


const updateUserById = async (req, res) => {
    const userIdToUpdate = parseInt(req.params.id);
    const authenticatedUser = req.user; 
    const isAdmin = authenticatedUser.role === 'admin';
    if (!isAdmin && authenticatedUser.userId !== userIdToUpdate) {
        return res.status(403).json({ message: 'Access forbidden: You can only update your own account.' });
    }
    const { role, ...restOfData } = req.body; 
    let updatedData = { ...restOfData };
    if (role !== undefined && !isAdmin) {
        console.warn(`Unauthorized attempt to change role by user: ${authenticatedUser.email}`);
    } else if (role !== undefined && isAdmin) {
        updatedData.role = role; 
    }
    try {
        if (updatedData.password) 
        {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        const updatedUser = await User.findOneAndUpdate(
            { userId: userIdToUpdate }, 
            { $set: updatedData },
            { new: true, runValidators: true } 
        ).select('-password'); 
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Internal server error during update', error: error.message });
    }
};

const deleteUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const deletedUser = await User.findOneAndDelete({ userId: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const deletedUserResponse = deletedUser.toObject();
        delete deletedUserResponse.password;
        res.status(200).json({ 
            message: `User with ID ${userId} deleted successfully.`, 
            user: deletedUserResponse 
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Internal server error during delete' });
    }
};

module.exports = {
    getAllUsers,
    getUserByID,
    registerUser,
    updateUserById, 
    deleteUserById,
    loginUser,  
};