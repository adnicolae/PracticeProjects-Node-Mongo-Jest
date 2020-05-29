const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('./utils/messages'); 
const { addUser, getUser, getUsersInRoom, removeUser  } = require('./utils/users');

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

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })
    
    if (error) {
      return callback(error);
    }

    socket.join(user.room)

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${ user.username } has joined!`));

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);
    
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    const url = `https://www.google.com/maps?q=${ location.lat },${ location.long }`;
    const user = getUser(socket.id);
    io.emit('locationMessage', generateLocationMessage(user.username, url))
    callback();
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${ user.username } has left!`))
    }
  });
});

app.get('/', (req, res) => {
  res.render(index);
});

server.listen(port, () => console.log('Listening on port: ', port));