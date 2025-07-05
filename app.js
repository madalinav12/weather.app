import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import * as ui from './modules/ui-controller.js';
import * as weather from './modules/weather-service.js';

const initializeApp = async () => {
  logger.info('Weather App starting...');
  setupEventListeners();

  // Încarcă istoric dacă există
  const history = historyService.getHistory();
  if (history.length > 0) {
    ui.renderHistory(history);
    ui.showHistory();
    logger.info(`Loaded ${history.length} items from history`);
  }

  // Pornește cu București
  try {
    ui.showLoading();
    const data = await weather.getCurrentWeather('București');
    ui.displayWeather(data);
  } catch (err) {
    ui.showError('Nu s-a putut încărca vremea pentru București.');
    logger.error('Failed to load default weather', err);
  } finally {
    ui.hideLoading();
  }

  logger.info('Weather App initialized successfully');
};

const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener('click', handleSearch);

  ui.elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  ui.elements.locationBtn.addEventListener('click', handleLocation);

  ui.addHistoryEventListeners(handleHistoryClick, handleClearHistory);

  // Butoane opționale pentru loguri
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

const handleSearch = async () => {
  const city = ui.elements.cityInput.value.trim();

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
    const weatherData = await weather.getCurrentWeather(city);

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

const handleLocation = () => {
  if (!navigator.geolocation) {
    ui.showError('Browserul nu suportă locația.');
    return;
  }

  ui.showLoading();
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const weatherData = await weather.getWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );

        historyService.addLocation(weatherData);
        ui.displayWeather(weatherData);

        const updatedHistory = historyService.getHistory();
        ui.renderHistory(updatedHistory);
        ui.showHistory();

        logger.info('Weather data displayed from geolocation');
      } catch (error) {
        ui.showError('Nu am putut obține vremea din locație.');
        logger.error('Failed to fetch weather from location', error);
      } finally {
        ui.hideLoading();
      }
    },
    () => {
      ui.showError('Nu ai permis accesul la locație.');
      ui.hideLoading();
    }
  );
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
    const weatherData = await weather.getWeatherByCoords(lat, lon);

    historyService.addLocation(weatherData);
    ui.displayWeather(weatherData);

    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);
    ui.showHistory();

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
    ui.showHistory(false);
    logger.info('Search history cleared');
  }
};

const downloadLogs = (logsText) => {
  const blob = new Blob([logsText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `weather-app-logs-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
