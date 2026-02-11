import React, { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import { getUsedParts } from '../../services/machineService';
import { formatDate } from '../../utils/dateUtils';
import { Box, Wrench, User, Calendar } from 'lucide-react';

const HistoryDetailModal = ({ isOpen, onClose, entry }) => {
  const [parts, setParts] = useState([]);
  const [loadingParts, setLoadingParts] = useState(false);

  useEffect(() => {
    if (isOpen && entry) {
      loadParts();
    }
  }, [isOpen, entry]);

  const loadParts = async () => {
    setLoadingParts(true);
    const data = await getUsedParts(entry.id); // entry.id je ID z tabulky job_machines
    setParts(data || []);
    setLoadingParts(false);
  };

  if (!entry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail servisního zásahu" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* HLAVIČKA */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
            <div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={12}/> Datum výjezdu</div>
                <div className="font-bold text-slate-800">{formatDate(entry.jobs.scheduled_date)}</div>
            </div>
            <div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Wrench size={12}/> Zakázka</div>
                <div className="font-mono font-bold text-blue-600">{entry.jobs?.job_number}</div>
            </div>
            <div className="col-span-2">
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-1"><User size={12}/> Technik</div>
                <div className="font-medium text-slate-800">{entry.jobs?.technician_names || 'Neuveden'}</div>
            </div>
        </div>

        {/* REPORT */}
        <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Provedená práce</h4>
            <div className="bg-white border border-slate-200 p-4 rounded-lg text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {entry.report || 'Bez slovního popisu.'}
            </div>
        </div>

        {/* MATERIÁL */}
        <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Box size={16} className="text-orange-500"/> Použitý materiál
            </h4>
            
            {loadingParts ? (
                <div className="text-sm text-slate-400">Načítám díly...</div>
            ) : parts.length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-4 py-2">Artikl</th>
                                <th className="px-4 py-2">Popis</th>
                                <th className="px-4 py-2 text-right">Ks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {parts.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 font-mono text-xs text-slate-600">{p.article_number}</td>
                                    <td className="px-4 py-2 text-slate-800">{p.description}</td>
                                    <td className="px-4 py-2 text-right font-bold">{p.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded border border-dashed border-slate-200">
                    Nebyly vykázány žádné náhradní díly.
                </div>
            )}
        </div>

        <div className="flex justify-end pt-4">
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium">
                Zavřít detail
            </button>
        </div>

      </div>
    </Modal>
  );
};

export default HistoryDetailModal;