const path = require('path');
const express = require('express');

const app = express();
const port = 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath))

app.get('/weather', (req, res) => {
  res.send({
    forecast: 27,
    location: 'Lodon'
  })
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));