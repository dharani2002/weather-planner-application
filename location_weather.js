
const apiKey = '490a7e18cea7f17e2feb23b413208354'; //openweather api key

//get current location using geolocation api
const x = document.getElementById("p1");
let latitude,longitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  
  latitude=position.coords.latitude;
  longitude=position.coords.longitude; 
}

//fetch weather for current location
//http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const currentButton = document.getElementById('currentButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const windspeedElement=document.getElementById('windspeed');
const humidityElement =document.getElementById('humidity');
//const latitude='21.1473257'
//const longitude='72.7597782'

currentButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location=='' || location) {
        fetchCurrentWeather();
    }
});

function fetchCurrentWeather() {
    const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            windspeedElement.textContent=`${Math.round(data.wind.speed * 10) / 10} km/hr`;
            humidityElement.textContent=`${data.main.humidity}%`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
// use custom location

searchButton.addEventListener('click', () => {
    const name = locationInput.value;
    const location=name.split(",")[0];
    if (location) {
        fetchWeather(location);
    }
    else if(location==""){
        fetchCurrentWeather();
    }
    else {
        alert('Enter a valid City name');
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            windspeedElement.textContent=`${Math.round(data.wind.speed * 10) / 10} km/hr`;
            humidityElement.textContent=`${data.main.humidity}%`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// change metrics

document.getElementById('unitSwitch').addEventListener('change', (e) => {
    unit = e.target.checked ? 'imperial' : 'metric';
    document.getElementById('unitLabel').textContent = unit === 'metric' ? 'Metric' : 'Imperial';  

    const temperatureElement = document.getElementById('temperature');
    const windspeedElement = document.getElementById('windspeed');

    const currentTemperature = parseFloat(temperatureElement.textContent);
    const currentWindSpeed = parseFloat(windspeedElement.textContent);

    if (unit === 'imperial') {
        // Convert from Metric to Imperial
        temperatureElement.textContent = `${Math.round((currentTemperature * 9) / 5 + 32)}°F`;
        windspeedElement.textContent = `${Math.round(currentWindSpeed * 0.621371 * 10) / 10} mph`;
    } else {
        // Convert from Imperial to Metric
        temperatureElement.textContent = `${Math.round(((currentTemperature - 32) * 5) / 9)}°C`;
        windspeedElement.textContent = `${Math.round(currentWindSpeed / 0.621371 * 10) / 10} km/hr`;
    }

});

//cookie creation\
function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`; // Set cookie with URL encoding
}

// Function to get a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = decodeURIComponent(val); // Decode the value
        return acc;
    }, {});
    return cookies[name] || null;
}

// Function to load the title from the cookie
function loadTitleFromCookie() {
    const storedTitle = getCookie('pageTitle');
    if (storedTitle) {
        document.getElementById('location').textContent = storedTitle;
    }
}

// Event listener to change the title and store it in a cookie
searchButton.addEventListener('click', () => {
    const newTitle = document.getElementById("location").innerText;
    if (newTitle) {
        document.getElementById('location').textContent = newTitle;
        setCookie('pageTitle', newTitle);
    }
});

//clear all cookies after session
function clearCookiesOnNewSession() {
    if (!sessionStorage.getItem('sessionId')) {
        // New session: Clear all cookies
        document.cookie.split('; ').forEach(cookie => {
            const name = cookie.split('=')[0];
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        });
        // Set session identifier in sessionStorage
        sessionStorage.setItem('sessionId', Date.now().toString());
    }
}
// Event listener to reset the title and clear the cookie
// document.getElementById('resetTitle').addEventListener('click', () => {
//     document.getElementById('title').textContent = 'Welcome to My Weather App';
//     setCookie('pageTitle', 'Welcome to My Weather App'); // Reset the cookie to default title
// });

// Load the title from the cookie when the page loads
loadTitleFromCookie();
clearCookiesOnNewSession();
