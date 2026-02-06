import { supabase } from '../api/supabaseClient';

export const getDashboardStats = async () => {
  try {
    // 1. Získáme kritické stroje (porucha nebo odstaveno)
    const { data: criticalMachines, error: machinesError } = await supabase
      .from('machines')
      .select('*')
      .or('status.eq.porucha,status.eq.odstaveno')
      .limit(5); // Pro seznam "Co hoří" stačí pár

    // 2. Získáme aktivní zakázky (ne hotové)
    const { data: activeJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*, customers(name)')
      .neq('status', 'hotovo')
      .order('created_at', { ascending: true }) // Od nejstarších
      .limit(10);

    // 3. Spočítáme statistiky (pro budíky)
    // Poznámka: Supabase count je efektivnější než tahat všechna data
    
    // Počet kritických strojů
    const { count: criticalCount } = await supabase
      .from('machines')
      .select('*', { count: 'exact', head: true })
      .or('status.eq.porucha,status.eq.odstaveno');

    // Počet zakázek čekajících na díly
    const { count: waitingCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ceka_na_dily');

    // Počet rozpracovaných (nová + rozpracovaná)
    const { count: activeCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .or('status.eq.nova,status.eq.rozpracovana');

    // Celkem strojů
    const { count: totalMachines } = await supabase
      .from('machines')
      .select('*', { count: 'exact', head: true });

    if (machinesError) throw machinesError;
    if (jobsError) throw jobsError;

    return {
      criticalMachines: criticalMachines || [],
      activeJobs: activeJobs || [],
      stats: {
        criticalCount: criticalCount || 0,
        waitingCount: waitingCount || 0,
        activeCount: activeCount || 0,
        totalMachines: totalMachines || 0
      }
    };
  } catch (error) {
    console.error('Chyba načítání dashboardu:', error);
    throw error;
  }
};