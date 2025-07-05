import { CONFIG } from './config.js';

/**
 * Construiește un URL complet pentru cererea meteo cu parametrii necesari
 * @param {string} endpoint
 * @param {Object} params
 * @returns {string}
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(CONFIG.API_BASE_URL + endpoint);
  url.searchParams.set('appid', CONFIG.API_KEY);
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS);
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

/**
 * Face o cerere GET către un URL și tratează toate tipurile de erori
 * @param {string} url
 * @returns {Promise<any>}
 */
const makeRequest = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(CONFIG.ERROR_MESSAGES.CITY_NOT_FOUND);
        case 401:
          throw new Error('API Key invalid sau lipsă.');
        case 429:
          throw new Error('Prea multe cereri. Încearcă mai târziu.');
        default:
          throw new Error(CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }

    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

/**
 * Cache simplu pentru date meteo
 */
class WeatherCache {
  constructor(maxAge = 10 * 60 * 1000) {
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

const weatherCache = new WeatherCache();

/**
 * Obține vremea curentă după numele orașului, cu caching
 * @param {string} city
 * @returns {Promise<any>}
 */
export const getCurrentWeather = async (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error('Oraș invalid.');
  }

  const key = `city:${city.toLowerCase()}`;
  const cached = weatherCache.get(key);
  if (cached) return cached;

  const url = buildUrl(CONFIG.API_ENDPOINTS.CURRENT_WEATHER, { q: city });
  const data = await makeRequest(url);
  weatherCache.set(key, data);
  return data;
};

/**
 * Obține vremea după coordonate lat/lon, cu caching
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<any>}
 */
export const getWeatherByCoords = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Coordonate invalide.');
  }

  const key = `coords:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache.get(key);
  if (cached) return cached;

  const url = buildUrl(CONFIG.API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
  const data = await makeRequest(url);
  weatherCache.set(key, data);
  return data;
};