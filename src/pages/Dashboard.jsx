/**
 * @page Dashboard
 * @description Hlavní přehledová stránka aplikace.
 * Agreguje data z různých features (počty zakázek, stavy strojů) a zobrazuje widgety.
 * Je chráněna (vyžaduje přihlášení).
 */
//===========================================================================================================================================

import React from 'react';
import { useQuery } from '@tanstack/react-query'; // <--- NOVÝ IMPORT
import { getDashboardStats } from '../services/dashboardService';
import AppLogger from '../utils/AppLogger';

// Import features
import DashboardStats from '../features/dashboard/DashboardStats';
import CriticalMachineList from '../features/dashboard/CriticalMachineList';
import ActiveJobList from '../features/dashboard/ActiveJobList';

const Dashboard = () => {

  // --- STARÝ KÓD (Smaž nebo zakomentuj) ---
  /*
  const [data, setData] = useState(...);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     ...
  }, []);
  */

  // --- NOVÝ KÓD (React Query) ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-stats'], // Unikátní klíč pro cache
    queryFn: getDashboardStats,    // Funkce, která stahuje data
    refetchInterval: 30000,        // Automatický refresh každých 30s (volitelné)
  });

  // Pokud se načítá
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Načítám data Velínu...
      </div>
    );
  }

  // Pokud nastala chyba
  if (isError) {
    AppLogger.error('Dashboard', 'Chyba React Query', error);
    return (
      <div className="p-8 text-center text-red-500">
        Nepodařilo se načíst data Dashboardu. Zkuste to prosím později.
      </div>
    );
  }

  // Pokud máme data (React Query nám je vrátí v proměnné `data`)
  // Poznámka: Struktura `data` odpovídá tomu, co vrací dashboardService.js
  
  return (
    <div className="w-full fade-in-up">
      
      {/* NADPIS */}
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">Velín</h1>
           <p className="text-slate-500 mt-1">Přehled servisu a kritických úkolů</p>
        </div>
        {/* Malý indikátor, že je to živé */}
        <div className="text-xs text-slate-400 font-mono hidden md:block">
           Auto-refresh: 30s
        </div>
      </div>

      {/* 1. Horní řada - Budíky */}
      <DashboardStats stats={data.stats} />

      {/* 2. Hlavní mřížka */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
        
        {/* Levý sloupec (1/3) - Kritické stroje */}
        <div className="lg:col-span-1 h-full min-h-[400px]">
            <CriticalMachineList machines={data.criticalMachines} />
        </div>

        {/* Pravý sloupec (2/3) - Aktivní zakázky */}
        <div className="lg:col-span-2 h-full min-h-[400px]">
            <ActiveJobList jobs={data.activeJobs} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;