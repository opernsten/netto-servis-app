// src/utils/debugUtils.js

/**
 * Tato funkce obalí jakoukoliv tvoji databázovou operaci.
 * Pokud nastane chyba, automaticky zjistí, odkud jsi ji volal.
 */
export const safeExecute = async (operationName, operationFn) => {
  try {
    return await operationFn();
  } catch (error) {
    // 1. Získáme Stack Trace (historii volání)
    const stackLines = error.stack ? error.stack.split('\n') : [];
    
    // 2. Najdeme řádek, kde k chybě došlo (většinou 2. nebo 3. řádek ve stacku)
    // Hledáme první řádek, který odkazuje na TVŮJ kód (ne na knihovny react/supabase)
    const callerLine = stackLines.find(line => line.includes('/src/')) || stackLines[1];

    // 3. Vyčistíme text, aby tam zůstalo jen to podstatné (soubor:řádek)
    const location = callerLine ? callerLine.trim() : 'Neznámé umístění';

    // 4. Automatický výpis do konzole s proklikem
    console.group(`🚨 CHYBA: ${operationName}`);
    console.error(`%c📍 KDE: ${location}`, 'color: yellow; font-weight: bold;');
    console.error(`%c💬 CO: ${error.message}`, 'color: red;');
    console.error('🔍 DETAIL:', error);
    console.groupEnd();

    // Pošleme chybu dál, kdyby s ní chtěl formulář ještě pracovat (např. zobrazit alert)
    return { data: null, error };
  }
};