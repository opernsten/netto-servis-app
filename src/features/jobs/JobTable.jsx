import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '../../constants/appConstants';

const getStatusBadge = (status) => {
  const variant = JOB_STATUS_COLORS[status] || 'neutral';
  const label = JOB_STATUS_LABELS[status] || status;
  return <Badge variant={variant}>{label}</Badge>;
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'havarie': return <AlertCircle size={18} className="text-red-600" />;
    case 'vysoka': return <AlertCircle size={18} className="text-orange-500" />;
    case 'stredni': return <Clock size={18} className="text-blue-500" />;
    case 'nizka': return <CheckCircle2 size={18} className="text-slate-400" />;
    default: return null;
  }
};

const JobTable = ({ jobs, loading }) => {
  if (loading) return <div className="p-8 text-center text-slate-500">Načítám zakázky...</div>;
  if (!jobs?.length) return <div className="p-8 text-center text-slate-500">Zatím žádné zakázky.</div>;

  return (
    <Card className="rounded-xl shadow-sm border border-slate-200 overflow-hidden" noPadding>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-24">Číslo</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-16 text-center">Prio</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Předmět</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Zákazník</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Termín</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stav</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
              {/* ČÍSLO ZAKÁZKY */}
              <td className="px-6 py-4">
                <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                  {job.job_number || '---'}
                </span>
              </td>

              {/* PRIORITA */}
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center" title={job.priority}>
                  {getPriorityIcon(job.priority)}
                </div>
              </td>
              
              {/* PŘEDMĚT */}
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{job.title}</div>
                <div className="text-xs text-slate-500 truncate max-w-[200px]">{job.description}</div>
              </td>

              {/* ZÁKAZNÍK (Stroj zmizel) */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-800">{job.customers?.name}</div>
                <div className="text-xs text-slate-500">{job.customers?.address}</div>
              </td>

              {/* DATUM */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={14} /> 
                  {formatDate(job.scheduled_date)}
                </div>
              </td>

              {/* STAV */}
              <td className="px-6 py-4">
                {getStatusBadge(job.status)}
              </td>

              {/* AKCE */}
              <td className="px-6 py-4 text-right">
                <Link 
                  to={`/jobs/${job.id}`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                > 
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

JobTable.propTypes = {
  jobs: PropTypes.array,
  loading: PropTypes.bool
};

export default JobTable;
