import { CONFIG } from './config.js';
import { logger } from './logger.js';

class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
    this.history = this._loadFromStorage();
  }

  addLocation(weatherData) {
    try {
      const { name: city, sys, coord, main, weather } = weatherData;
      const timestamp = Date.now();

      const newEntry = {
        city,
        country: sys.country,
        coordinates: coord,
        temperature: main.temp,
        icon: weather?.[0]?.icon || '',
        timestamp,
      };

      this.history = this.history.filter(
        (item) =>
          item.city.toLowerCase() !== city.toLowerCase() ||
          item.country.toLowerCase() !== sys.country.toLowerCase()
      );

      this.history.unshift(newEntry);

      if (this.history.length > this.maxItems) {
        this.history = this.history.slice(0, this.maxItems);
      }

      this._saveToStorage();
    } catch (error) {
      logger.error('Error adding location to history', error);
    }
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem(this.storageKey);
  }

  _loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error loading history from storage', error);
      return [];
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      logger.error('Error saving history to storage', error);
    }
  }
}

export const historyService = new HistoryService();