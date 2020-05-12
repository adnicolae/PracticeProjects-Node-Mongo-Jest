const request = require('request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');



const location = process.argv[2];

if (location) {
  geocode(location, (error, data) => {
    if (error) {
      return console.log(error);
    }
  
    forecast(data, (error, forecast) => {
      if (error) {
        return console.log(error);
      } 
      console.log(forecast);
    });
  });
} else {
  console.log('Please provide a location');
}

