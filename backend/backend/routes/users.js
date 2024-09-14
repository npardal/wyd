var express = require('express');
var router = express.Router(); // Only one declaration of router
const User = require('../models/user');
const { getDistanceFromLatLonInMiles } = require('../utils/distance');

// Create a new USER:
router.post('/', async (req, res) => {
  console.log(req.body); // Log the request body to the console
  const { name, email, interests, latitude, longitude, social } = req.body;
  
  try {
    const newUser = new User({
      name,
      email,
      interests,
      phone, 
      location: { latitude, longitude },
      social
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Route to get nearby friends
router.get('/:userId/nearby-friends', async (req, res) => {
  const { userId } = req.params;
  const maxDistance = 2; // Maximum distance in miles

  try {
    const user = await User.findById(userId).populate('friends');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter friends by proximity and toggle status
    const nearbyFriends = user.friends.filter(friend => {
      const distance = getDistanceFromLatLonInMiles(
        user.location.latitude,
        user.location.longitude,
        friend.location.latitude,
        friend.location.longitude
      );
      return distance <= maxDistance && friend.toggle; // Only include friends within 2 miles and have their toggle on
    });

    // Map the necessary info for the response
    const result = nearbyFriends.map(friend => ({
      name: friend.name,
      phone: friend.phone,
      social: friend.social
    }));

    res.status(200).json(result); // Send the filtered and mapped friends data as a response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to update user location
router.put('/:userId/location', async (req, res) => {
  const { userId } = req.params;
  const { latitude, longitude, toggle } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      { location: { latitude, longitude }, toggle },
      { new: true }
    );

    res.status(200).send('Update received');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
