import React from 'react';
import { updateJob } from '../../services/jobService'; 
import { JOB_STATUS_OPTIONS, JOB_STATUS_COLORS } from '../../constants/appConstants';
import { Lock } from 'lucide-react'; // Přidej import zámku, pokud máš lucide-react

const JobStatus = ({ job, onStatusChange }) => {
  
  const isFinished = job.status === 'hotovo';

  // Barvičky
  const getSelectColor = (status) => {
     if (isFinished) return 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed opacity-80';

     const colorMap = {
        'blue': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        'warning': 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        'purple': 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        'success': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        'default': 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
     };
     const colorKey = JOB_STATUS_COLORS[status] || 'default';
     return colorMap[colorKey];
  };

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    try {
      // Optimisticky pošleme změnu nahoru hned
      if (onStatusChange) onStatusChange(newStatus);
      
      // Uložíme do DB
      await updateJob(job.id, { status: newStatus });
      
    } catch (error) {
      console.error("Chyba změny stavu:", error);
      alert("Nepodařilo se změnit stav.");
    }
  };

  return (
    <div className="relative inline-block min-w-[180px]">
        <select
          value={job.status}
          onChange={handleChange}
          disabled={isFinished} // Zablokováno jen pokud je hotovo
          className={`
            w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold border shadow-sm outline-none transition-all
            focus:ring-2 focus:ring-offset-1 focus:ring-slate-300
            ${getSelectColor(job.status)}
            ${!isFinished ? 'cursor-pointer' : ''}
          `}
        >
          {JOB_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-800 py-1">
              {opt.label}
            </option>
          ))}
        </select>

        {/* IKONA VPRAVO */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            {isFinished ? (
                <Lock size={14} /> // Zámek, pokud je hotovo
            ) : (
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" className="opacity-60">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    </div>
  );
};

export default JobStatus;