const socket = io()

const chatForm = document.querySelector('#chatForm');
const sendLocationBtn = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const message = e.target.elements.message.value;
  
  socket.emit('sendMessage', message);
})

sendLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', { lat: position.coords.latitude, long: position.coords.longitude});
  });
});