const Response = require('../models/Response');
const User = require('../models/User');
const Report = require('../models/Report');
const { analyzeResponses } = require('../services/geminiService');

const submitResponse = async (req, res) => {
  try {
    const { shareCode } = req.params;
    const { answers, fingerprint } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length < 5) {
      return res.status(400).json({ error: 'At least 5 answers required' });
    }

    if (!fingerprint) {
      return res.status(400).json({ error: 'Fingerprint required' });
    }

    const user = await User.findOne({ shareCode });
    if (!user) return res.status(404).json({ error: 'Mirror not found' });

    // Check duplicate
    const existing = await Response.findOne({
      targetUserId: user._id,
      responderFingerprint: fingerprint
    });

    if (existing) {
      return res.status(409).json({ error: 'You already answered this mirror.' });
    }

    // Sanitize answers
    const sanitizedAnswers = answers.map(a => ({
      questionText: String(a.questionText || '').slice(0, 200),
      answer: String(a.answer || '').slice(0, 200),
      category: String(a.category || 'general').slice(0, 50)
    }));

    await Response.create({
      targetUserId: user._id,
      responderFingerprint: fingerprint,
      answers: sanitizedAnswers,
      shareCode
    });

    // Update response count
    await User.findByIdAndUpdate(user._id, { $inc: { responseCount: 1 } });

    // Regenerate report if enough responses
    const allResponses = await Response.find({ targetUserId: user._id });

    if (allResponses.length >= 1) {
      // Trigger async analysis
      generateReport(user, allResponses).catch(console.error);
    }

    res.status(201).json({ message: 'Response submitted successfully!', responseCount: allResponses.length });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You already answered this mirror.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

const generateReport = async (user, allResponses) => {
  const flatAnswers = allResponses.map(r => r.answers).flat();
  const analysis = await analyzeResponses(user.name, flatAnswers);

  await Report.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      shareCode: user.shareCode,
      ...analysis,
      responseCount: allResponses.length,
      lastUpdated: new Date()
    },
    { upsert: true, new: true }
  );
};

module.exports = { submitResponse };
