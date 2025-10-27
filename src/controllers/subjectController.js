const { readSubjects } = require("../utils/jsonReader");
const { writeSubjects } = require("../utils/jsonWriter");

const getSubjects = (req, res) => {
  const subjects = readSubjects();
  if (!subjects) {
    return res.status(500).json({ error: "Failed to read subjects data" });
  }
  res.json(subjects);
};

const createSubject = (req, res) => {
  const subjects = readSubjects() || [];
  const newSubject = req.body;

  if (!newSubject || !newSubject.subjectName) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  subjects.push(newSubject);
  writeSubjects(subjects);
  res
    .status(201)
    .json({ message: "Subject added successfully", subject: newSubject });
};

const updateSubjectByIndex = (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedSubject = req.body;
  const subjects = readSubjects();

  if (!subjects || index < 0 || index >= subjects.length) {
    return res.status(404).json({ error: "Invalid subject index" });
  }

  if (!updatedSubject || !updatedSubject.subjectName) {
    return res.status(400).json({ error: "Updated subject must have a subjectName" });
  }

  subjects[index] = updatedSubject;
  writeSubjects(subjects);
  res.json({
    message: "Subject updated successfully",
    subject: updatedSubject,
  });
};

const deleteSubjectByIndex = (req, res) => {
  const index = parseInt(req.params.index, 10);
  const subjects = readSubjects();

  if (!subjects || index < 0 || index >= subjects.length) {
    return res.status(404).json({ error: "Invalid subject index" });
  }

  const removedSubject = subjects.splice(index, 1)[0];
  writeSubjects(subjects);
  res.json({
    message: "Subject deleted successfully",
    subject: removedSubject,
  });
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubjectByIndex,
  deleteSubjectByIndex,
};
