const { generateQuestionSet } = require('../services/questionEngine');

const generateQuestions = async (req, res) => {
  try {
    const questions = generateQuestionSet();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
};

module.exports = { generateQuestions };
