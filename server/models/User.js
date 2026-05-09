const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-z0-9_-]+$/,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  vibeTags: [{
    type: String,
    maxlength: 20
  }],
  shareCode: {
    type: String,
    unique: true,
    default: () => nanoid(8)
  },
  responseCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.index({ username: 1 });
userSchema.index({ shareCode: 1 });

module.exports = mongoose.model('User', userSchema);
