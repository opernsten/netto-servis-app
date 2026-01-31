import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Pokud používáš PropTypes
import Modal from '../../components/ui/Modal';
import { updateMachineReport } from '../../services/jobService'; // <--- Tady voláme tvůj jobService
import { Plus, Trash2, Box } from 'lucide-react';

const MachineReportModal = ({ isOpen, onClose, onSuccess, jobMachineId, machineName, initialReport = '' }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(initialReport || '');
  
  // Seznam náhradních dílů
  const [parts, setParts] = useState([]);

  // Přidání řádku pro díl
  const addPart = () => {
    setParts([...parts, { article_number: '', description: '', quantity: 1 }]);
  };

  // Smazání dílu
  const removePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  // Psaní do políček dílů
  const handlePartChange = (index, field, value) => {
    const newParts = [...parts];
    newParts[index][field] = value;
    setParts(newParts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Posíláme ID, text reportu A TAKÉ seznam dílů
      await updateMachineReport(jobMachineId, report, parts);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Chyba při ukládání reportu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report: ${machineName || 'Stroj'}`} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. TEXTOVÝ POPIS */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Popis provedené práce *</label>
          <textarea
            required
            rows="5"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Popište závadu a způsob opravy..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
          ></textarea>
        </div>

        <hr className="border-slate-100" />

        {/* 2. NÁHRADNÍ DÍLY (Volitelné) */}
        <div>
           <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <Box size={18} className="text-orange-500"/>
                Spotřebovaný materiál (Volitelné)
              </label>
              <button 
                type="button" 
                onClick={addPart}
                className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors"
              >
                <Plus size={14} /> Přidat díl
              </button>
           </div>

           {parts.length === 0 ? (
             <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm italic">
               Nebyly použity žádné náhradní díly.
             </div>
           ) : (
             <div className="space-y-2">
               {parts.map((part, index) => (
                 <div key={index} className="flex gap-2 items-start">
                    <input 
                      placeholder="Artikl (Kód)"
                      className="w-1/4 px-3 py-2 border rounded-lg text-sm"
                      value={part.article_number}
                      onChange={(e) => handlePartChange(index, 'article_number', e.target.value)}
                    />
                    <input 
                      placeholder="Popis dílu"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      value={part.description}
                      onChange={(e) => handlePartChange(index, 'description', e.target.value)}
                    />
                    <input 
                      type="number"
                      min="1"
                      placeholder="Ks"
                      className="w-20 px-3 py-2 border rounded-lg text-sm text-center"
                      value={part.quantity}
                      onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => removePart(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* TLAČÍTKA */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Zrušit</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm">
            {loading ? 'Ukládám...' : 'Dokončit a Uložit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

MachineReportModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  jobMachineId: PropTypes.string,
  machineName: PropTypes.string,
  initialReport: PropTypes.string
};

export default MachineReportModal;