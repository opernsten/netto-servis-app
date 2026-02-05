import React from 'react';
import { Factory, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MachineDetailHeader = ({ machine, onEdit }) => {
  const isProblem = machine.status !== 'ok';
  const headerBgClass = isProblem ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200';
  const statusIcon = isProblem ? <AlertTriangle className="text-red-600" size={24} /> : <CheckCircle2 className="text-green-600" size={24} />;
  const statusText = isProblem ? 'PORUCHA / SERVIS' : 'OK - V PROVOZU';
  const statusTextColor = isProblem ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${headerBgClass}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isProblem ? 'bg-red-100' : 'bg-slate-100'}`}>
             <Factory size={32} className={isProblem ? 'text-red-600' : 'text-slate-600'} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="font-bold text-2xl text-slate-900">{machine.name}</span>
               <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-mono">{machine.type}</span>
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm ${statusTextColor}`}>
               {statusIcon}
               {statusText}
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit3 size={18} />
          Upravit stroj
        </Button>
      </div>
  );
};

export default MachineDetailHeader;
