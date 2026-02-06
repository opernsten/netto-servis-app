import React from 'react';
import { AlertTriangle, Clock, Wrench, Database } from 'lucide-react';

const StatCard = ({ title, value, color, icon: Icon }) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-white bg-opacity-60`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="(Stroje) - Kritické poruchy" 
        value={stats.criticalCount} 
        color="red" 
        icon={AlertTriangle} 
      />
      <StatCard 
        title="(Zakázky) - Čeká na díly" 
        value={stats.waitingCount} 
        color="orange" 
        icon={Clock} 
      />
      <StatCard 
        title="(Zakázky) - Rozpracováno" 
        value={stats.activeCount} 
        color="blue" 
        icon={Wrench} 
      />
      <StatCard 
        title="Celkem strojů" 
        value={stats.totalMachines} 
        color="slate" 
        icon={Database} 
      />
    </div>
  );
};

export default DashboardStats;