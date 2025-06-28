// modules/ui-controller.js
// Importă alte funcții dacă ai nevoie (ex: logger)
import { CONFIG } from './config.js';

const formatTime = (unixSeconds) => {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getWeatherIcon = (description) => {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };
  return icons[description] || "🌈";
};

export const elements = {
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector('#search-btn'),
  loading: document.querySelector('#loading'),
  error: document.querySelector('#error'),
  weatherDisplay: document.querySelector('#weather-display'),
  cityName: document.querySelector('#city-name'),
  temp: document.querySelector('#temp'),
  description: document.querySelector('#description'),
  humidity: document.querySelector('#humidity'),
  wind: document.querySelector('#wind'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  icon: document.querySelector('#weather-icon'),

  // 🔹 Elemente noi pentru istoric
  historySection: document.querySelector('#history-section'),
  historyList: document.querySelector('#history-list'),
  clearHistoryBtn: document.querySelector('#clear-history-btn'),

  // 🔹 Elemente pentru loguri (opțional)
  devTools: document.querySelector('#dev-tools'),
  logDisplay: document.querySelector('#log-display'),
  clearLogsBtn: document.querySelector('#clear-logs-btn'),
  exportLogsBtn: document.querySelector('#export-logs-btn'),
};

// Afișează vremea
export const displayWeather = (data) => {
  clearError();

  elements.cityName.textContent = data.name;
  elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
  elements.description.textContent = data.weather[0].description;
  elements.humidity.textContent = `Umiditate: ${data.main.humidity}%`;
  elements.wind.textContent = `Vânt: ${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  elements.sunrise.textContent = `Răsărit: ${formatTime(data.sys.sunrise)}`;
  elements.sunset.textContent = `Apus: ${formatTime(data.sys.sunset)}`;
  elements.icon.textContent = getWeatherIcon(data.weather[0].main);

  elements.weatherDisplay.classList.remove('hidden');
  elements.loading.classList.add('hidden');
};

// Funcții de stare UI
export const showLoading = () => {
  elements.loading.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

export const hideLoading = () => {
  elements.loading.classList.add('hidden');
};

export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  elements.loading.classList.add('hidden');
  elements.weatherDisplay.classList.add('hidden');
};

export const clearError = () => {
  elements.error.classList.add('hidden');
  elements.error.textContent = '';
};

export const getCityInput = () => elements.cityInput.value;
export const clearInput = () => { elements.cityInput.value = ''; };

// 🔹 Istoric
export const showHistory = () => {
  elements.historySection.classList.remove('hidden');
};

export const hideHistory = () => {
  elements.historySection.classList.add('hidden');
};

const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minute în urmă`;
  if (hours < 24) return `${hours} ore în urmă`;
  return `${days} zile în urmă`;
};

export const renderHistory = (historyItems) => {
  if (historyItems.length === 0) {
    elements.historyList.innerHTML =
      '<p class="no-history">Nu ai căutări recente</p>';
    return;
  }

  const historyHTML = historyItems
    .map((item) => {
      const timeAgo = getTimeAgo(item.timestamp);
      return `
      <div class="history-item" data-city="${item.city}" data-lat="${item.coordinates.lat}" data-lon="${item.coordinates.lon}">
        <div class="history-location">
          <span class="city">${item.city}</span>, <span class="country">${item.country}</span>
        </div>
        <div class="history-time">${timeAgo}</div>
      </div>`;
    })
    .join('');

  elements.historyList.innerHTML = historyHTML;
};

export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
  elements.historyList.addEventListener('click', (e) => {
    const target = e.target.closest('.history-item');
    if (!target) return;
    const city = target.dataset.city;
    const lat = parseFloat(target.dataset.lat);
    const lon = parseFloat(target.dataset.lon);
    onHistoryClick({ city, lat, lon });
  });

  elements.clearHistoryBtn.addEventListener('click', () => {
    onClearHistory();
  });
};

// 🔹 UI pentru loguri (opțional)
export const updateLogDisplay = (logs) => {
  const html = logs
    .map(
      (log) =>
        `<div class="log-entry"><strong>[${log.timestamp}] [${log.level}]</strong> ${log.message}</div>`
    )
    .join('');
  elements.logDisplay.innerHTML = html;
};
