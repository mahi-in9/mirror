const Report = require('../models/Report');
const User = require('../models/User');
const Response = require('../models/Response');
const { analyzeResponses } = require('../services/geminiService');

const getReport = async (req, res) => {
  try {
    const { shareCode } = req.params;

    const user = await User.findOne({ shareCode });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allResponses = await Response.find({ targetUserId: user._id });

    if (allResponses.length === 0) {
      return res.status(404).json({
        error: 'no_responses',
        message: 'No responses yet. Share your link to get started!',
        responseCount: 0
      });
    }

    let report = await Report.findOne({ shareCode });

    // Generate or regenerate if stale or missing
    if (!report || (Date.now() - report.lastUpdated > 10 * 60 * 1000 && allResponses.length > report.responseCount)) {
      const flatAnswers = allResponses.map(r => r.answers).flat();
      const analysis = await analyzeResponses(user.name, flatAnswers);

      report = await Report.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          shareCode,
          ...analysis,
          responseCount: allResponses.length,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      user: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        vibeTags: user.vibeTags
      },
      report,
      responseCount: allResponses.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

module.exports = { getReport };
