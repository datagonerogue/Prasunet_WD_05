const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastDays = document.querySelector(".forecast-days");

const apiKey = "c461518e8d2ff3d0e97f1a492f964098";

searchBtn.addEventListener("click", () => {
  const location = locationInput.value;
  fetchWeatherData(location);
});

function fetchWeatherData(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      fetchForecastData(location);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later.");
    });
}

function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  weatherDescription.textContent = data.weather[0].description;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind speed: ${data.wind.speed} m/s`;
}

function fetchForecastData(location) {
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  fetch(forecastApiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(forecastData) {
  forecastDays.innerHTML = "";

  const forecastByDay = {};

  forecastData.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateString = `${date.getDate()}/${date.getMonth() + 1}`;

    if (!forecastByDay[dateString]) {
      forecastByDay[dateString] = {
        morning: null,
        evening: null,
        night: null,
      };
    }

    const hour = date.getHours();
    if (hour >= 6 && hour < 12) {
      forecastByDay[dateString].morning = item;
    } else if (hour >= 12 && hour < 18) {
      forecastByDay[dateString].evening = item;
    } else {
      forecastByDay[dateString].night = item;
    }
  });

  Object.keys(forecastByDay).forEach((date) => {
    const dayElement = document.createElement("div");
    const dateElement = document.createElement("p");
    const morningElement = document.createElement("div");
    const eveningElement = document.createElement("div");
    const nightElement = document.createElement("div");

    dateElement.textContent = date;

    if (forecastByDay[date].morning) {
      morningElement.textContent = `Morning: ${forecastByDay[date].morning.weather[0].description}, ${forecastByDay[date].morning.main.temp}°C`;
    } else {
      morningElement.textContent = "Morning: N/A";
    }

    if (forecastByDay[date].evening) {
      eveningElement.textContent = `Evening: ${forecastByDay[date].evening.weather[0].description}, ${forecastByDay[date].evening.main.temp}°C`;
    } else {
      eveningElement.textContent = "Evening: N/A";
    }

    if (forecastByDay[date].night) {
      nightElement.textContent = `Night: ${forecastByDay[date].night.weather[0].description}, ${forecastByDay[date].night.main.temp}°C`;
    } else {
      nightElement.textContent = "Night: N/A";
    }

    dayElement.appendChild(dateElement);
    dayElement.appendChild(morningElement);
    dayElement.appendChild(eveningElement);
    dayElement.appendChild(nightElement);
    forecastDays.appendChild(dayElement);
  });
}
