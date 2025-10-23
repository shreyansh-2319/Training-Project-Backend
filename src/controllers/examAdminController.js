const mongoose = require('mongoose');
const ExamAdmin = require('../models/examAdminSchema'); 
const { v4: uuidv4 } = require('uuid');

const getAllSubjects = async (req, res, next) => {
    try {
        const exams = await ExamAdmin.find({});
        res.json(exams);
    } catch (err) {
        console.error("Error fetching all exams:", err);
        next(err);
    }
};

const getExamBySubject = async (req, res, next) => {
    const subject = req.params.subject; 
    try {
        const exam = await ExamAdmin.find({ subject: subject });
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(exam);
    } catch (err) {
        console.error(`Error finding exam by topic (${topic}):`, err);
        next(err);
    }
};

const getExamByTopic = async (req, res, next) => {
    const subject = req.params.subject;
    const topic = req.params.topic;
    const logIdentifier=`${subject}/${topic}`;
    try {
        const filteredExams = await ExamAdmin.find({
            subject: subject,
            topic: topic });

        if (filteredExams.length === 0) {
            return res.status(404).json({ message: `No exams found for topic '${topic}' under subject '${subject}'` });
        }
        res.json(filteredExams);
    } catch (err) {
        console.error(`Error filtering exams by topic (${logIdentifier}):`, err);
        next(err);
    }
};

const addExam = async (req, res, next) => {
    const { subject, topic, difficulty, status, duration } = req.body;
    const examId = uuidv4();
    const newExam = new ExamAdmin({
        examId,
        subject,
        topic,
        difficulty,
        status, 
        duration 
    });

    try {
        const savedExam = await newExam.save();
        res.status(201).json({ message: 'New exam added successfully', newExam: savedExam });
    } catch (err) {
        console.error("Error adding new exam:", err);
        next(err);
    }
};

const updateExam = async (req, res, next) => {
    const { subject: paramSubject, topic: paramTopic } = req.params;
    const updateFields = req.body;

    try {
        const updatedExam = await ExamAdmin.findOneAndUpdate(
            { subject: paramSubject, topic: paramTopic },
            { $set: updateFields },
            { new: true, runValidators: true } 
        );

        if (!updatedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        res.json({ message: 'Exam updated successfully', exam: updatedExam });
    } catch (err) {
        console.error(`Error updating exam (${paramSubject}/${paramTopic}):`, err);
        next(err);
    }
};

const deleteExam = async (req, res, next) => {
    const { subject: paramSubject, topic: paramTopic } = req.params;

    try {
        const deletedExam = await ExamAdmin.findOneAndDelete({ 
            subject: paramSubject, 
            topic: paramTopic 
        });

        if (!deletedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        res.json({ message: 'Exam deleted successfully', deletedExam: deletedExam });
    } catch (err) {
        console.error(`Error deleting exam (${paramSubject}/${paramTopic}):`, err);
        next(err);
    }
};

module.exports = {
    getAllSubjects,
    getExamBySubject,
    getExamByTopic,
    addExam,
    updateExam,
    deleteExam,
};