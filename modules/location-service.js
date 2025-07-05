import { CONFIG, ERROR_MESSAGES } from './config.js'

/**
 * Obține coordonatele geografice ale utilizatorului
 * Folosește geolocația browserului, fallback la IP dacă e refuzată sau eșuează
 * Timeout și alte setări preluate din config
 * @returns {Promise<{latitude: number, longitude: number, source: string, accuracy: string}>}
 */
export const getCoords = () => new Promise((resolve, reject) => {

  // Fallback la geolocație bazată pe IP, folosind ipapi.co
  const fallbackToIp = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) throw new Error('Eroare la fallback IP')

      const data = await response.json()
      if (!data.latitude || !data.longitude) {
        throw new Error('Date IP invalide')
      }

      resolve({
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'ip',
        accuracy: 'city',
      })
    } catch (error) {
      reject(new Error(ERROR_MESSAGES.UNKNOWN_ERROR))
    }
  }

  if (!navigator.geolocation) {
    // Browser-ul nu suportă geolocație - fallback direct
    fallbackToIp()
    return
  }

  // Opțiuni pentru geolocație, configurabile
  const geoOptions = {
    timeout: CONFIG.GEOLOCATION.TIMEOUT_MS || 7000,
    enableHighAccuracy: true,
    maximumAge: CONFIG.GEOLOCATION.MAX_AGE_MS || 60000,
  }

  // Promise race: timeout manual suplimentar (pentru siguranță)
  const geoPromise = new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'gps',
          accuracy: 'precise',
        })
      },
      (error) => {
        console.warn('Geolocation failed:', error.message)
        // fallback când GPS refuzat sau eșuat
        fallbackToIp()
      },
      geoOptions
    )
  })

  geoPromise.then(resolve).catch(() => fallbackToIp())
})
