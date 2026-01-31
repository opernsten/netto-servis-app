import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { updateMachine } from '../../services/machineService';

const EditMachineModal = ({ isOpen, onClose, onSuccess, machine }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    type: 'TQS',
    status: 'ok',
    location: '',
    sw_version: '',
    last_verified: '',
    initial_verification: '' // <--- NOVÉ POLE
  });

  useEffect(() => {
    if (machine) {
      setFormData({
        name: machine.name || '',
        serial_number: machine.serial_number || '',
        type: machine.type || 'TQS',
        status: machine.status || 'ok',
        location: machine.location || '',
        sw_version: machine.sw_version || '',
        last_verified: machine.last_verified || '',
        initial_verification: machine.initial_verification || '' // <--- Načtení hodnoty
      });
    }
  }, [machine, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMachine(machine.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Chyba při ukládání.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upravit stroj">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ZÁKLADNÍ INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Název stroje</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">S/N</label>
            <input name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Typ</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="TQS">TQS</option>
                    <option value="CW">CW</option>
                    <option value="X-RAY">X-RAY</option>
                    <option value="HC-A">HC-A</option>
                    <option value="Jiné">Jiné</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="ok">🟢 V pořádku</option>
                    <option value="porucha">🔴 Porucha / Servis</option>
                    <option value="odstaveno">⚪ Odstaveno</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Umístění / Linka</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Hala B" className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Verze Software</label>
            <input name="sw_version" value={formData.sw_version} onChange={handleChange} placeholder="v1.0" className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <hr className="border-slate-100 my-2" />
        
        {/* DATA */}
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Důležitá data</h4>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Prvotní ověření</label>
                <input type="date" name="initial_verification" value={formData.initial_verification} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Poslední ověření</label>
                <input type="date" name="last_verified" value={formData.last_verified} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Zrušit</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložit změny</button>
        </div>
      </form>
    </Modal>
  );
};

EditMachineModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  machine: PropTypes.object
};

export default EditMachineModal;