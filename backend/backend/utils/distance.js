// utils/distance.js
// using the haversine location 
function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const earthRadiusMiles = 3958.8; // Radius of the Earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLon / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusMiles * c; // Distance in miles
    return distance;
  }
  
  module.exports = { getDistanceFromLatLonInMiles };
  