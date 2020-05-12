const request = require('request');

const forecast = ({ lat, long }, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=2f52301bf02cb5f40786d83a4b1bd9f6&query=${ lat },${ long }&units=m`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather service', undefined);
    } else if (response.body.error) {
      callback('Unable to find location', undefined);
    } else {
      const { body: { location: { name }, current: { weather_descriptions, temperature } }} = response;
      const forecast = `It is ${ weather_descriptions[0] } and ${ temperature } degrees in ${ name }.`;
      callback(undefined, forecast);
    }
  });
}

module.exports = forecast;