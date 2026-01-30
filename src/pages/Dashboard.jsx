/**
 * @page Dashboard
 * @description Hlavní přehledová stránka aplikace.
 * Agreguje data z různých features (počty zakázek, stavy strojů) a zobrazuje widgety.
 * Je chráněna (vyžaduje přihlášení).
 */
//===========================================================================================================================================

import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Přehled servisu</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Nová zakázka
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Karta 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm">Otevřené zakázky</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
        </div>

        {/* Karta 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm">Dnes vyřešeno</p>
          <p className="text-3xl font-bold text-green-600 mt-2">4</p>
        </div>

        {/* Karta 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm">Čeká na díly</p>
          <p className="text-3xl font-bold text-orange-500 mt-2">3</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Poslední aktivita</h3>
        <p className="text-slate-500 italic">Zatím žádná data...</p>
      </div>
    </div>
  );
};

export default Dashboard;