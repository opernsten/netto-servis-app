import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { updateJob } from '../../services/jobService';
import { CheckCircle2 } from 'lucide-react';

const FinalizeJobModal = ({ isOpen, onClose, onSuccess, job }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    travel_hours: '',
    work_description: '' // Celkový komentář k výjezdu
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateJob(job.id, {
        travel_hours: formData.travel_hours,
        work_description: formData.work_description,
        status: 'hotovo',
        completed_at: new Date()
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Uzavření celé zakázky">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg flex gap-3 text-green-800 text-sm">
          <CheckCircle2 size={20} />
          <p>Všechny stroje jsou hotové. Zadejte cestu a zakázku uzavřete.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Cestovní čas (hod) *</label>
          <input
            type="number"
            step="0.5"
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.travel_hours}
            onChange={(e) => setFormData({...formData, travel_hours: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Celkový závěr / Poznámka (volitelné)</label>
          <textarea
            rows="3"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.work_description}
            onChange={(e) => setFormData({...formData, work_description: e.target.value})}
            placeholder="Např. Předáno zákazníkovi, vše v pořádku."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Zrušit</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">
            {loading ? 'Uzavírám...' : 'DOKONČIT VŠE'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

FinalizeJobModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  job: PropTypes.object
};

export default FinalizeJobModal;