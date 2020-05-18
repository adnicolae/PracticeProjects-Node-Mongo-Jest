const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = 3000;

// Express config paths
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req,res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Andrei'
  });
});

app.get('/about', (req,res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Andrei'
  });
});

app.get('/help', (req,res) => {
  res.render('help', {
    title: 'Help Page',
    message: 'No FAQ',
    name: 'Andrei'
  });
});

app.get('/weather', (req,res) => {
  const address = req.query.address;
  
  if (!address) {
    return res.send({
      error: 'Please provide an address!'
    });
  }

  geocode(address, (error, data) => {
    if (error) {
      return res.send({ error: error });
    }
  
    forecast(data, (error, forecast) => {
      if (error) {
        return res.send({ error: error });
      } 
      res.send({ 
        forecast: forecast.forecast,
        location: forecast.location,
        time: forecast.time,
        icon: forecast.icon,
        address: address
      });
    });
  });
});




app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Error',
    errorMessage: 'Help topic not found.',
    name: 'Andrei'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Error',
    errorMessage: 'Page not found.',
    name: 'Andrei'
  });
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));