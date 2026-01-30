/**
 * @module customerService
 * @description Komunikace s databází pro tabulku 'customers'.
 */

import { supabase } from '../api/supabaseClient';

// 1. Získání všech zákazníků
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')      // Z tabulky 'customers'
    .select('*')            // Vyber všechny sloupce
    .order('name');         // Seřaď podle abecedy
  
  if (error) {
    console.error('Chyba při načítání zákazníků:', error);
    throw error;
  }
  
  return data;
};

// 2. Vytvoření nového zákazníka (to použijeme později)
export const createCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) throw error;
  return data;
};