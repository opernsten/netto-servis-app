/**
 * @module customerService
 * @description Datová vrstva (Data Access Layer) pro entitu Zákazník.
 * Obsahuje asynchronní funkce pro CRUD operace (get, insert, update, delete).
 * Vrací surová data nebo chyby přímo ze Supabase. Neobsahuje React logiku.
 */

import { supabase } from '../api/supabaseClient';

export const getCustomers = async () => {
  // TODO: Implement fetch
};