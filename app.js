import { WeatherService } from './modules/weather-service.js';
import { HistoryService } from './modules/history-service.js';
import { UIController } from './modules/ui-controller.js';
import { logger } from './modules/logger.js';

// 🔑 Introdu aici cheia ta de API de la OpenWeatherMap
const API_KEY = '6fa9abbb827dd547ac43dc54057e9d81';
const weatherService = new WeatherService(API_KEY);
const historyService = new HistoryService();

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');
  const cityInput = document.getElementById('city-input');
  const unitSelect = document.getElementById('unit-select');
  const langSelect = document.getElementById('lang-select');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const exportLogsBtn = document.getElementById('export-logs-btn');

  const loadWeatherForCity = async (city) => {
    const unit = unitSelect.value;
    const lang = langSelect.value;

    UIController.showLoading();
    UIController.hideError();

    try {
      const data = await weatherService.getWeatherByCity(city, unit, lang);
      UIController.updateWeatherDisplay(data);
      historyService.add(city);
      updateHistory();
      logger.log(`Am obținut vremea pentru ${city}`);
    } catch (err) {
      UIController.showError(err.message);
      logger.log(`Eroare: ${err.message}`);
    } finally {
      UIController.hideLoading();
    }
  };

  const loadWeatherByLocation = () => {
    if (!navigator.geolocation) {
      UIController.showError('Geolocația nu este suportată de browserul tău.');
      return;
    }

    UIController.showLoading();
    UIController.hideError();

    navigator.geolocation.getCurrentPosition(async (position) => {
      const unit = unitSelect.value;
      const lang = langSelect.value;
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const data = await weatherService.getWeatherByCoords(lat, lon, unit, lang);
        UIController.updateWeatherDisplay(data);
        historyService.add(data.name);
        updateHistory();
        logger.log(`Am obținut vremea pe baza locației: ${data.name}`);
      } catch (err) {
        UIController.showError(err.message);
        logger.log(`Eroare la locație: ${err.message}`);
      } finally {
        UIController.hideLoading();
      }
    }, (error) => {
      UIController.showError('Nu s-a putut accesa locația.');
      logger.log('Eroare la accesarea locației: ' + error.message);
      UIController.hideLoading();
    });
  };

  const updateHistory = () => {
    const history = historyService.getAll();
    UIController.updateHistoryList(history, loadWeatherForCity);
  };

  // 🔁 Evenimente
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      loadWeatherForCity(city);
      cityInput.value = '';
    }
  });

  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  locationBtn.addEventListener('click', loadWeatherByLocation);
  clearHistoryBtn.addEventListener('click', () => {
    historyService.clear();
    updateHistory();
    logger.log('Istoric șters.');
  });

  clearLogsBtn?.addEventListener('click', () => {
    logger.clear();
  });

  exportLogsBtn?.addEventListener('click', () => {
    const logs = document.getElementById('log-display')?.textContent || '';
    const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Afișează istoricul la pornirea aplicației
  updateHistory();
});
