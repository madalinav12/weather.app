import { logger } from './logger.js';

const STORAGE_KEY = 'weather_history';
const MAX_HISTORY = 10;

export const historyService = {
  getHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      logger.error('Failed to load history', error);
      return [];
    }
  },

  addLocation(weatherData) {
    const history = this.getHistory();

    const newEntry = {
      city: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
      timestamp: Date.now()
    };

    const updated = [newEntry, ...history.filter(item =>
      item.city !== newEntry.city || item.country !== newEntry.country
    )];

    if (updated.length > MAX_HISTORY) {
      updated.length = MAX_HISTORY;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.debug('Location added to history', newEntry);
    } catch (error) {
      logger.error('Failed to save history', error);
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      logger.info('History cleared');
    } catch (error) {
      logger.error('Failed to clear history', error);
    }
  }
};
