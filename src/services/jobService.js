/**
 * @module jobService
 * @description Komunikace s databází pro tabulku 'jobs'.
 */

import { supabase } from '../api/supabaseClient';

// 1. Získání všech zakázek (včetně jmen zákazníka a stroje)
export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (name, address),
      machines (name, type, serial_number)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Chyba při načítání zakázek:', error);
    throw error;
  }
  
  return data;
};

// 2. Vytvoření zakázky
export const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();

  if (error) throw error;
  return data;
};