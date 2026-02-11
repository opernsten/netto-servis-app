import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const CustomerJobList = ({ jobs }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
        {(!jobs || jobs.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 text-slate-400">
                    <Layers size={24} />
                </div>
                <p className="text-slate-500 font-medium">Žádná historie zakázek.</p>
            </div>
        ) : (
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                        <th className="px-8 py-4 font-bold">Zakázka</th>
                        <th className="px-6 py-4 font-bold">Datum</th>
                        <th className="px-6 py-4 font-bold">Stav</th>
                        <th className="px-6 py-4 font-bold">Popis</th>
                        <th className="px-8 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {jobs.map(job => (
                        <tr key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="hover:bg-purple-50 cursor-pointer transition-all duration-200 group">
                            <td className="px-8 py-5">
                                    <span className="font-mono font-bold text-slate-700 group-hover:text-purple-700 transition-colors text-base border-l-4 pl-3 border-transparent group-hover:border-purple-400">
                                    {job.job_number}
                                    </span>
                            </td>
                            <td className="px-6 py-5 text-slate-500 font-medium">{formatDate(job.scheduled_date)}</td>
                            <td className="px-6 py-5">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border ${
                                    job.status === 'hotovo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    job.status === 'nova' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                    'bg-amber-50 text-amber-600 border-amber-200'
                                }`}
                                >
                                    {job.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-slate-500 truncate max-w-[250px]">{job.description}</td>
                            <td className="px-8 py-5 text-right">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 group-hover:border-purple-300 group-hover:text-purple-600 transition-all shadow-sm ml-auto">
                                    <ChevronRight size={16} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  );
};

export default CustomerJobList;
