import React from 'react';
import PropTypes from 'prop-types';
import { Wrench, Hash, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MachineTable = ({ machines, loading }) => {
  if (loading) return <div className="p-8 text-center text-slate-500">Načítám stroje...</div>;
  if (!machines?.length) return <div className="p-8 text-center text-slate-500">Zatím žádné stroje.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Název stroje</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Výrobní číslo</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Zákazník</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stav</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {machines.map((machine) => (
            <tr key={machine.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Wrench size={20} />
                  </div>
                  <Link to={`/machines/${machine.id}`} className="font-medium text-slate-900 hover:text-blue-600 hover:underline">
                    {machine.name}
                  </Link>
                </div>
              </td>
              
              <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                <div className="flex items-center gap-2">
                    <Hash size={14} />
                    {machine.serial_number || '-'}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <MapPin size={14} /> 
                  {machine.customers?.name || 'Neznámý'}
                </div>
                <div className="text-xs text-slate-400 pl-6">
                    {machine.customers?.address}
                </div>
              </td>

              <td className="px-6 py-4">
                {machine.status === 'ok' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} /> OK
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle size={12} /> Servis
                    </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

MachineTable.propTypes = {
  machines: PropTypes.array,
  loading: PropTypes.bool
};

export default MachineTable;