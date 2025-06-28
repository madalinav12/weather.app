import {
  API_KEY,
  API_BASE_URL,
  DEFAULT_UNITS,
  DEFAULT_LANG,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  CONFIG,
} from './config.js';

import { MOCK_DATA } from './mock.js'; // Opțional, dacă vrei fallback

// Construiește URL-ul complet cu parametri
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(API_BASE_URL + endpoint);
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', DEFAULT_UNITS);
  url.searchParams.set('lang', DEFAULT_LANG);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

// Face request-ul propriu-zis către API
const makeRequest = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
      if (response.status === 401) throw new Error('API Key invalid sau lipsă.');
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

// Obține vremea pe baza numelui orașului
const getCurrentWeather = async (city) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });
  return await makeRequest(url);
};

// Obține vremea pe baza coordonatelor
const getWeatherByCoords = async (lat, lon) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
  return await makeRequest(url);
};

// Fallback: în caz că nu funcționează API-ul, returnează date simulate
const getCurrentWeatherWithFallback = async (city) => {
  try {
    return await getCurrentWeather(city);
  } catch (error) {
    console.warn('Folosesc date simulate:', error.message);
    return {
      ...MOCK_DATA,
      name: city,
      isFallback: true,
      fallbackReason: error.message,
    };
  }
};

// Exportă serviciul meteo sub formă de obiect
export const weatherService = {
  getCurrentWeather,
  getWeatherByCoords,
  getCurrentWeatherWithFallback,
};
