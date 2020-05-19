console.log('Client side js loaded');

fetch('http://localhost:3000/weather?address=newbury')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const forecastMessage = document.querySelector("#forecastMessage");
const locationMessage = document.querySelector("#locationMessage");
const errorMessage = document.querySelector("#errorMessage");
const forecastImage = document.querySelector("#forecastImage");

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = search.value;
  errorMessage.textContent = 'Loading...';
  errorMessage.textContent = '';
  getWeather(location);

});

const clearInputs = () => {
  locationMessage.textContent = '';
  forecastMessage.textContent = '';
  forecastImage.src = '';
}

const getWeather = location => 
  fetch(`/weather?address=${ location }`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      errorMessage.textContent = data.error;
      clearInputs();
    } else {
      errorMessage.textContent = '';
      locationMessage.textContent = `It is ${ data.time } in ${ data.location }`;
      forecastMessage.textContent = data.forecast;
      forecastImage.src = data.icon;
    }
  })
  .catch(error => console.log(error));