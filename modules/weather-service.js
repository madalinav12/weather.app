import { API_KEY, BASE_URL } from "./config.js";

export const getCurrentWeather = async (city) => {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ro`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Oraș invalid");
    return await response.json();
  } catch (err) {
    throw new Error("Eroare la API: " + err.message);
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ro`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Locație invalidă");
    return await response.json();
  } catch (err) {
    throw new Error("Eroare coordonate: " + err.message);
  }
};
