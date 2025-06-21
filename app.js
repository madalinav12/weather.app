import { getCoords } from './modules/location-service.js';
import {
  getCurrentWeatherWithFallback,
  getWeatherByCoords,
} from './modules/weather-service.js';
import {
  getElements,
  showLoading,
  showError,
  displayWeather,
  saveUserPreferences,
  loadUserPreferences,
} from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';

const elements = getElements();

const handleSearch = async () => {
  const city = elements.cityInput.value.trim();
  if (!city) return;
  showLoading(elements, 'Caut vremea...');
  try {
    const data = await getCurrentWeatherWithFallback(city);
    displayWeather(elements, data);
  } catch (error) {
    showError(elements, error.message);
  }
};

const handleLocationSearch = async () => {
  showLoading(elements, 'Detectez locația...');
  try {
    const coords = await getCoords();
    const data = await getWeatherByCoords(coords.latitude, coords.longitude);
    displayWeather(elements, data);
  } catch (error) {
    showError(elements, error.message);
  }
};

const handlePreferencesChange = () => {
  CONFIG.DEFAULT_UNITS = elements.unitSelect.value;
  CONFIG.DEFAULT_LANG = elements.langSelect.value;
  saveUserPreferences(CONFIG.DEFAULT_UNITS, CONFIG.DEFAULT_LANG);
};

const init = () => {
  const prefs = loadUserPreferences();
  CONFIG.DEFAULT_UNITS = prefs.unit;
  CONFIG.DEFAULT_LANG = prefs.lang;
  elements.unitSelect.value = prefs.unit;
  elements.langSelect.value = prefs.lang;

  elements.searchBtn.addEventListener('click', handleSearch);
  elements.locationBtn.addEventListener('click', handleLocationSearch);
  elements.unitSelect.addEventListener('change', handlePreferencesChange);
  elements.langSelect.addEventListener('change', handlePreferencesChange);
};

init();
