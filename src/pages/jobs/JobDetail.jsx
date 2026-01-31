import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../../services/jobService';
import { formatDate } from '../../utils/dateUtils';
import MachineReportModal from '../../modals/jobs/MachineReportModal'; // <--- Modál pro stroj
import FinalizeJobModal from '../../modals/jobs/FinalizeJobModal';     // <--- Modál pro finále
import { ArrowLeft, Building2, Calendar, Wrench, CheckCircle2, Clock, Car, Edit3 } from 'lucide-react';
import { generateServicePDF } from '../../utils/pdfGenerator';
import { FileDown } from 'lucide-react'; // Ikona stahování
import { Award, UserCheck } from 'lucide-react'; // Award (Smlouva), UserCheck (Kouč)

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modály
  const [selectedMachine, setSelectedMachine] = useState(null); // Který stroj edituji
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);

  const loadJob = async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  // Pomocná funkce: Jsou všechny stroje hotové?
  const allMachinesDone = job?.machines?.every(m => m.is_done) && job?.machines?.length > 0;

  if (loading) return <div className="p-8 text-center text-slate-500">Načítám...</div>;
  if (!job) return <div className="p-8 text-center text-red-500">Nenalezeno.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      <div className="flex justify-between items-center">
        <button 
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
            <ArrowLeft size={20} />
            Zpět na seznam
        </button>

        {/* Tlačítko pro PDF - Zobrazí se jen pokud je HOTOVO */}
        {job.status === 'hotovo' && (
            <button
                onClick={() => generateServicePDF(job)}
                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
                <FileDown size={18} />
                Stáhnout protokol
            </button>
        )}
    </div>

      {/* HLAVIČKA */}
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

      {/* SEZNAM STROJŮ A JEJICH REPORTY */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wrench size={18} /> Servisované stroje</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {job.machines && job.machines.map(machine => (
            <div key={machine.link_id} className={`p-4 transition-colors ${machine.is_done ? 'bg-green-50/30' : 'hover:bg-slate-50'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* INFO O STROJI */}
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded ${machine.is_done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    {machine.is_done ? <CheckCircle2 size={24} /> : <Wrench size={24} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{machine.name}</p>
                    <p className="text-sm text-slate-500 font-mono">S/N: {machine.serial_number}</p>
                    {/* ZOBRAZENÍ REPORTU POKUD JE HOTOVO */}
                    {machine.is_done && (
                      <div className="mt-2 text-sm text-slate-700 bg-white p-2 rounded border border-green-100 shadow-sm">
                        <p className="font-medium text-green-800 text-xs uppercase mb-1">Provedená práce:</p>
                        {machine.report}
                        <div className="mt-1 text-slate-500 text-xs font-bold flex items-center gap-1">
                          <Clock size={12}/> {machine.machine_work_hours} hod
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* TLAČÍTKO AKCE */}
                {job.status !== 'hotovo' && (
                  <button 
                    onClick={() => setSelectedMachine(machine)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-colors
                      ${machine.is_done 
                        ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                        : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}
                    `}
                  >
                    {machine.is_done ? <><Edit3 size={16}/> Upravit</> : 'Vyplnit report'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINÁLNÍ LIŠTA - Zobrazí se jen když jsou všechny stroje hotové */}
      {job.status !== 'hotovo' && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-slate-200 flex justify-between items-center shadow-lg z-10 px-8">
          <div className="text-sm text-slate-500">
            {allMachinesDone 
              ? <span className="text-green-600 font-bold flex items-center gap-2"><CheckCircle2 size={18}/> Všechny stroje mají report.</span>
              : <span>Pro uzavření zakázky vyplňte report u všech strojů.</span>
            }
          </div>
          
          <button 
            onClick={() => setIsFinalizeOpen(true)}
            disabled={!allMachinesDone}
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2
              ${allMachinesDone 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
            `}
          >
            <CheckCircle2 size={20} />
            Dokončit zakázku
          </button>
        </div>
      )}

      {/* ZOBRAZENÍ VÝSLEDKU POKUD JE UŽ HOTOVO */}
      {job.status === 'hotovo' && (
        <div className="bg-slate-100 p-4 rounded-xl text-center text-slate-500 text-sm border border-slate-200">
          Zakázka byla uzavřena dne: <b>{new Date(job.completed_at).toLocaleString('cs-CZ')}</b>
        </div>
      )}

      {/* MODÁLY */}
      {selectedMachine && (
        <MachineReportModal 
          isOpen={!!selectedMachine}
          onClose={() => setSelectedMachine(null)}
          onSuccess={loadJob}
          machineName={selectedMachine.name}
          linkId={selectedMachine.link_id}
          existingData={selectedMachine}
        />
      )}

      <FinalizeJobModal 
        isOpen={isFinalizeOpen}
        onClose={() => setIsFinalizeOpen(false)}
        onSuccess={loadJob}
        job={job}
      />

    </div>
  );
};

export default JobDetail;