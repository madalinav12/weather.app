export const CONFIG = {
  API_KEY: '6fa9abbb827dd547ac43dc54057e9d81',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'ro',
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Orașul nu a fost găsit. Încearcă din nou.',
  NETWORK_ERROR: 'Verifică conexiunea la internet.',
  UNKNOWN_ERROR: 'A apărut o eroare necunoscută.',
};
