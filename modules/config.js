const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

export const CONFIG = {
  API_KEY: isDevelopment ? 'DEV_API_KEY' : '6fa9abbb827dd547ac43dc54057e9d81',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'ro',
  API_ENDPOINTS: {
    CURRENT_WEATHER: '/weather',
    FORECAST: '/forecast',
  },
  ERROR_MESSAGES: {
    CITY_NOT_FOUND: 'Orașul nu a fost găsit. Încearcă din nou.',
    NETWORK_ERROR: 'Verifică conexiunea la internet.',
    UNKNOWN_ERROR: 'A apărut o eroare necunoscută.',
  },
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
  DEBUG_MODE: isDevelopment,
  ENABLE_CONSOLE_LOGS: isDevelopment,
};
