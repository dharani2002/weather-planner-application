const apiKey3 = '490a7e18cea7f17e2feb23b413208354';

// Initialize the map
const map = L.map('weatherMap').setView([20, 78], 5); // Default view

// Add the base map layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define weather layers
const temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey3}`
);
const precipitationLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey3}`
);
const windLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey3}`
);

// Add layer controls
const baseMaps = {
    "Temperature": temperatureLayer,
    "Precipitation": precipitationLayer,
    "Wind": windLayer,
};
L.control.layers(baseMaps).addTo(map);

// Set default layer to Temperature
temperatureLayer.addTo(map);

// Get user's current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Center map on the user's location
            map.setView([lat, lon], 10);

            // Fetch weather data for the current location
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey3}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const weather = data.weather[0].description;
                    const temp = data.main.temp;

                    // Add a popup at the user's location
                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`Your Location<br>Weather: ${weather}<br>Temp: ${temp}°C`)
                        .openPopup();
                });
        },
        (error) => {
            console.error("Error getting location: ", error);
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

// Add click event to show weather details at clicked location
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey2}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].description;
            const temp = data.main.temp;

            L.popup()
                .setLatLng(e.latlng)
                .setContent(`Weather: ${weather}, Temp: ${temp}°C`)
                .openOn(map);
        });
});