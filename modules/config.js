// Înlocuiește cu cheia ta reală!
export const API_KEY = "6fa9abbb827dd547ac43dc54057e9d81";

export const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// MOCK_DATA - simulare răspuns API OpenWeather pentru București

export const MOCK_DATA = {
  name: "București",
  main: {
    temp: 22,
    humidity: 60,
  },
  weather: [
    {
      description: "Cer senin",
      icon: "01d",
    },
  ],
  wind: {
    speed: 3.6,
  },
  sys: {
    sunrise: 1687004400, // timestamp unix
    sunset: 1687051200,
  },
};
