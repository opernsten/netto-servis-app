import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { AlertOctagon, ArrowRight } from 'lucide-react';

const CriticalMachineList = ({ machines }) => {
  const navigate = useNavigate();

  if (!machines || machines.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center h-full">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
          <Badge variant="success">OK</Badge>
        </div>
        <h3 className="text-slate-800 font-bold">Všechno běží!</h3>
        <p className="text-slate-500 text-sm">Žádné kritické poruchy.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
        <h3 className="font-bold text-red-800 flex items-center gap-2">
          <AlertOctagon size={18} />
          Stroje mimo provoz
        </h3>
        <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-full border border-red-100">
          {machines.length}
        </span>
      </div>
      
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {machines.map((machine) => (
          <div 
            key={machine.id} 
            onClick={() => navigate(`/machines/${machine.id}`)}
            className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {machine.name}
              </h4>
              <Badge variant="danger">{machine.status}</Badge>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-xs text-slate-500 font-mono">SN: {machine.serial_number}</p>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalMachineList;