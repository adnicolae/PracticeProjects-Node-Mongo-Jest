const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

// Express config paths
const publicDirectoryPath = path.join(__dirname, '../public');

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', () => {
  console.log('New websocket connection');
});

app.get('/', (req, res) => {
  res.render(index);
});

server.listen(port, () => console.log('Listening on port: ', port));