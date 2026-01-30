import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, AlertCircle, CheckCircle2, Clock, Wrench } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils'; // Budeme potřebovat formátování data

// Pomocná funkce pro barvu statusu
const getStatusBadge = (status) => {
  switch (status) {
    case 'nova': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Nová</span>;
    case 'resi_se': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Řeší se</span>;
    case 'ceka_dily': return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">Čeká na díly</span>;
    case 'hotovo': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Hotovo</span>;
    default: return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">{status}</span>;
  }
};

// Pomocná funkce pro prioritu
const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'havarie': return <AlertCircle size={16} className="text-red-600" />;
    case 'vysoka': return <AlertCircle size={16} className="text-orange-500" />;
    case 'stredni': return <Clock size={16} className="text-blue-500" />;
    case 'nizka': return <CheckCircle2 size={16} className="text-slate-400" />;
    default: return null;
  }
};

const JobTable = ({ jobs, loading }) => {
  if (loading) return <div className="p-8 text-center text-slate-500">Načítám zakázky...</div>;
  if (!jobs?.length) return <div className="p-8 text-center text-slate-500">Zatím žádné zakázky.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-16">Prio</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Předmět</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Zákazník & Stroj</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Datum</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stav</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div title={job.priority}>{getPriorityIcon(job.priority)}</div>
              </td>
              
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{job.title}</div>
                <div className="text-xs text-slate-500 truncate max-w-[200px]">{job.description}</div>
              </td>

              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-800">{job.customers?.name}</div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Wrench size={10} />
                    {job.machines?.name || 'Bez stroje'}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={14} /> 
                  {formatDate(job.scheduled_date)}
                </div>
              </td>

              <td className="px-6 py-4">
                {getStatusBadge(job.status)}
              </td>

              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Otevřít</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

JobTable.propTypes = {
  jobs: PropTypes.array,
  loading: PropTypes.bool
};

export default JobTable;