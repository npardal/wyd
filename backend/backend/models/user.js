const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  interests: { type: [String] },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  social: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  toggle: { type: Boolean, default: false } // New field for "hanging out" toggle
});

module.exports = mongoose.model('User', userSchema);
