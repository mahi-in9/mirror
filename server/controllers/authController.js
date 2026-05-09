const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  try {
    const { name, username, email, password, vibeTags } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const usernameClean = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (usernameClean.length < 3) return res.status(400).json({ error: 'Username too short' });

    const exists = await User.findOne({ $or: [{ email }, { username: usernameClean }] });
    if (exists) {
      return res.status(409).json({ error: exists.email === email ? 'Email already registered' : 'Username taken' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim().slice(0, 50),
      username: usernameClean,
      email: email.toLowerCase(),
      password: hashed,
      vibeTags: (vibeTags || []).slice(0, 5)
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        shareCode: user.shareCode,
        vibeTags: user.vibeTags
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        shareCode: user.shareCode,
        vibeTags: user.vibeTags
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    shareCode: req.user.shareCode,
    vibeTags: req.user.vibeTags,
    responseCount: req.user.responseCount
  });
};

module.exports = { register, login, getMe };
