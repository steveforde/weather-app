const apiKey = '5642a143349febc824d55f6dee3979e3'; // Replace with your OpenWeatherMap API key

async function getWeatherByCity() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const geocodeResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length === 0) {
            alert('City not found');
            return;
        }

        const { lat, lon } = geocodeData[0];
        getWeather(lat, lon);
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        alert('Error fetching geocoding data. Please try again.');
    }
}

async function getWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    data.daily.time.forEach((date, index) => {
        const tempMax = data.daily.temperature_2m_max[index].toFixed(1);
        const tempMin = data.daily.temperature_2m_min[index].toFixed(1);
        const weatherCode = data.daily.weathercode[index];
        const description = getWeatherDescription(weatherCode);

        const weatherDay = document.createElement('div');
        weatherDay.className = 'weather-day';

        weatherDay.innerHTML = `
            <div>${date}</div>
            <div>${tempMax}°C / ${tempMin}°C</div>
            <div>${description}</div>
        `;

        weatherContainer.appendChild(weatherDay);
    });
}

function getWeatherDescription(code) {
    const weatherDescriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle: Light',
        53: 'Drizzle: Moderate',
        55: 'Drizzle: Dense intensity',
        56: 'Freezing Drizzle: Light',
        57: 'Freezing Drizzle: Dense intensity',
        61: 'Rain: Slight',
        63: 'Rain: Moderate',
        65: 'Rain: Heavy intensity',
        66: 'Freezing Rain: Light',
        67: 'Freezing Rain: Heavy intensity',
        71: 'Snow fall: Slight',
        73: 'Snow fall: Moderate',
        75: 'Snow fall: Heavy intensity',
        77: 'Snow grains',
        80: 'Rain showers: Slight',
        81: 'Rain showers: Moderate',
        82: 'Rain showers: Violent',
        85: 'Snow showers: Slight',
        86: 'Snow showers: Heavy',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherDescriptions[code] || 'Unknown weather';
}