const User = require('../models/User');

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('name username avatar vibeTags shareCode responseCount createdAt');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const getUserByShareCode = async (req, res) => {
  try {
    const user = await User.findOne({ shareCode: req.params.shareCode })
      .select('name username avatar vibeTags shareCode responseCount');

    if (!user) return res.status(404).json({ error: 'Mirror not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = { getUserByUsername, getUserByShareCode };
