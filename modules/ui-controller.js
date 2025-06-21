export const elements = {
  cityInput: document.querySelector("#city-input"),
  searchBtn: document.querySelector("#search-btn"),
  locationBtn: document.querySelector("#location-btn"),
  loading: document.querySelector("#loading"),
  error: document.querySelector("#error"),
  display: document.querySelector("#weather-display"),
  cityName: document.querySelector("#city-name"),
  temperature: document.querySelector("#temperature"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind-speed"),
  description: document.querySelector("#description"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset")
};

export const showLoading = () => {
  elements.loading.classList.remove("hidden");
  elements.error.classList.add("hidden");
  elements.display.classList.add("hidden");
};

export const hideLoading = () => {
  elements.loading.classList.add("hidden");
};

export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove("hidden");
  elements.display.classList.add("hidden");
};

export const displayWeather = (data) => {
  elements.cityName.textContent = data.name;
  elements.temperature.textContent = data.main.temp;
  elements.humidity.textContent = data.main.humidity;
  elements.wind.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s -> km/h
  elements.description.textContent = data.weather[0].description;
  elements.sunrise.textContent = formatTime(data.sys.sunrise);
  elements.sunset.textContent = formatTime(data.sys.sunset);

  elements.display.classList.remove("hidden");
  elements.error.classList.add("hidden");
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
};
