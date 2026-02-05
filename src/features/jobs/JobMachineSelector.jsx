import React from 'react';
import { Wrench, User } from 'lucide-react';
import Card from '../../components/ui/Card';

const JobMachineSelector = ({ machines, selectedMachineIds, onToggleMachine, customerId }) => {
  return (
    <Card className="flex flex-col h-[500px] overflow-hidden bg-slate-50 border-slate-200" noPadding>
        <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
            <div className="font-bold text-slate-700 flex items-center gap-2">
                <Wrench size={18} className="text-blue-600"/>
                Výběr zařízení
            </div>
            {machines.length > 0 && (
                <span className="text-xs bg-white border px-2 py-1 rounded-full text-slate-500">
                    Nalezeno: {machines.length} ks
                </span>
            )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {!customerId ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6">
                    <User size={48} className="mb-3 opacity-20" />
                    <p>Nejdříve vyberte zákazníka v levé části.</p>
                </div>
            ) : machines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6">
                    <Wrench size={48} className="mb-3 opacity-20" />
                    <p>Tento zákazník nemá v databázi evidované žádné stroje.</p>
                </div>
            ) : (
                machines.map(machine => (
                    <label
                        key={machine.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedMachineIds.includes(machine.id)
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                    >
                        <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 rounded mt-0.5"
                        checked={selectedMachineIds.includes(machine.id)}
                        onChange={() => onToggleMachine(machine.id)}
                        />
                        <div>
                            <div className={`font-medium text-sm ${selectedMachineIds.includes(machine.id) ? 'text-blue-800' : 'text-slate-800'}`}>
                                {machine.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                S/N: {machine.serial_number} • {machine.type}
                            </div>
                        </div>
                    </label>
                ))
            )}
        </div>

        {/* Info patička seznamu */}
        <div className="p-3 bg-white border-t border-slate-200 text-xs text-center text-slate-400">
            Vybráno strojů: <span className="font-bold text-slate-800">{selectedMachineIds.length}</span>
        </div>
    </Card>
  );
};

export default JobMachineSelector;
