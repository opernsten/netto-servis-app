import React from 'react';
import PropTypes from 'prop-types';
import { Wrench, Hash, MapPin, CheckCircle, AlertTriangle, Ban } from 'lucide-react'; // Přidán Ban
import { Link } from 'react-router-dom';

const MachineTable = ({ machines, loading }) => {
  if (loading) return <div className="p-8 text-center text-slate-500">Načítám stroje...</div>;
  if (!machines?.length) return <div className="p-8 text-center text-slate-500">Zatím žádné stroje.</div>;

  // Funkce pro vykreslení štítku podle stavu
  const getStatusBadge = (status) => {
    if (status === 'ok') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} /> OK
        </span>
      );
    } else if (status === 'odstaveno') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Ban size={12} /> Odstaveno
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle size={12} /> Servis
        </span>
      );
    }
  };

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
                <Link to={`/machines/${machine.id}`} className="font-medium text-slate-900 hover:text-blue-600 flex items-center gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <div>{machine.name}</div>
                    <div className="text-xs text-slate-500 font-normal">{machine.type}</div>
                  </div>
                </Link>
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
                {/* Zde voláme novou funkci místo původní podmínky */}
                {getStatusBadge(machine.status)}
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