import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams slouží k získání ID z adresy
import { getJobById } from '../../services/jobService';
import { formatDate } from '../../utils/dateUtils';
import { ArrowLeft, Building2, Calendar, Wrench, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams(); // Získáme ID z URL
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadJob();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Načítám detail zakázky...</div>;
  if (!job) return <div className="p-8 text-center text-red-500">Zakázka nenalezena.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Tlačítko Zpět */}
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={20} />
        Zpět na seznam
      </button>

      {/* HLAVIČKA ZAKÁZKY */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-lg font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">
                {job.job_number}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${job.status === 'nova' ? 'bg-blue-100 text-blue-800' : ''}
                ${job.status === 'hotovo' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {job.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          </div>
          
          <div className="text-right">
             <div className="text-sm text-slate-500 mb-1">Termín výjezdu</div>
             <div className="flex items-center gap-2 font-medium text-slate-800 justify-end">
                <Calendar size={18} className="text-blue-600"/>
                {formatDate(job.scheduled_date)}
             </div>
          </div>
        </div>

        <hr className="border-slate-100 my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ZÁKAZNÍK */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Zákazník</h3>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
                <Building2 size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-800">{job.customers.name}</p>
                <p className="text-slate-600">{job.customers.address}</p>
                <div className="mt-2 text-sm text-slate-500 space-y-1">
                   {job.customers.email && <p>Email: {job.customers.email}</p>}
                   {job.customers.phone && <p>Tel: {job.customers.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* POPIS ZÁVADY */}
          <div>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Popis závady</h3>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 leading-relaxed min-h-[100px]">
                {job.description || 'Bez popisu.'}
             </div>
          </div>
        </div>
      </div>

      {/* SEZNAM PŘIŘAZENÝCH STROJŮ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Wrench size={18} />
            Servisované stroje
          </h3>
          <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">
            {job.machines?.length || 0}
          </span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {job.machines && job.machines.length > 0 ? (
            job.machines.map(machine => (
              <div key={machine.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded text-slate-500">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{machine.name}</p>
                    <p className="text-sm text-slate-500 font-mono">S/N: {machine.serial_number || '-'}</p>
                  </div>
                </div>
                <div className="text-sm">
                   <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                     {machine.type}
                   </span>
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center text-slate-400 italic">
               K této zakázce nejsou přiřazeny žádné stroje.
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default JobDetail;