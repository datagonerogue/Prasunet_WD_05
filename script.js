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

  forecastData.forEach((day) => {
    const dayElement = document.createElement("div");
    const dateElement = document.createElement("p");
    const weatherElement = document.createElement("p");
    const temperatureElement = document.createElement("p");

    const date = new Date(day.dt * 1000);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

    dateElement.textContent = formattedDate;
    weatherElement.textContent = day.weather[0].description;
    temperatureElement.textContent = `${day.main.temp}°C`;

    dayElement.appendChild(dateElement);
    dayElement.appendChild(weatherElement);
    dayElement.appendChild(temperatureElement);
    forecastDays.appendChild(dayElement);
  });
}
