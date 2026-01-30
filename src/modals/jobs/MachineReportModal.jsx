import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { updateMachineReport } from '../../services/jobService';

const MachineReportModal = ({ isOpen, onClose, onSuccess, machineName, linkId, existingData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    report: '',
    work_hours: ''
  });

  // Pokud už data existují (editace), načti je
  useEffect(() => {
    if (isOpen && existingData) {
      setFormData({
        report: existingData.report || '',
        work_hours: existingData.machine_work_hours || ''
      });
    }
  }, [isOpen, existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMachineReport(linkId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Servis stroje: ${machineName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Popis provedené práce na stroji *</label>
          <textarea
            required
            rows="4"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.report}
            onChange={(e) => setFormData({...formData, report: e.target.value})}
            placeholder="Vyčištěno, seřízeno..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Čas práce (hod) *</label>
          <input
            type="number"
            step="0.5"
            required
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.work_hours}
            onChange={(e) => setFormData({...formData, work_hours: e.target.value})}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Zrušit</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {loading ? 'Ukládám...' : 'Uložit stroj'}
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
  machineName: PropTypes.string,
  linkId: PropTypes.string,
  existingData: PropTypes.object
};

export default MachineReportModal;