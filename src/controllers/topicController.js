const { readTopics, readSubjects } = require("../utils/jsonReader");
const { writeSubjects, writeTopics } = require("../utils/jsonWriter");

const addTopic = (req, res) => {
  try {
    const { subjectName } = req.params;
    const newTopic = {
      ...req.body,
      subjectName
    };

    if (!newTopic.topicName) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Topic name is required"
      });
    }

    const topics = readTopics();
    topics.push(newTopic);

    const allSubjects = readSubjects();
    const subjectIndex = allSubjects.findIndex(
      sub => sub.subjectName.toLowerCase() === subjectName.toLowerCase()
    );

    if (subjectIndex === -1) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `Subject '${subjectName}' not found`
      });
    }

    if (!allSubjects[subjectIndex].topics) {
      allSubjects[subjectIndex].topics = [];
    }

    allSubjects[subjectIndex].topics.push(newTopic);
    writeSubjects(allSubjects);
    writeTopics(topics);

    res.status(201).json({
      status: 201,
      success: true,
      message: "Topic added successfully",
      topic: newTopic
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to add topic",
      error: err.message
    });
  }
};

const getAllTopics = (req, res) => {
  try {
    const { subjectName, topicName } = req.params;
    const topics = readTopics();

    const filtered = topics.filter(
      t =>
        t.subjectName.toLowerCase() === subjectName.toLowerCase() &&
        t.topicName.toLowerCase() === topicName.toLowerCase()
    );

    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve topics",
      error: err.message
    });
  }
};

const updateTopicByIndex = (req, res) => {
  const { subjectName, index } = req.params;
  const updated = req.body;
  const topics = readTopics();

  const subjectTopics = topics.filter(
    t => t.subjectName.toLowerCase() === subjectName.toLowerCase()
  );

  if (index < 0 || index >= subjectTopics.length) {
    return res.status(404).json({ error: "Invalid subject or topic index" });
  }

  const originalTopic = subjectTopics[index];
  const updatedTopic = {
    ...originalTopic,
    ...updated,
    subjectName,
    topicName: originalTopic.topicName
  };

  topics[topics.indexOf(originalTopic)] = updatedTopic;
  writeTopics(topics);

  res.json({ message: "Topic updated successfully", topic: updatedTopic });
};

const deleteTopicByIndex = (req, res) => {
  const { subjectName, index } = req.params;
  const topics = readTopics();

  const subjectTopics = topics.filter(
    t => t.subjectName.toLowerCase() === subjectName.toLowerCase()
  );

  if (index < 0 || index >= subjectTopics.length) {
    return res.status(404).json({ error: "Invalid subject or topic index" });
  }

  const topicToRemove = subjectTopics[index];
  const removed = topics.splice(topics.indexOf(topicToRemove), 1)[0];
  writeTopics(topics);

  res.json({ message: "Topic deleted successfully", topic: removed });
};

module.exports = {
  addTopic,
  getAllTopics,
  updateTopicByIndex,
  deleteTopicByIndex
};