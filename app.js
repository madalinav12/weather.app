import * as ui from "./modules/ui-controller.js";
import * as weather from "./modules/weather-service.js";

const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click", handleSearch);
  ui.elements.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  ui.elements.locationBtn.addEventListener("click", handleLocation);
};

const handleSearch = async () => {
  const city = ui.elements.cityInput.value.trim();
  if (!isValidCity(city)) {
    ui.showError("Introdu un oraș valid.");
    return;
  }

  try {
    ui.showLoading();
    const data = await weather.getCurrentWeather(city);
    ui.displayWeather(data);
  } catch (err) {
    ui.showError(err.message);
  } finally {
    ui.hideLoading();
  }
};

const handleLocation = () => {
  if (!navigator.geolocation) {
    ui.showError("Browserul nu suportă locația.");
    return;
  }

  ui.showLoading();
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const data = await weather.getWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );
      ui.displayWeather(data);
    } catch (err) {
      ui.showError(err.message);
    } finally {
      ui.hideLoading();
    }
  }, () => {
    ui.showError("Nu ai permis accesul la locație.");
    ui.hideLoading();
  });
};

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

setupEventListeners();

// Pornește cu București
(async () => {
  try {
    ui.showLoading();
    const data = await weather.getCurrentWeather("București");
    ui.displayWeather(data);
  } catch (err) {
    ui.showError("Nu s-a putut încărca vremea pentru București.");
  } finally {
    ui.hideLoading();
  }
})();
