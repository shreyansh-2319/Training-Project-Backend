const fs = require('fs');
const path = require('path');
const QUESTION_DATA_PATH = path.join(__dirname, '../Data/questions.json');
const COURSES_DATA_PATH = path.join(__dirname, '../Data/courses.json');

const getCoursesFromFile = () => {
    const courses = fs.readFileSync(COURSES_DATA_PATH);
    return JSON.parse(courses);
}

const getQuestionsDataFromFile = () => { 
    const questions = fs.readFileSync(QUESTION_DATA_PATH);
    return JSON.parse(questions);
}

// 1. GET /courses: Get list of all courses
exports.getCourses = (req, res, next) => {
    try{
        res.json(getCoursesFromFile());
    }
    catch(err){
        next(err);
    }
} 

// 2.  Get topics for a course
exports.getTopicsByCourse = (req, res, next) => {
    try{
        const questionsData = getQuestionsDataFromFile();
        const courseName = req.params.courseName;
        
        const course = questionsData.find(c => c.courseName && c.courseName.toLowerCase() === courseName.toLowerCase());
        
        if(course){
            return res.json(course.topics); 
        } 
        else {
            res.status(404).json({ error: 'Course not found' });
        }
    } 
    catch(err){
        next(err);
    }
}

// 3. Get questions for a topic
exports.getQuestionsByTopic = (req, res, next) => {
    try{
        const questionsData = getQuestionsDataFromFile();
        const courseName = req.params.courseName;
        const topicName = req.params.topicName;
        
        const course = questionsData.find(c => c.courseName && c.courseName.toLowerCase() === courseName.toLowerCase());
        
        if(course){
            const topic = course.topics.find(t => t.topicName && t.topicName.toLowerCase() === topicName.toLowerCase());
            
            if(topic){
                return res.json(topic.questions);
            } else {
                return res.status(404).json({ error: `Topic '${topicName}' not found in course '${courseName}'` });
            }
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch(err){
        next(err);
    }
}


exports.createQuestion = (req, res, next) => { 
    try {
        const questionsData = getQuestionsDataFromFile();
        const courseName = req.params.courseName;
        const topicName = req.params.topicName; 
        const newQuestion = req.body;
        
        const course = questionsData.find(c => c.courseName && c.courseName.toLowerCase() === courseName.toLowerCase());
        
        if(course && topicName){
            const topic = course.topics.find(t => t.topicName && t.topicName.toLowerCase() === topicName.toLowerCase());
            
            if(topic){
                const nextId = topic.questions.length > 0 ? Math.max(...topic.questions.map(q => q.id)) + 1  : 1;
                newQuestion.id = nextId; 
                
                topic.questions.push(newQuestion);

                fs.writeFileSync(QUESTION_DATA_PATH, JSON.stringify(questionsData, null, 2));
                
                return res.status(201).json(newQuestion); 
            } else {
                return res.status(404).json({ error: `Topic '${topicName}' not found in course '${courseName}'` });
            }
        } else {
            return res.status(404).json({ error: 'Course or Topic Name is missing from URL.' });
        }
    } 
    catch(err) {
        next(err); 
    }
}

// 5. Delete a question
exports.deleteQuestion = (req, res, next) => {
    try {
        const questionsData = getQuestionsDataFromFile();
        const courseName = req.params.courseName;
        const topicName = req.params.topicName; 
        const questionId = parseInt(req.params.questionId, 10); 
        
        const course = questionsData.find(c => c.courseName && c.courseName.toLowerCase() === courseName.toLowerCase());
        
        if (course) {
            const topic = course.topics.find(t => t.topicName && t.topicName.toLowerCase() === topicName.toLowerCase());
            
            if (topic) {
                const initialLength = topic.questions.length;
                
                topic.questions = topic.questions.filter(question => question.id !== questionId);
                
                if (topic.questions.length < initialLength) {
                  
                    topic.questionCount = topic.questions.length;
                    
                    fs.writeFileSync(QUESTION_DATA_PATH, JSON.stringify(questionsData, null, 2));
                    return res.status(200).json({ message: `Question with ID ${questionId} deleted successfully from topic '${topicName}'` });
                } else {
                    return res.status(404).json({ error: `Question not found with ID ${questionId} in topic '${topicName}'.` });
                }
            } 
            else {
                return res.status(404).json({ error: `Topic '${topicName}' not found in course '${courseName}'.` });
            }
        } 
        else {
            return res.status(404).json({ error: 'Course not found' });
        }
    } 
    catch(err) {
        next(err); 
    }
}

exports.updateQuestion = (req, res, next) => {
    try {
        const questionsData = getQuestionsDataFromFile();
        const courseName = req.params.courseName;
        const topicName = req.params.topicName; 
        const questionId = parseInt(req.params.questionId, 10);
        
        const { id, ...updates } = req.body; 
        const course = questionsData.find(c => 
            c.courseName && c.courseName.toLowerCase() === courseName.toLowerCase()
        );
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const topic = course.topics.find(t => 
            t.topicName && t.topicName.toLowerCase() === topicName.toLowerCase()
        );
        if (!topic) {
            return res.status(404).json({ error: `Topic '${topicName}' not found in course '${courseName}'` });
        }
        const questionIndex = topic.questions.findIndex(q => q.id === questionId);
        
        if (questionIndex === -1) {
            return res.status(404).json({ error: `Question not found with ID ${questionId} in topic '${topicName}'.` });
        }

        let existingQuestion = topic.questions[questionIndex];
        const updatedQuestion = {
            ...existingQuestion,
            ...updates,
            id: existingQuestion.id
        };
        topic.questions[questionIndex] = updatedQuestion;
        fs.writeFileSync(QUESTION_DATA_PATH, JSON.stringify(questionsData, null, 2));
        
        return res.status(200).json(updatedQuestion); 
        
    } 
    catch(err) {
        next(err); 
    }
};