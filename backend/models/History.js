// backend/models/History.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    delta: { type: Number, required: true },
    // NEW: who changed it
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    username: { type: String }, // denormalized for quick display
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
