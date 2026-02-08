import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { updateMachine } from '../../services/machineService';
import { MACHINE_TYPES, MACHINE_STATUS_OPTIONS } from '../../constants/appConstants';

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
    initial_verification: '',
    supplier: '',
    manufacturing_year: ''
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
        initial_verification: machine.initial_verification || '',
        supplier: machine.supplier || '',
        manufacturing_year: machine.manufacturing_year || ''
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
      // --- OPRAVA ZDE ---
      // Vytvoříme kopii dat a "vyčistíme" prázdné stringy na null
      const cleanedData = {
        ...formData,
        initial_verification: formData.initial_verification === '' ? null : formData.initial_verification,
        last_verified: formData.last_verified === '' ? null : formData.last_verified,
        manufacturing_year: formData.manufacturing_year === '' ? null : formData.manufacturing_year
      };
      
      // Posíláme cleanedData místo formData
      await updateMachine(machine.id, cleanedData);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Chyba při úpravě stroje:', error);
      alert('Chyba při ukládání: ' + error.message);
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
                <label className="block text-sm font-medium text-slate-700">Typ stroje</label>
                <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    className="w-full mt-1 px-3 py-2 border rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                    {MACHINE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Dodavatel stroje</label>
                <input 
                  name="supplier" 
                  value={formData.supplier} 
                  onChange={handleChange} 
                  placeholder="Např. Netto Electonics"
                  className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Aktuální stav</label>
                <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    className="w-full mt-1 px-3 py-2 border rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                    {MACHINE_STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* NOVĚ PŘIDANÉ POLÍČKO */}
            <div>
                <label className="block text-sm font-medium text-slate-700">Rok výroby</label>
                <input 
                  name="manufacturing_year" 
                  value={formData.manufacturing_year} 
                  onChange={handleChange} 
                  placeholder="Např. 2022"
                  className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                />
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