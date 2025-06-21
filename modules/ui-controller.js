export const getElements = () => ({
  cityInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),
  locationBtn: document.getElementById('location-btn'),
  weatherDisplay: document.getElementById('weather-display'),
  cityName: document.getElementById('city-name'),
  temperature: document.getElementById('temperature'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  sunset: document.getElementById('sunset'),
  sunrise: document.getElementById('sunrise'),
  description: document.getElementById('description'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
});

export const showLoading = (elements, message = 'Se încarcă...') => {
  elements.loading.textContent = message;
  elements.loading.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

export const showError = (elements, message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  elements.loading.classList.add('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

export const displayWeather = (elements, data) => {
  elements.cityName.textContent = data.name;
  elements.temperature.textContent = data.main.temp;
  elements.humidity.textContent = data.main.humidity;
  elements.windSpeed.textContent = data.wind.speed;
  elements.sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  elements.sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  elements.description.textContent = data.weather[0].description;
  elements.weatherDisplay.classList.remove('hidden');
  elements.loading.classList.add('hidden');
  elements.error.classList.add('hidden');
};

export const saveUserPreferences = (unit, lang) => {
  localStorage.setItem('unit', unit);
  localStorage.setItem('lang', lang);
};

export const loadUserPreferences = () => ({
  unit: localStorage.getItem('unit') || 'metric',
  lang: localStorage.getItem('lang') || 'ro',
});

export const updateTemperatureDisplay = (elements, temperature, unit) => {
  const symbol = unit === 'imperial' ? '°F' : '°C';
  elements.temperature.textContent = `${temperature}${symbol}`;
};
