// app.js

import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import * as ui from './modules/ui-controller.js';
import { weatherService } from './modules/weather-service.js';

const initializeApp = async () => {
  logger.info('Weather App starting...');

  setupEventListeners();
  loadHistoryOnStart();

  logger.info('Weather App initialized successfully');
};

const loadHistoryOnStart = () => {
  const history = historyService.getHistory();
  if (history.length > 0) {
    ui.renderHistory(history);
    ui.showHistory();
    logger.info(`Loaded ${history.length} items from history`);
  }
};

const handleSearch = async () => {
  const city = ui.getCityInput().trim();

  logger.debug('Search initiated', { city });

  if (!isValidCity(city)) {
    const errorMsg = 'Numele orașului nu este valid';
    ui.showError(errorMsg);
    logger.warn('Invalid city input', { city });
    return;
  }

  try {
    ui.showLoading();
    logger.info('Fetching weather data', { city });

    const weatherData = await weatherService.getCurrentWeather(city);

    historyService.addLocation(weatherData);
    ui.displayWeather(weatherData);
    ui.clearInput();

    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);
    ui.showHistory();

    logger.info('Weather data displayed successfully', {
      city: weatherData.name,
      temp: weatherData.main.temp,
    });
  } catch (error) {
    ui.showError('Nu am putut obține vremea. Încearcă din nou.');
    logger.error('Failed to fetch weather data', error);
  } finally {
    ui.hideLoading();
  }
};

const handleHistoryClick = async (event) => {
  const historyItem = event.target.closest('.history-item');
  if (!historyItem) return;

  const city = historyItem.dataset.city;
  const lat = parseFloat(historyItem.dataset.lat);
  const lon = parseFloat(historyItem.dataset.lon);

  logger.info('History item clicked', { city, lat, lon });

  try {
    ui.showLoading();

    const weatherData = await weatherService.getWeatherByCoords(lat, lon);

    historyService.addLocation(weatherData);
    ui.displayWeather(weatherData);

    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);

    logger.info('Weather loaded from history', { city });
  } catch (error) {
    ui.showError('Nu am putut obține vremea din istoric.');
    logger.error('Failed to load weather from history', error);
  } finally {
    ui.hideLoading();
  }
};

const handleClearHistory = () => {
  if (confirm('Sigur vrei să ștergi tot istoricul de căutări?')) {
    historyService.clearHistory();
    ui.renderHistory([]);
    logger.info('Search history cleared');
  }
};

const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener('click', handleSearch);

  ui.addHistoryEventListeners(handleHistoryClick, handleClearHistory);

  if (ui.elements.clearLogsBtn) {
    ui.elements.clearLogsBtn.addEventListener('click', () => {
      logger.clearLogs();
      ui.updateLogDisplay([]);
    });
  }

  if (ui.elements.exportLogsBtn) {
    ui.elements.exportLogsBtn.addEventListener('click', () => {
      const logs = logger.exportLogs();
      downloadLogs(logs);
    });
  }
};

const downloadLogs = (logsText) => {
  const blob = new Blob([logsText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `weather-app-logs-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const isValidCity = (city) => city.length > 1 && /^[a-zA-Z\s-]+$/.test(city);

initializeApp();
