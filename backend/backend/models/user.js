const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // User's email (unique)
  interests: { type: [String] }, // Array of user interests
  location: {
    latitude: { type: Number, required: true }, // Latitude of the user's location
    longitude: { type: Number, required: true } // Longitude of the user's location
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of friends' ObjectIds
});

// Compile the model based on the schema
module.exports = mongoose.model('User', userSchema);