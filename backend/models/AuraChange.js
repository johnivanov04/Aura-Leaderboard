// backend/models/AuraChange.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const auraChangeSchema = new Schema(
  {
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    delta: { type: Number, required: true },

    // NEW: who did this change
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },  // denormalized for easy display
  },
  { timestamps: true }           // gives you createdAt / updatedAt
);

module.exports = mongoose.model('AuraChange', auraChangeSchema);
