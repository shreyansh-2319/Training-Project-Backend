// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const studentRouter = require('../Training-Project-Backend/src/routes/student-router.js'); 
const recentExamsRouter = require('../Training-Project-Backend/src/routes/recentExam-router.js');
const examAdminRouter = require('../Training-Project-Backend/src/routes/examAdmin-router.js');
const passport = require('passport');
require('../Training-Project-Backend/src/config/passport.js')(passport);

const db=require('./db.js');

const app = express();  
const PORT = 3000;

app.use(express.json());

app.use(bodyParser.json());
app.use(passport.initialize());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/students', studentRouter);

app.use('/recentExams', recentExamsRouter);

app.use('/exams', examAdminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
