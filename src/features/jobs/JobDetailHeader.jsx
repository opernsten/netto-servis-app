import React from 'react';
import { Building2, Calendar, Award, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const JobDetailHeader = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">

        {/* ŠTÍTEK DOKONČENO */}
        {job.status === 'hotovo' && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-8 py-1 rotate-45 translate-x-8 translate-y-4 shadow-sm">
            DOKONČENO
          </div>
        )}

        {/* Štítek Smlouva */}
        {job.has_service_contract && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 border border-purple-200">
            <Award size={14} /> Servisní smlouva
          </span>
        )}

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-lg font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">{job.job_number}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${job.status === 'hotovo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {job.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          </div>
          <div className="text-right pr-12">
             <div className="text-sm text-slate-500 mb-1">Termín</div>
             <div className="flex items-center gap-2 font-medium text-slate-800 justify-end">
                <Calendar size={18} className="text-blue-600"/> {formatDate(job.scheduled_date)}
             </div>
          </div>
        </div>
        <hr className="border-slate-100 my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Zákazník</h3>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1"><Building2 size={24} /></div>
              <div>
                <p className="font-bold text-lg text-slate-800">{job.customers.name}</p>
                <p className="text-slate-600">{job.customers.address}</p>
              </div>
            </div>
          </div>
          {/* KOUČ */}
          <div className="mt-6 pt-6 border-t border-slate-100">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Realizační tým</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-xs text-slate-500">Technici na výjezdu</div>
                   <div className="font-medium text-slate-900">{job.technician_names || '-'}</div>
                </div>
                <div>
                   <div className="text-xs text-slate-500">Kouč zakázky</div>
                   <div className="font-medium text-slate-900 flex items-center gap-2">
                      {job.coach ? <><UserCheck size={16} className="text-blue-500"/> {job.coach}</> : '-'}
                   </div>
                </div>
             </div>
          </div>
          <div>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Zadání</h3>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700">{job.description || 'Bez popisu.'}</div>
          </div>
        </div>
      </div>
  );
};

export default JobDetailHeader;
