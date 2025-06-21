🌦️ Weather App - Documentație
📌 Funcționalități

- 🔍 Căutare meteo după numele orașului
- 📍 Detectare locație automată cu fallback (GPS → IP)
- 🌡️ Afișare temperatură, umiditate, vânt, răsărit/apus, descriere
- 🌍 Selectare limbă pentru descrierea meteo (ro, en, etc.)
- 🧭 Selectare unități: Celsius (°C) sau Fahrenheit (°F)
- 💾 Salvarea preferințelor utilizatorului (unități și limbă)
- 🧱 Arhitectură modulară (config, UI, servicii API)

🧪 Tehnologii folosite

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API
- Geolocation API
- IP-based geolocation (ipapi.co)
- localStorage

🔧 Instalare locală
1. Clonează repository-ul:

git clone https://github.com/numele-tau/weather-app.git
cd weather-app

2. Adaugă cheia API în fișierul modules/config.js:

export const CONFIG = {
  API_KEY: '6fa9abbb827dd547ac43dc54057e9d81',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'ro'
};

3. Deschide fișierul index.html în browser cu Live Server din VS Code.
📁 Structură foldere

weather-app/
│
├── index.html
├── style.css
├── app.js
└── modules/
    ├── config.js
    ├── ui-controller.js
    ├── weather-service.js
    ├── location-service.js
    └── mock.js

✅ Funcționalități testate

- [x] Funcționează căutarea meteo
- [x] Funcționează detectarea locației
- [x] Controalele pentru unități/limbă sunt sincronizate
- [x] Gestionare elegantă a erorilor (ex: fără conexiune, oraș invalid)

ℹ️ Despre proiect

Această aplicație a fost dezvoltată ca exercițiu educațional pentru învățarea:
- Integrării cu API-uri reale
- Gestionării erorilor în aplicații front-end
- Personalizării experienței utilizatorului

👩‍💻 Autor
Voicu Nicoleta Mădălina
