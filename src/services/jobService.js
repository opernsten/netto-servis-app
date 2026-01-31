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

// ... existující kód ...

// 3. Získání detailu jedné zakázky (včetně zákazníka a strojů)
export const getJobById = async (id) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (*),
      job_machines (
        id,
        report,
        work_hours,
        completed_at,
        is_done,
        machines (*),
        job_machine_parts (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Přeformátujeme data, aby se s nimi lépe pracovalo
  // Výsledek: job.machines bude pole, kde každý prvek má info o stroji I O REPORTU
  const formattedData = {
    ...data,
    machines: data.job_machines.map(item => ({
      ...item.machines,        // Data stroje (name, serial...)
      link_id: item.id,        // ID vazby (důležité pro update)
      report: item.report,     // Popis opravy
      machine_work_hours: item.work_hours, // Hodiny na stroji
      is_done: !!item.completed_at || item.is_done,    // Jestli je hotovo
      parts: item.job_machine_parts || []
    }))
  };

  return formattedData;
};

// 5. Uložení reportu ke konkrétnímu stroji v zakázce
// Aktualizace reportu stroje (včetně náhradních dílů)
export const updateMachineReport = async (jobMachineId, reportText, parts = []) => {
  // 1. Uložíme text reportu a nastavíme completed_at
  const { error: updateError } = await supabase
    .from('job_machines')
    .update({ 
      report: reportText,
      completed_at: new Date().toISOString() // Označíme jako hotové
    })
    .eq('id', jobMachineId);

  if (updateError) throw updateError;

  // 2. Pokud jsou vyplněné díly, uložíme je do vedlejší tabulky
  if (parts.length > 0) {
    const partsToInsert = parts.map(p => ({
      job_machine_id: jobMachineId,
      article_number: p.article_number,
      description: p.description,
      quantity: parseInt(p.quantity, 10)
    }));

    const { error: partsError } = await supabase
      .from('job_machine_parts')
      .insert(partsToInsert);

    if (partsError) throw partsError;
  }
};

// 4. Aktualizace zakázky (např. při dokončení)
export const updateJob = async (id, updates) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Chyba při aktualizaci zakázky:', error);
    throw error;
  }
  return data;
};