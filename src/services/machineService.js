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


// 4. Získání detailu jednoho stroje VČETNĚ HISTORIE SERVISŮ
export const getMachineById = async (id) => {
  // A) Načteme info o stroji a majiteli
  const { data: machine, error: machineError } = await supabase
    .from('machines')
    .select(`
      *,
      customers (id, name, address)
    `)
    .eq('id', id)
    .single();

  if (machineError) throw machineError;

  // B) Načteme historii (vazba job_machines -> jobs)
  // Chceme jen ty záznamy, kde už je něco vyplněno (report) nebo je hotovo
  const { data: history, error: historyError } = await supabase
    .from('job_machines')
    .select(`
      id,
      completed_at,
      report,
      work_hours,
      created_at,
      jobs (
        job_number,
        scheduled_date,
        status,
        priority,
        technician_names
      )
    `)
    .eq('machine_id', id)
    .order('created_at', { ascending: false }); // Od nejnovějšího

  if (historyError) throw historyError;

  // Spojíme to dohromady
  return { ...machine, history };
};

// 5. Aktualizace stroje (např. změna umístění, SW verze...)
export const updateMachine = async (id, updates) => {
  const { data, error } = await supabase
    .from('machines')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Chyba při aktualizaci stroje:', error);
    throw error;
  }
  return data;
};

// 6. Uložení reportu stroje a použitých dílů (Nahradí starou update funkci)
export const completeMachineWork = async (jobMachineId, reportText, parts = []) => {
  // A) Uložíme text reportu
  const { error: updateError } = await supabase
    .from('job_machines')
    .update({ 
      report: reportText, 
      completed_at: new Date().toISOString() // Označíme jako hotové
    })
    .eq('id', jobMachineId);

  if (updateError) throw updateError;

  // B) Pokud jsou díly, uložíme je
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

// 7. Načtení použitých dílů pro konkrétní záznam historie
export const getUsedParts = async (jobMachineId) => {
  const { data, error } = await supabase
    .from('job_machine_parts')
    .select('*')
    .eq('job_machine_id', jobMachineId);
  
  if (error) {
    console.error('Chyba načítání dílů:', error);
    return [];
  }
  return data;
};