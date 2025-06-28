import { CONFIG } from './config.js';
import { logger } from './logger.js';

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
  }

  addLocation(weatherData) {
    try {
      const history = this._loadFromStorage();

      const newEntry = {
        city: weatherData.name,
        country: weatherData.sys.country,
        timestamp: Date.now(),
        coordinates: weatherData.coord,
      };

      // Caută dacă există deja
      const existingIndex = history.findIndex(
        (item) =>
          item.city.toLowerCase() === newEntry.city.toLowerCase() &&
          item.country.toLowerCase() === newEntry.country.toLowerCase()
      );

      if (existingIndex !== -1) {
        history.splice(existingIndex, 1); // elimină intrarea duplicat
      }

      history.unshift(newEntry); // adaugă în față

      if (history.length > this.maxItems) {
        history.pop(); // elimină cea mai veche
      }

      this._saveToStorage(history);
      logger.info(`Locație adăugată în istoric: ${newEntry.city}, ${newEntry.country}`);
    } catch (err) {
      logger.error('Eroare la adăugarea în istoric', err);
    }
  }

  getHistory() {
    return this._loadFromStorage();
  }

  removeLocation(city) {
    try {
      const history = this._loadFromStorage();
      const filtered = history.filter(
        (item) => item.city.toLowerCase() !== city.toLowerCase()
      );
      this._saveToStorage(filtered);
      logger.info(`Locație ștearsă din istoric: ${city}`);
    } catch (err) {
      logger.error(`Eroare la ștergerea locației din istoric: ${city}`, err);
    }
  }

  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
      logger.info('Istoric curățat complet.');
    } catch (err) {
      logger.error('Eroare la ștergerea istoricului', err);
    }
  }

  _saveToStorage(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (err) {
      logger.error('Eroare la salvarea în localStorage', err);
    }
  }

  _loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      logger.error('Eroare la citirea din localStorage', err);
      return [];
    }
  }
}

export const historyService = new HistoryService();
