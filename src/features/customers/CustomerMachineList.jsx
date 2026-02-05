import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, MapPin, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

const CustomerMachineList = ({ machines, onAddMachine }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
        {(!machines || machines.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 text-slate-400">
                    <Wrench size={24} />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Zatím žádné stroje</h3>
                <p className="text-slate-500 text-sm mb-6">Evidence strojů je prázdná.</p>
                <Button variant="primary" onClick={onAddMachine} className="shadow-lg shadow-blue-500/30">
                    + Přidat první stroj
                </Button>
            </div>
        ) : (
            <>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-8 py-4 font-bold">Název stroje</th>
                            <th className="px-6 py-4 font-bold">Sériové číslo</th>
                            <th className="px-6 py-4 font-bold">Umístění</th>
                            <th className="px-6 py-4 font-bold">Typ</th>
                            <th className="px-8 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {machines.map(machine => (
                            <tr key={machine.id} onClick={() => navigate(`/machines/${machine.id}`)} className="hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                                <td className="px-8 py-5">
                                    <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-base">{machine.name}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-300 font-bold">{machine.serial_number}</span>
                                </td>
                                <td className="px-6 py-5">
                                    {machine.location ? (
                                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                                            <MapPin size={14} className="text-slate-400" /> {machine.location}
                                        </span>
                                    ) : <span className="text-slate-400">-</span>}
                                </td>
                                <td className="px-6 py-5">
                                    <span className="inline-block border border-slate-200 px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-600 bg-white shadow-sm">
                                        {machine.type}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 group-hover:border-blue-300 group-hover:text-blue-600 transition-all shadow-sm ml-auto">
                                        <ChevronRight size={16} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 bg-slate-50 border-t border-slate-300 flex justify-center">
                    <button
                        onClick={onAddMachine}
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-300"
                    >
                        + Přidat další stroj
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default CustomerMachineList;
