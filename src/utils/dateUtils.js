/**
 * @module dateUtils
 * @description Pomocné funkce pro formátování data a času.
 * Pure functions - deterministický výstup.
 */

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('cs-CZ');
};