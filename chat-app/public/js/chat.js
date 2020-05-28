const socket = io()

// Elements
const $chatForm = document.querySelector('#chatForm');
const $chatFormInput = document.querySelector('input');
const $sendLocationBtn = document.querySelector('#send-location');
const $chatFormBtn = document.querySelector('button');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message
  });
  $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
  console.log(url);
  const html = Mustache.render(urlTemplate, {
    url
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$chatForm.addEventListener('submit', e => {
  e.preventDefault();
  
  $chatFormBtn.setAttribute('disabled', 'disabled');
  // disable
  const message = e.target.elements.message.value;
  
  socket.emit('sendMessage', message, (error) => {
    // enable
    $chatFormBtn.removeAttribute('disabled');
    $chatFormInput.value = '';
    $chatFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log('Message Delivered!');
    
  });
})

$sendLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  $sendLocationBtn.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const loc = { lat: position.coords.latitude, long: position.coords.longitude};
    socket.emit('sendLocation', loc, () => {
      console.log("Location shared");
      $sendLocationBtn.removeAttribute('disabled');
    });
  });
});