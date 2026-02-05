// src/utils/AppLogger.js

// Zjistíme, jestli běžíme ve vývojovém režimu (localhost)
const isDev = import.meta.env.DEV; 

const AppLogger = {
  // Běžná informace (Modrá)
  log: (component, message, data = null) => {
    if (!isDev) return;
    console.log(
      `%c[${component}] %c${message}`, 
      'color: #3b82f6; font-weight: bold;', // Modrá pro název komponenty
      'color: #94a3b8;',                    // Šedá pro zprávu
      data || ''
    );
  },

  // Úspěšná akce (Zelená)
  success: (component, message, data = null) => {
    if (!isDev) return;
    console.log(
      `%c[${component}] %c${message}`, 
      'color: #10b981; font-weight: bold;', // Zelená
      'color: #cbd5e1;',
      data || ''
    );
  },

  // Varování (Oranžová)
  warn: (component, message, data = null) => {
    if (!isDev) return;
    console.warn(`[${component}] ${message}`, data || '');
  },

  // Chyba (Červená) - Tu vypisujeme VŽDY, i na produkci (je důležitá)
  error: (component, message, error = null) => {
    console.error(
      `%c[${component}] ❌ ${message}`, 
      'color: #ef4444; font-weight: bold; font-size: 1.1em;', 
      error || ''
    );
  }
};

export default AppLogger;