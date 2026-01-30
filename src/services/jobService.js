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
      customers (name, address)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Chyba při načítání zakázek:', error);
    throw error;
  }
  
  return data;
};

// createJob upravíme později, až budeme dělat modál pro zakázky
// Upravená funkce pro vytvoření zakázky s více stroji
export const createJob = async (jobData, machineIds) => {
  // 1. Vytvoříme samotnou zakázku
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();

  if (jobError) throw jobError;

  // 2. Pokud jsou vybrané nějaké stroje, vytvoříme vazby
  if (machineIds && machineIds.length > 0) {
    // Připravíme data: [{job_id: 123, machine_id: A}, {job_id: 123, machine_id: B}]
    const machineLinks = machineIds.map(machineId => ({
      job_id: job.id,
      machine_id: machineId
    }));

    const { error: linkError } = await supabase
      .from('job_machines')
      .insert(machineLinks);

    if (linkError) {
      console.error('Chyba při ukládání strojů k zakázce:', linkError);
      // I když se nepovede uložit stroje, zakázka už existuje.
      // V reálu bychom to tu mohli řešit víc, ale pro teď to stačí.
    }
  }

  return job;
};