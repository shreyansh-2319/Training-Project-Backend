const fs = require('fs');
const path = require('path');

const subjectsFilepath = path.join(__dirname, '../data/subjects.json');
const topicsFilePath = path.join(__dirname, '../data/topics.json');

function readSubjects() {
  try {
    const data = fs.readFileSync(subjectsFilepath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading subjects:', err.message);
    return [];
  }
}

function readTopics() {
  try {
    const data = fs.readFileSync(topicsFilePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.log('Error reading topics:', err.message);
    return [];
  }
}


module.exports = { readSubjects, readTopics };
