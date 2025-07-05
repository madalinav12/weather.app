// modules/test-utils.js

/**
 * Suprascrie fetch pentru a simula erori de rețea cu o anumită rată de eșec.
 * @param {number} failureRate - valoare între 0 și 1 care indică procentul de erori simulate (ex: 0.5 = 50%)
 * @returns {Function} - funcție pentru restaurarea fetch originală
 */
export const simulateNetworkErrors = (failureRate = 0.5) => {
  const originalFetch = window.fetch;

  window.fetch = (...args) => {
    if (Math.random() < failureRate) {
      console.warn('Simulated network error');
      return Promise.reject(new Error('Network simulation error'));
    }
    return originalFetch(...args);
  };

  // Returnează o funcție pentru a restaura fetch-ul original
  return () => {
    window.fetch = originalFetch;
  };
};

/**
 * Simulează throttling (încetinire) a rețelei prin delay artificial la fetch.
 * @param {number} delayMs - numărul de milisecunde pentru delay
 * @returns {Function} - funcție pentru restaurarea fetch originală
 */
export const simulateNetworkDelay = (delayMs = 1000) => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return originalFetch(...args);
  };

  return () => {
    window.fetch = originalFetch;
  };
};
