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

// Získání detailu zákazníka včetně strojů a zakázek
export const getCustomerById = async (id) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      machines (*),  
      jobs (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Seřadíme zakázky od nejnovější po nejstarší (ať vidíme historii nahoře)
  if (data.jobs) {
    data.jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return data;
};