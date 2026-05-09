const Report = require('../models/Report');
const User = require('../models/User');

const getShareCard = async (req, res) => {
  try {
    const { shareCode } = req.params;

    const user = await User.findOne({ shareCode }).select('name username');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const report = await Report.findOne({ shareCode });
    if (!report) return res.status(404).json({ error: 'Report not generated yet' });

    res.json({
      name: user.name,
      username: user.username,
      archetype: report.archetype,
      shareCardText: report.shareCardText,
      traits: report.traits,
      shareCode
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get share card data' });
  }
};

module.exports = { getShareCard };
