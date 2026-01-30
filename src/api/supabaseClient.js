/**
 * @module supabaseClient
 * @description Inicializace instance Supabase klienta.
 * Načítá tajné klíče z souboru .env a vytváří spojení.
 */

import { createClient } from '@supabase/supabase-js';

// Načtení proměnných prostředí (z .env souboru)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kontrola, zda klíče existují (pro debugování)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CHYBA: Chybí Supabase URL nebo Anon Key v .env souboru!');
}

// Vytvoření a export klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey);