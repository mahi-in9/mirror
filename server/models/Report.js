const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  shareCode: {
    type: String,
    required: true,
    index: true
  },
  archetype: { type: String, default: 'Unknown Entity' },
  summary: { type: String, default: '' },
  consensus: [{ type: String }],
  traits: {
    chaos: { type: Number, default: 50, min: 0, max: 100 },
    trust: { type: Number, default: 50, min: 0, max: 100 },
    humor: { type: Number, default: 50, min: 0, max: 100 },
    mystery: { type: Number, default: 50, min: 0, max: 100 },
    intelligence: { type: Number, default: 50, min: 0, max: 100 },
    emotionalUnpredictability: { type: Number, default: 50, min: 0, max: 100 }
  },
  quotes: [{ type: String }],
  shareCardText: { type: String, default: '' },
  socialEnergy: { type: Number, default: 50, min: 0, max: 100 },
  mostCommonPerception: { type: String, default: '' },
  responseCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
