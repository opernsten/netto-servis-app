import React from 'react';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/dateUtils';
import { Building2, User, Wrench, Clock, Car, FileText, Package } from 'lucide-react';

const JobReportPreviewModal = ({ isOpen, onClose, job }) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Náhled servisního reportu" maxWidth="max-w-5xl">
      <div className="bg-white p-4 space-y-8 text-slate-800">
        
        {/* 1. HLAVIČKA */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Servisní Protokol</h1>
            <p className="text-slate-500 mt-1">Číslo zakázky: <span className="font-mono font-bold text-slate-900">{job.job_number}</span></p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Datum dokončení</div>
            <div className="font-bold text-lg">{formatDate(job.completed_at || job.created_at)}</div>
          </div>
        </div>

        {/* 2. INFO O ZÁKAZNÍKOVI A TÝMU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zákazník */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 size={14}/> Zákazník
            </h3>
            <p className="font-bold text-lg">{job.customers?.name}</p>
            <p className="text-slate-600">{job.customers?.address}</p>
          </div>

          {/* Tým */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={14}/> Realizační tým
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Technici</p>
                <p className="font-medium">{job.technician_names || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Kouč</p>
                <p className="font-medium">{job.coach || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. STROJE A PRÁCE (Tohle je to hlavní) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Wrench size={18} className="text-blue-600"/> Provedený servis
          </h3>
          
          <div className="space-y-6">
            {job.machines?.map((machine, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Hlavička stroje */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{machine.name}</span>
                  <span className="text-sm text-slate-500 font-mono">S/N: {machine.serial_number}</span>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Popis práce */}
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Popis závady a opravy</p>
                    <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {machine.report || 'Bez popisu.'}
                    </p>
                  </div>

                  {/* Použité díly */}
                  <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                     <p className="text-xs font-bold text-yellow-700 uppercase mb-2 flex items-center gap-1">
                        <Package size={12}/> Spotřebovaný materiál
                     </p>
                     {machine.parts && machine.parts.length > 0 ? (
                       <ul className="text-xs space-y-1">
                         {machine.parts.map((part, i) => (
                           <li key={i} className="flex justify-between border-b border-yellow-200/50 last:border-0 pb-1 last:pb-0">
                             <span>{part.description} <span className="text-slate-400">({part.article_number})</span></span>
                             <span className="font-bold">{part.quantity} ks</span>
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <p className="text-xs text-slate-400 italic">Bez materiálu</p>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. BILANCE A SHRNUTÍ (Data z Finalize modálu) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t-2 border-slate-100">
           
           {/* Časy */}
           <div className="md:col-span-1 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock size={14}/> Výkaz času
                </h3>
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="py-1 text-slate-500">Práce na místě:</td>
                            <td className="py-1 font-mono font-bold text-right">{job.work_start_time} - {job.work_end_time}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-slate-500">Cestování:</td>
                            <td className="py-1 font-mono font-bold text-right">{job.travel_start_time} - {job.travel_end_time}</td>
                        </tr>
                    </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Car size={14}/> Doprava
                </h3>
                <p className="text-sm font-medium">{job.vehicle || 'Neuvedeno'}</p>
              </div>
           </div>

           {/* Závěrečná zpráva */}
           <div className="md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <FileText size={14}/> Závěrečné shrnutí zakázky
              </h3>
              <p className="text-slate-800 text-sm italic">
                {job.final_note || 'Bez závěrečné poznámky.'}
              </p>
           </div>
        </div>

        {/* Tlačítko Zavřít */}
        <div className="flex justify-end pt-6">
            <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Zavřít náhled
            </button>
        </div>

      </div>
    </Modal>
  );
};

export default JobReportPreviewModal;