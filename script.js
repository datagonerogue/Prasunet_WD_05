const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const getLocationBtn = document.getElementById("get-location-btn");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastDays = document.querySelector(".forecast-days");
const currentWeatherSection = document.querySelector(".current-weather");
const forecastSection = document.querySelector(".forecast");

const apiKey = "c461518e8d2ff3d0e97f1a492f964098";

searchBtn.addEventListener("click", () => {
  const location = locationInput.value;
  showLoadingSpinner();
  fetchWeatherData(location);
});

getLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        showLoadingSpinner();
        fetchWeatherDataByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Error getting your location. Please try again later.");
        hideLoadingSpinner();
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
    hideLoadingSpinner();
  }
});

function showLoadingSpinner() {
  const loadingSpinner = document.querySelector(".loading-spinner");
  loadingSpinner.classList.remove("hidden");
}

function hideLoadingSpinner() {
  const loadingSpinner = document.querySelector(".loading-spinner");
  loadingSpinner.classList.add("hidden");
}

locationInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const location = locationInput.value;
    fetchWeatherData(location);
  }
});
function fetchWeatherData(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      fetchForecastData(location);
      hideLoadingSpinner();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later.");
      hideLoadingSpinner();
    });
}
function fetchWeatherDataByCoordinates(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      fetchForecastDataByCoordinates(latitude, longitude);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later.");
    });
}
function fetchForecastDataByCoordinates(latitude, longitude) {
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(forecastApiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  weatherDescription.textContent = data.weather[0].description;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind speed: ${data.wind.speed} m/s`;

  currentWeatherSection.classList.remove("hidden");
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
    const dateString = `${date.getDate()} ${
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][date.getMonth()]
    }`;
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];

    if (!forecastByDay[dateString]) {
      forecastByDay[dateString] = {
        morning: null,
        evening: null,
        night: null,
        dayOfWeek: dayOfWeek,
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
    const dateElement = document.createElement("h3");
    const morningElement = document.createElement("div");
    const morningHeading = document.createElement("h3");
    const morningList = document.createElement("ul");
    const eveningElement = document.createElement("div");
    const eveningHeading = document.createElement("h3");
    const eveningList = document.createElement("ul");
    const nightElement = document.createElement("div");
    const nightHeading = document.createElement("h3");
    const nightList = document.createElement("ul");
    const morningIconElement = document.createElement("img");
    const eveningIconElement = document.createElement("img");
    const nightIconElement = document.createElement("img");

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (
      date ===
      `${today.getDate()} ${
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][today.getMonth()]
      }`
    ) {
      dateElement.textContent = "Today";
    } else if (
      date ===
      `${tomorrow.getDate()} ${
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][tomorrow.getMonth()]
      }`
    ) {
      dateElement.textContent = "Tomorrow";
    } else {
      dateElement.innerHTML = `<ul> <li> ${forecastByDay[date].dayOfWeek}  </li><li> ${date}  </li>  </ul> `;
    }

    if (forecastByDay[date].morning) {
      morningHeading.textContent = "Morning";
      const morningListItem1 = document.createElement("li");
      morningListItem1.textContent =
        forecastByDay[date].morning.weather[0].description;
      const morningListItem2 = document.createElement("li");
      morningListItem2.textContent = `${forecastByDay[date].morning.main.temp}°C`;
      morningIconElement.src = `http://openweathermap.org/img/w/${forecastByDay[date].morning.weather[0].icon}.png`;
      morningList.appendChild(morningListItem1);
      morningList.appendChild(morningListItem2);
      morningElement.appendChild(morningHeading);
      morningElement.appendChild(morningList);
      morningElement.prepend(morningIconElement);
    } else {
      morningElement.textContent = "Morning: N/A";
    }

    if (forecastByDay[date].evening) {
      eveningHeading.textContent = "Evening";
      const eveningListItem1 = document.createElement("li");
      eveningListItem1.textContent =
        forecastByDay[date].evening.weather[0].description;
      const eveningListItem2 = document.createElement("li");
      eveningListItem2.textContent = `${forecastByDay[date].evening.main.temp}°C`;
      eveningIconElement.src = `http://openweathermap.org/img/w/${forecastByDay[date].evening.weather[0].icon}.png`;
      eveningList.appendChild(eveningListItem1);
      eveningList.appendChild(eveningListItem2);
      eveningElement.appendChild(eveningHeading);
      eveningElement.appendChild(eveningList);
      eveningElement.prepend(eveningIconElement);
    } else {
      eveningElement.textContent = "Evening: N/A";
    }

    if (forecastByDay[date].night) {
      nightHeading.textContent = "Night";
      const nightListItem1 = document.createElement("li");
      nightListItem1.textContent =
        forecastByDay[date].night.weather[0].description;
      const nightListItem2 = document.createElement("li");
      nightListItem2.textContent = `${forecastByDay[date].night.main.temp}°C`;
      nightIconElement.src = `http://openweathermap.org/img/w/${forecastByDay[date].night.weather[0].icon}.png`;
      nightList.appendChild(nightListItem1);
      nightList.appendChild(nightListItem2);
      nightElement.appendChild(nightHeading);
      nightElement.appendChild(nightList);
      nightElement.prepend(nightIconElement);
    } else {
      nightElement.textContent = "Night: N/A";
    }

    dayElement.appendChild(dateElement);
    dayElement.appendChild(morningElement);
    dayElement.appendChild(eveningElement);
    dayElement.appendChild(nightElement);
    forecastDays.appendChild(dayElement);
  });

  forecastSection.classList.remove("hidden");
}
