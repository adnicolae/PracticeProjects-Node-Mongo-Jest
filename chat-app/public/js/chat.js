const socket = io()

// Elements
const $chatForm = document.querySelector('#chatForm');
const $chatFormInput = document.querySelector('input');
const $sendLocationBtn = document.querySelector('#send-location');
const $chatFormBtn = document.querySelector('button');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // get the newest message
  const $newMessage = $messages.lastElementChild;

  // get the height of the newest message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // get the container visible height 
  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;

  // get the scroll offset (how much the user scrolled)
  const scrollOffset = $messages.scrollTop + visibleHeight;

  // check if the height was full before the last message added
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('message', ({ username, text, createdAt}) => {
  console.log(text);
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: moment(createdAt).format('HH:mm')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('locationMessage', ({ username, url, createdAt}) => {
  console.log(url);
  const html = Mustache.render(urlTemplate, {
    username,
    url,
    createdAt: moment(createdAt).format('HH:mm')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  $sidebar.innerHTML = html;
})

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

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href='/'
  }
});