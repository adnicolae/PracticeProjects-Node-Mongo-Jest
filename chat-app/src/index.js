const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('./utils/messages'); 

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

// Express config paths
const publicDirectoryPath = path.join(__dirname, '../public');

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New websocket connection');

  socket.emit('message', generateMessage('Welcome!'));

  socket.broadcast.emit('message', generateMessage('A new user has joined'));

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    const url = `https://www.google.com/maps?q=${ location.lat },${ location.long }`;
    io.emit('locationMessage', generateLocationMessage(url))
    callback();
  })

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('An user has left!'))
  });
});

app.get('/', (req, res) => {
  res.render(index);
});

server.listen(port, () => console.log('Listening on port: ', port));