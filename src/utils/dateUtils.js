/**
 * @module dateUtils
 * @description Pomocné funkce pro formátování data a času.
 * Pure functions - deterministický výstup.
 */

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('cs-CZ');
};

// Výpočet trvání mezi dvěma časy (HH:MM)
export const calculateDuration = (start, end) => {
  if (!start || !end) return '';

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  // Převedeme vše na minuty
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  let diff = endTotal - startTotal;

  // Pokud je konec menší než začátek (přes půlnoc), přičteme 24h
  if (diff < 0) {
    diff += 24 * 60;
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours} hod ${minutes} min`;
};