const apiKey2 = '97aee87ff31c44d8b9d84718242211'; // Replace with your WeatherAPI key

document.getElementById('weekButton').addEventListener('click', () => {
    const location = document.getElementById('location').innerText;
    if (location) {
        getWeather(location);
    } else {
        alert('Please enter a city name!');
    }
});

function getWeather(location) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey2}&q=${location}&days=7`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Display current weather
            const current = data.current;
            
            

            // Display weekly forecast
            displayWeeklyForecast(data.forecast.forecastday);
        })
        .catch(error => {
            document.getElementById('weatherInfo').innerHTML = `<p style="color: red;">${error.message}</p>`;
            document.getElementById('weeklyForecast').innerHTML = '';
        });
}

function displayWeeklyForecast(forecastDays) {
    const forecastContainer = document.getElementById('weeklyForecast');
    forecastContainer.innerHTML = '';

    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(day.day.maxtemp_c);
        const minTemp = Math.round(day.day.mintemp_c);

        const forecastCard = `
            <div class="forecast-item">
                <div class="day">${dayName}</div>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="temp">
                    <strong>${maxTemp}°C</strong> / ${minTemp}°C
                </div>
            </div>
        `;
        forecastContainer.innerHTML += forecastCard;
    });
}