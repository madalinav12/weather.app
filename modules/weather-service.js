import { CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './config.js';
import { MOCK_DATA } from './mock.js';

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(CONFIG.API_BASE_URL + endpoint);
  url.searchParams.set('appid', CONFIG.API_KEY);
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS);
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

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

export const getCurrentWeather = async (city) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });
  return await makeRequest(url);
};

export const getWeatherByCoords = async (lat, lon) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
  return await makeRequest(url);
};

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
