const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  responderFingerprint: {
    type: String,
    required: true
  },
  answers: [{
    questionText: String,
    answer: String,
    category: String
  }],
  shareCode: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

responseSchema.index({ targetUserId: 1, responderFingerprint: 1 }, { unique: true });

module.exports = mongoose.model('Response', responseSchema);
