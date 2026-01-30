/**
 * @module machineService
 * @description Komunikace s databází pro tabulku 'machines'.
 */

import { supabase } from '../api/supabaseClient';

// 1. Získání všech strojů (včetně jména zákazníka)
export const getMachines = async () => {
  const { data, error } = await supabase
    .from('machines')
    .select('*, customers(name, address)') // Tady děláme "JOIN" - vytáhneme i data zákazníka
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Chyba při načítání strojů:', error);
    throw error;
  }
  
  return data;
};

// 2. Vytvoření stroje
export const createMachine = async (machineData) => {
  const { data, error } = await supabase
    .from('machines')
    .insert([machineData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 3. Získání strojů pouze pro jednoho konkrétního zákazníka
export const getMachinesByCustomer = async (customerId) => {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('customer_id', customerId); // Filtr: Kde customer_id se rovná tomu, co hledáme
    
  if (error) throw error;
  return data;
};