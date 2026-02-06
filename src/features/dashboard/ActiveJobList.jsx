import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { Calendar, Briefcase } from 'lucide-react';

const ActiveJobList = ({ jobs }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Briefcase size={18} className="text-slate-400" />
          Otevřené zakázky
        </h3>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Žádné otevřené zakázky.
          </div>
        ) : (
          jobs.map((job) => (
            <div 
              key={job.id} 
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                   <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                     {job.job_number}
                   </span>
                   <h4 className="font-bold text-slate-800 mt-1">{job.customers?.name || 'Neznámý zákazník'}</h4>
                </div>
                <Badge variant={
                    job.status === 'nová' ? 'primary' : 
                    job.status === 'čeká na díly' || job.status === 'ceka_na_dily' ? 'warning' : 
                    'secondary'
                }>
                    {job.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                 <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(job.created_at).toLocaleDateString('cs-CZ')}
                 </div>
                 {/* Zde by mohl být třeba počet strojů v zakázce */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveJobList;