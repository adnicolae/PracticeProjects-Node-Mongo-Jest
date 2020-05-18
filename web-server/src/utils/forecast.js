const request = require('request');

const forecast = ({ lat, long }, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=2f52301bf02cb5f40786d83a4b1bd9f6&query=${ lat },${ long }&units=m`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather service', undefined);
    } else if (response.body.error) {
      callback('Unable to find location', undefined);
    } else {
      const { body: { location: { name, region, country, localtime }, current: { weather_descriptions, temperature, weather_icons } }} = response;
      const forecast = `It is ${ weather_descriptions[0] } and ${ temperature } degrees out.`;
      callback(undefined, { icon: weather_icons[0], time: localtime, forecast: forecast, location: `${ name }, ${ region }, ${ country }` });
    }
  });
}

module.exports = forecast;
