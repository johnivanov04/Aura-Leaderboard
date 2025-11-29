// backend/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  aura: { type: Number, default: 0 },
  user: {                          // ← NEW
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
