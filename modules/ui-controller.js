export const elements = {
  cityInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),
  locationBtn: document.getElementById('location-btn'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
  weatherDisplay: document.getElementById('weather-display'),
  cityName: document.getElementById('city-name'),
  temperature: document.getElementById('temperature'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  description: document.getElementById('description'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error'),
  historySection: document.getElementById('history-section'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  clearLogsBtn: document.getElementById('clear-logs-btn'),
  exportLogsBtn: document.getElementById('export-logs-btn'),
  logDisplay: document.getElementById('log-display'),
};

export const getCityInput = () => elements.cityInput.value.trim();

export const clearInput = () => {
  elements.cityInput.value = '';
  hideError();
};

export const showLoading = () => elements.loading.classList.remove('hidden');
export const hideLoading = () => elements.loading.classList.add('hidden');

export const showError = (message) => {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
};

export const hideError = () => {
  elements.error.textContent = '';
  elements.error.classList.add('hidden');
};

export const displayWeather = (data) => {
  hideError();

  if (!data) {
    elements.weatherDisplay.classList.add('hidden');
    return;
  }

  elements.cityName.textContent = data.name || '-';
  elements.temperature.textContent = data.main ? `${Math.round(data.main.temp)} °` : '-';
  elements.humidity.textContent = data.main?.humidity ?? '-';
  elements.windSpeed.textContent = data.wind?.speed ?? '-';
  elements.sunrise.textContent = data.sys ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : '-';
  elements.sunset.textContent = data.sys ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : '-';
  elements.description.textContent = data.weather?.[0]?.description || '-';

  elements.weatherDisplay.classList.remove('hidden');
};

export const renderHistory = (history) => {
  elements.historyList.innerHTML = '';
  if (!Array.isArray(history) || history.length === 0) {
    elements.historyList.innerHTML = '<div class="no-history">Nicio căutare recentă</div>';
    return;
  }

  history.forEach((entry) => {
    const item = document.createElement('div');
    item.classList.add('history-item');
    item.dataset.city = entry.city || '';
    item.dataset.lat = entry.coordinates?.lat ?? '';
    item.dataset.lon = entry.coordinates?.lon ?? '';
    item.dataset.timestamp = entry.timestamp || '';

    item.innerHTML = `
      <div class="history-location">
        <span class="city">${item.dataset.city}</span>
        <span class="country">${entry.country || ''}</span>
      </div>
      <div class="history-time">${item.dataset.timestamp ? new Date(parseInt(item.dataset.timestamp)).toLocaleTimeString() : ''}</div>
    `;

    elements.historyList.appendChild(item);
  });
};

export const showHistory = () => elements.historySection.classList.remove('hidden');
export const hideHistory = () => elements.historySection.classList.add('hidden');

export const addHistoryEventListeners = (onItemClick, onClearClick) => {
  elements.historyList.addEventListener('click', onItemClick);
  elements.clearHistoryBtn.addEventListener('click', onClearClick);
};

export const removeHistoryEventListeners = (onItemClick, onClearClick) => {
  elements.historyList.removeEventListener('click', onItemClick);
  elements.clearHistoryBtn.removeEventListener('click', onClearClick);
};