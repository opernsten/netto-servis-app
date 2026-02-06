import { supabase } from '../api/supabaseClient';

/**
 * Stáhne všechny události pro kalendář (Zakázky + Plánované servisy strojů)
 */
export const getCalendarEvents = async () => {
  try {
    // 1. Stáhneme ZAKÁZKY (Jobs) - Červená/Modrá vrstva
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      // ZMĚNA ZDE: místo 'city' dáváme 'address'
      .select('id, job_number, scheduled_date, status, description, customers(name, address)')
      .not('scheduled_date', 'is', null);

    if (jobsError) throw jobsError;

    // 2. Stáhneme STROJE s plánovaným servisem (Machines) - Zelená vrstva
    const { data: machines, error: machinesError } = await supabase
      .from('machines')
      // ZMĚNA ZDE: místo 'city' dáváme 'address'
      .select('id, name, next_service_date, serial_number, customers(name, address)')
      .not('next_service_date', 'is', null);

    if (machinesError) throw machinesError;

    // 3. Transformace dat pro kalendář
    const jobEvents = jobs.map(job => ({
      id: `job-${job.id}`,
      title: `${job.customers?.name || 'Bez jména'} (${job.job_number})`,
      start: new Date(job.scheduled_date),
      end: new Date(job.scheduled_date),
      type: 'job',
      status: job.status,
      resourceId: job.id,
      originalData: job
    }));

    const machineEvents = machines.map(machine => ({
      id: `machine-${machine.id}`,
      title: `Servis: ${machine.name} - ${machine.customers?.name || ''}`,
      start: new Date(machine.next_service_date),
      end: new Date(machine.next_service_date),
      type: 'machine',
      status: 'planned',
      resourceId: machine.id,
      originalData: machine
    }));

    return [...jobEvents, ...machineEvents];

  } catch (error) {
    console.error('Chyba při načítání kalendáře:', error);
    throw error;
  }
};