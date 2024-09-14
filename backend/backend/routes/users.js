var express = require('express');
var router = express.Router(); // Only one declaration of router
const User = require('../models/user');
const { getDistanceFromLatLonInMiles } = require('../utils/distance');

// Route to create a user
router.post('/', async (req, res) => {
  console.log(req.body); // Log the request body to the console
  const { name, email, interests, latitude, longitude, social } = req.body;
  
  try {
    const newUser = new User({
      name,
      email,
      interests,
      location: { latitude, longitude },
      social
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/:userId/location', async (req, res) => {
  const { userId } = req.params;
  const { latitude, longitude, toggle } = req.body;

  try {
    // Update user location and toggle status
    const user = await User.findByIdAndUpdate(
      userId,
      { location: { latitude, longitude }, toggle: toggle },
      { new: true }
    ).populate('friends');

    // Notify friends who are nearby and also have the toggle on
    user.friends.forEach(friend => {
      // Check if the friend is within 2 miles
      const distance = getDistanceFromLatLonInMiles(
        latitude,
        longitude,
        friend.location.latitude,
        friend.location.longitude
      );

      // Only notify if both users have their toggle "on"
      if (distance <= 2 && friend.toggle && user.toggle) {
        const friendSocket = connectedClients[friend._id]; // Check if friend is connected
        if (friendSocket) {
          friendSocket.send(JSON.stringify({
            type: 'friend-nearby',
            friendId: user._id,
            friendName: user.name,
            distance
          }));
        }
      }
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Route to get nearby friends
router.get('/:userId/nearby-friends', async (req, res) => {
  const { userId } = req.params;
  const maxDistance = 2; // Max distance in miles

  try {
    // Find the user and populate their friends
    const user = await User.findById(userId).populate('friends');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter friends based on proximity
    const nearbyFriends = user.friends.filter(friend => {
      const distance = getDistanceFromLatLonInMiles(
        user.location.latitude,
        user.location.longitude,
        friend.location.latitude,
        friend.location.longitude
      );
      return distance <= maxDistance; // Only include friends within 2 miles
    });

    res.status(200).json(nearbyFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
