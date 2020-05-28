const socket = io()

const chatForm = document.querySelector('#chatForm');

socket.on('message', (message) => {
  console.log(message);
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const message = e.target.elements.message.value;
  
  socket.emit('sendMessage', message);
})