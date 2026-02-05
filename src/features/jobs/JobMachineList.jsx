import React from 'react';
import { Wrench, CheckCircle2, Edit3 } from 'lucide-react';

const JobMachineList = ({ machines, status, onEditMachine }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wrench size={18} /> Servisované stroje</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {machines && machines.map(machine => (
            <div key={machine.link_id} className={`p-4 transition-colors ${machine.is_done ? 'bg-green-50/30' : 'hover:bg-slate-50'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* INFO O STROJI */}
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded ${machine.is_done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    {machine.is_done ? <CheckCircle2 size={24} /> : <Wrench size={24} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{machine.name}</p>
                    <p className="text-sm text-slate-500 font-mono">S/N: {machine.serial_number}</p>
                    {/* ZOBRAZENÍ REPORTU POKUD JE HOTOVO */}
                    {machine.is_done && (
                      <div className="mt-2 text-sm text-slate-700 bg-white p-2 rounded border border-green-100 shadow-sm">
                        <p className="font-medium text-green-800 text-xs uppercase mb-1">Provedená práce:</p>
                        {machine.report}
                      </div>
                    )}
                  </div>
                </div>

                {/* TLAČÍTKO AKCE */}
                {status !== 'hotovo' && (
                  <button
                    onClick={() => onEditMachine(machine)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-colors
                      ${machine.is_done
                        ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}
                    `}
                  >
                    {machine.is_done ? <><Edit3 size={16}/> Upravit</> : 'Vyplnit report'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default JobMachineList;
