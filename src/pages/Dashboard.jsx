/**
 * @page Dashboard
 * @description Hlavní přehledová stránka aplikace.
 * Agreguje data z různých features (počty zakázek, stavy strojů) a zobrazuje widgety.
 * Je chráněna (vyžaduje přihlášení).
 */
//===========================================================================================================================================

import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import AppLogger from '../utils/AppLogger';

// Import features
import DashboardStats from '../features/dashboard/DashboardStats';
import CriticalMachineList from '../features/dashboard/CriticalMachineList';
import ActiveJobList from '../features/dashboard/ActiveJobList';

const Dashboard = () => {
  const [data, setData] = useState({
    criticalMachines: [],
    activeJobs: [],
    stats: { criticalCount: 0, waitingCount: 0, activeCount: 0, totalMachines: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (error) {
        AppLogger.error('Dashboard', 'Nepodařilo se načíst data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Načítám přehled...
      </div>
    );
  }

  return (
    <div className="w-full fade-in-up"> {/* Obyčejný kontejner */}
      
      {/* NADPIS STRÁNKY (Místo PageLayout title) */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Přehled servisu a kritických úkolů</p>
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