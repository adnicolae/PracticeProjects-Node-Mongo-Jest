const request = require('request');

const geocode = (address, callback) => {
  const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${ encodeURIComponent(address) }.json?access_token=pk.eyJ1IjoiZHJlaW5pY2siLCJhIjoiY2thM25jcXVqMGV3YjNrbGsycWpvbDV0diJ9.w29YuqZ816wobRWdClt1sg&limit=1`;

  request({ url: geocodeURL, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to location services', undefined)
    } else if (response.body.features.length === 0) {
      callback('Unable to find location. Try another search', undefined);
    } else {
      const { body } = response;
      const longitude = body.features[0].center[0];
      const latitude = body.features[0].center[1];
      callback(undefined, { lat: latitude, long: longitude });
    }
  });
}

module.exports = geocode;