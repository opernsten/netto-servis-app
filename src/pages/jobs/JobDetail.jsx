import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../../services/jobService';
import MachineReportModal from '../../modals/jobs/MachineReportModal';
import FinalizeJobModal from '../../modals/jobs/FinalizeJobModal';
import { ArrowLeft, CheckCircle2, Eye, FileDown } from 'lucide-react';
import { generateServicePDF } from '../../utils/pdfGenerator';
import JobReportPreviewModal from '../../modals/jobs/JobReportPreviewModal';  
import Button from '../../components/ui/Button';

// Features
import JobDetailHeader from '../../features/jobs/JobDetailHeader';
import JobMachineList from '../../features/jobs/JobMachineList';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modály
  const [selectedMachine, setSelectedMachine] = useState(null); // Který stroj edituji
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

        {/* Tlačítka pro HOTOVÉ zakázky */}
        {job.status === 'hotovo' && (
          <div className="flex gap-2">
            
            {/* NOVÉ TLAČÍTKO: Náhled */}
            <Button variant="secondary" onClick={() => setIsPreviewOpen(true)}>
                <Eye size={18} />
                Náhled
            </Button>

            <Button variant="primary" onClick={() => generateServicePDF(job)}>
                <FileDown size={18} />
                Stáhnout protokol
            </Button>
          </div>
        )}
    </div>

      {/* HLAVIČKA */}
      <JobDetailHeader job={job} />

      {/* SEZNAM STROJŮ A JEJICH REPORTY */}
      <JobMachineList
        machines={job.machines}
        status={job.status}
        onEditMachine={setSelectedMachine}
      />

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
          jobMachineId={selectedMachine.link_id}    
          initialReport={selectedMachine.report}
        />
      )}

      <FinalizeJobModal 
        isOpen={isFinalizeOpen}
        onClose={() => setIsFinalizeOpen(false)}
        onSuccess={loadJob}
        job={job}
      />

      <JobReportPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        job={job}
      />

    </div>
  );
};

export default JobDetail;
