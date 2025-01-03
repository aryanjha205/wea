// app.js
const apiKey = 'f2e9ab2277aceffb502cea4c4563ae0c';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;

const form = document.getElementById('weatherForm');
const cityNameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const cityNameDisplay = document.querySelector('.name figcaption');
const flagImg = document.querySelector('.name img');
const weatherIcon = document.querySelector('.temperature img');
const temperatureDisplay = document.querySelector('.temperature span');
const descriptionDisplay = document.querySelector('.description');
const cloudsDisplay = document.getElementById('clouds');
const humidityDisplay = document.getElementById('humidity');
const pressureDisplay = document.getElementById('pressure');
const sunriseDisplay = document.getElementById('sunrise');
const sunsetDisplay = document.getElementById('sunset');
const windSpeedDisplay = document.getElementById('wind-speed');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const main = document.querySelector('main');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityName = cityNameInput.value.trim();
    const email = emailInput.value.trim();

    if (!cityName || !email) {
        errorMessage.textContent = 'City name and email are required.';
        errorMessage.style.display = 'block';
        return;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = 'Please enter a valid email address.';
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';
    loader.style.display = 'block';

    fetchWeather(cityName, email);
});

const fetchWeather = (cityName, email) => {
    fetch(`${apiUrl}&q=${cityName}`)
        .then((response) => response.json())
        .then((data) => {
            loader.style.display = 'none';

            if (data.cod !== 200) {
                errorMessage.textContent = 'City not found. Please try again.';
                errorMessage.style.display = 'block';
                return;
            }

            updateWeatherUI(data);
            sendWeatherAlert(email, data.weather[0].description);
        })
        .catch((error) => {
            loader.style.display = 'none';
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.display = 'block';
            console.error('Error fetching weather:', error);
        });
};

const updateWeatherUI = (data) => {
    cityNameDisplay.textContent = data.name;
    flagImg.src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    temperatureDisplay.textContent = Math.round(data.main.temp);
    descriptionDisplay.textContent = data.weather[0].description;
    cloudsDisplay.textContent = data.clouds.all;
    humidityDisplay.textContent = data.main.humidity;
    pressureDisplay.textContent = data.main.pressure;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    sunriseDisplay.textContent = sunrise;
    sunsetDisplay.textContent = sunset;

    windSpeedDisplay.textContent = `${data.wind.speed} m/s`;
};

const sendWeatherAlert = (email, weatherDescription) => {
    const alertMessage = `Weather alert: ${weatherDescription}`;

    fetch('/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: alertMessage }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(`Weather alert sent to ${email}`);
            } else {
                alert(`Failed to send alert: ${data.error}`);
            }
        })
        .catch((error) => {
            console.error('Error sending alert:', error);
            alert('Error sending alert. Please try again later.');
        });
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const updateDateTime = () => {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');

    const formattedDate = now.toLocaleDateString('default', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    dateElement.textContent = `Date: ${formattedDate}`;
    timeElement.textContent = `Time: ${formattedTime}`;
};

setInterval(updateDateTime, 1000);
