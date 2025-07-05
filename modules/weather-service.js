import { API_KEY, API_BASE_URL, DEFAULT_UNITS, DEFAULT_LANG, API_ENDPOINTS, ERROR_MESSAGES } from './config.js';
import { MOCK_DATA } from './mock.js';

/**
 * Construiește URL-ul pentru API
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(API_BASE_URL + endpoint);
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', DEFAULT_UNITS);
  url.searchParams.set('lang', DEFAULT_LANG);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

/**
 * Cerere GET cu tratare erori
 */
const makeRequest = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
        case 401:
          throw new Error('API Key invalid sau lipsă.');
        case 429:
          throw new Error('Prea multe cereri. Încearcă mai târziu.');
        default:
          throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

/**
 * Obține vremea curentă după oraș
 */
export const getCurrentWeather = async (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error('Oraș invalid.');
  }

  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });
  return await makeRequest(url);
};

/**
 * Obține vremea după coordonate
 */
export const getWeatherByCoords = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Coordonate invalide.');
  }

  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
  return await makeRequest(url);
};

/**
 * Obține vremea cu fallback la MOCK_DATA în caz de eroare
 */
export const getCurrentWeatherWithFallback = async (city) => {
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