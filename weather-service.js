// modules/weather-service.js

export class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  // Obține vremea după oraș
  async getWeatherByCity(city, unit = 'metric', lang = 'ro') {
    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${unit}&lang=${lang}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Nu am putut găsi orașul introdus.');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error('Eroare la încărcarea vremii: ' + err.message);
    }
  }

  // Obține vremea după coordonate GPS
  async getWeatherByCoords(lat, lon, unit = 'metric', lang = 'ro') {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${unit}&lang=${lang}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Nu am putut obține datele meteo pentru locația ta.');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error('Eroare la încărcarea vremii după locație: ' + err.message);
    }
  }
}
