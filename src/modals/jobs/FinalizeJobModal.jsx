import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { updateJob } from '../../services/jobService';
import { Clock, Car, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { calculateDuration } from '../../utils/dateUtils';

const FinalizeJobModal = ({ isOpen, onClose, onSuccess, job }) => {
  const [loading, setLoading] = useState(false);
  
  // Formulář pro finální data
  const [formData, setFormData] = useState({
    work_start_time: '',
    work_end_time: '',
    travel_start_time: '',
    travel_end_time: '',
    vehicle: '',
    final_note: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Příprava dat k odeslání
      const updates = {
        ...formData,
        status: 'hotovo',                    // Změníme stav na HOTOVO
        completed_at: new Date().toISOString() // Uložíme čas uzavření
      };

      await updateJob(job.id, updates);
      
      onSuccess(); // Obnoví data na pozadí
      onClose();   // Zavře okno
    } catch (err) {
      console.error(err);
      alert('Chyba při uzavírání zakázky.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dokončení a uzavření zakázky" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Upozornění */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3 items-start">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800">
                <p className="font-bold">Chystáte se uzavřít zakázku.</p>
                <p>Po uložení již nebude možné editovat reporty strojů. Zkontrolujte prosím, zda jsou všechny údaje správné.</p>
            </div>
        </div>

        {/* 1. SEKCE: ČAS PRÁCE */}
        <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock size={18} className="text-blue-600"/> Čas strávený prací (u zákazníka)
            </h3>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Celkem: {calculateDuration(formData.work_start_time, formData.work_end_time) || '0 hod 0 min'}
            </span>
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Začátek práce *</label>
                    <input 
                        type="time" 
                        name="work_start_time"
                        required
                        value={formData.work_start_time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Konec práce *</label>
                    <input 
                        type="time" 
                        name="work_end_time"
                        required
                        value={formData.work_end_time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                </div>
            </div>
        </div>

        {/* 2. SEKCE: CESTOVÁNÍ */}
        <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Car size={18} className="text-green-600"/> Cestování a Doprava
            </h3>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
              Celkem: {calculateDuration(formData.travel_start_time, formData.travel_end_time) || '0 hod 0 min'}
            </span>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Odjezd (Start cesty) *</label>
                        <input 
                            type="time" 
                            name="travel_start_time"
                            required
                            value={formData.travel_start_time}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Příjezd (Konec cesty) *</label>
                        <input 
                            type="time" 
                            name="travel_end_time"
                            required
                            value={formData.travel_end_time}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Použité vozidlo (SPZ / Název) *</label>
                    <input 
                        type="text" 
                        name="vehicle"
                        required
                        placeholder="např. 3Z5 1234 (Octavia)"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
            </div>
        </div>

        {/* 3. SEKCE: ZÁVĚREČNÁ ZPRÁVA */}
        <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText size={18} className="text-slate-600"/> Závěrečné shrnutí zakázky
            </h3>
            <textarea 
                name="final_note"
                required
                rows="4"
                placeholder="Celkové zhodnocení výjezdu, doporučení pro příště, poznámky pro fakturaci..."
                value={formData.final_note}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
        </div>

        {/* TLAČÍTKA */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            Zrušit
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200 flex items-center gap-2"
          >
            {loading ? 'Ukládám...' : <><CheckCircle size={20}/> Dokončit zakázku</>}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default FinalizeJobModal;