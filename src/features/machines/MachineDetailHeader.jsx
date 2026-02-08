import React from 'react';
import { Factory, AlertTriangle, CheckCircle2, Edit3, Ban } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MachineDetailHeader = ({ machine, onEdit }) => {
  
  // --- NOVÁ LOGIKA PRO STAVY (OK / ODSTAVENO / PORUCHA) ---
  const getStatusConfig = (status) => {
    switch (status) {
      case 'ok':
        return {
          bgClass: 'bg-white border-slate-200',
          iconBg: 'bg-slate-100',
          factoryColor: 'text-slate-600',
          statusIcon: <CheckCircle2 className="text-green-600" size={24} />,
          statusText: 'OK - V PROVOZU',
          statusTextColor: 'text-green-700'
        };
      case 'odstaveno':
        return {
          bgClass: 'bg-slate-50 border-slate-300', // Šedé pozadí
          iconBg: 'bg-slate-200',
          factoryColor: 'text-slate-500',
          statusIcon: <Ban className="text-slate-500" size={24} />,
          statusText: 'ODSTAVENO / MIMO PROVOZ',
          statusTextColor: 'text-slate-600'
        };
      default: // Porucha nebo jiný stav
        return {
          bgClass: 'bg-red-50 border-red-200',
          iconBg: 'bg-red-100',
          factoryColor: 'text-red-600',
          statusIcon: <AlertTriangle className="text-red-600" size={24} />,
          statusText: 'PORUCHA / SERVIS',
          statusTextColor: 'text-red-700'
        };
    }
  };

  const config = getStatusConfig(machine?.status);

  return (
    <div className={`rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${config.bgClass}`}>
        
        {/* LEVÁ ČÁST - INFO O STROJI */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${config.iconBg}`}>
             <Factory size={32} className={config.factoryColor} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="font-bold text-2xl text-slate-900">{machine?.name}</span>
               {machine?.type && (
                 <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-mono">
                    {machine.type}
                 </span>
               )}
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm ${config.statusTextColor}`}>
               {config.statusIcon}
               {config.statusText}
            </div>
          </div>
        </div>

        {/* PRAVÁ ČÁST - TLAČÍTKO */}
        <Button
          variant="secondary"
          onClick={onEdit}
          className="flex items-center gap-2 bg-white border border-slate-300 shadow-sm hover:bg-slate-50"
        >
          <Edit3 size={18} />
          Upravit stroj
        </Button>
    </div>
  );
};

export default MachineDetailHeader;