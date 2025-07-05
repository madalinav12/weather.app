export const API_KEY = '6fa9abbb827dd547ac43dc54057e9d81';
export const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const DEFAULT_UNITS = 'metric';
export const DEFAULT_LANG = 'ro';

export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Orașul nu a fost găsit. Încearcă din nou.',
  NETWORK_ERROR: 'Verifică conexiunea la internet.',
  UNKNOWN_ERROR: 'A apărut o eroare necunoscută.',
};

export const CONFIG = {
  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    USER_PREFERENCES: 'weather_user_prefs',
  },
  LOGGING: {
    ENABLED: true,
    LEVEL: 'info',
    MAX_LOGS: 100,
  },
};
