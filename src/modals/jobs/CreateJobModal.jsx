import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { createJob } from '../../services/jobService';
import { getCustomers } from '../../services/customerService';
import { getMachinesByCustomer } from '../../services/machineService'; // <--- Načítání strojů
import { Search, ChevronDown, Check, Wrench } from 'lucide-react';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data
  const [customers, setCustomers] = useState([]);
  const [customerMachines, setCustomerMachines] = useState([]); // Stroje vybraného zákazníka
  
  // Stav vyhledávání zákazníka
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Formulář
  const [formData, setFormData] = useState({
    job_number: '',
    title: '',
    description: '',
    status: 'nova',
    priority: 'stredni',
    scheduled_date: new Date().toISOString().split('T')[0], // Dnešní datum (YYYY-MM-DD)
    customer_id: ''
  });

  // Vybrané stroje (pole IDček)
  const [selectedMachineIds, setSelectedMachineIds] = useState([]);

  // 1. Načtení zákazníků při startu
  useEffect(() => {
    if (isOpen) {
      const loadCustomers = async () => {
        try {
          const data = await getCustomers();
          setCustomers(data);
          // Reset
          setSearchTerm('');
          setFormData({
            job_number: '',
            title: '',
            description: '',
            status: 'nova',
            priority: 'stredni',
            scheduled_date: new Date().toISOString().split('T')[0],
            customer_id: ''
          });
          setCustomerMachines([]);
          setSelectedMachineIds([]);
        } catch (err) {
          console.error(err);
        }
      };
      loadCustomers();
    }
  }, [isOpen]);

  // 2. Když vyberu zákazníka -> Načti jeho stroje
  const handleSelectCustomer = async (customer) => {
    setFormData(prev => ({ ...prev, customer_id: customer.id }));
    setSearchTerm(customer.name);
    setShowDropdown(false);

    // Načíst stroje
    try {
      const machines = await getMachinesByCustomer(customer.id);
      setCustomerMachines(machines);
      setSelectedMachineIds([]); // Vyčistit předchozí výběr
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Přepínání checkboxu stroje
  const toggleMachine = (machineId) => {
    setSelectedMachineIds(prev => {
      if (prev.includes(machineId)) {
        return prev.filter(id => id !== machineId); // Odebrat
      } else {
        return [...prev, machineId]; // Přidat
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.customer_id) {
      setError('Vyberte zákazníka.');
      setLoading(false);
      return;
    }

    try {
      // Voláme service: posíláme data zakázky + pole IDček strojů
      await createJob(formData, selectedMachineIds);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.code === '23505') { // Kód chyby pro duplicitu
        setError('Toto číslo zakázky už existuje!');
      } else {
        setError('Chyba při ukládání zakázky.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nová servisní zakázka">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          {/* ČÍSLO ZAKÁZKY (RUČNĚ) */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Číslo zakázky *</label>
            <input
              type="text"
              name="job_number"
              required
              value={formData.job_number}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              placeholder="ZE26-xxxx"
            />
          </div>
          
          {/* DATUM */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Termín</label>
            <input
              type="date"
              name="scheduled_date"
              required
              value={formData.scheduled_date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* VÝBĚR ZÁKAZNÍKA (AUTOCOMPLETE) */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Zákazník *</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Vyhledat firmu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setFormData(p => ({...p, customer_id: ''}));
                setCustomerMachines([]); // Vyčistit stroje při změně textu
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {filteredCustomers.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCustomer(c)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 flex justify-between"
                >
                  <span className="font-medium">{c.name}</span>
                  {formData.customer_id === c.id && <Check size={16} className="text-blue-600"/>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VÝBĚR STROJŮ (CHECKBOXY) - Zobrazí se až po výběru zákazníka */}
        {customerMachines.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Vyberte stroje k opravě:</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {customerMachines.map(machine => (
                <label key={machine.id} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-blue-400">
                  <input
                    type="checkbox"
                    checked={selectedMachineIds.includes(machine.id)}
                    onChange={() => toggleMachine(machine.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Wrench size={14} className="text-slate-400"/>
                      {machine.name}
                    </div>
                    <div className="text-xs text-slate-500">S/N: {machine.serial_number}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* PŘEDMĚT */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Předmět / Závada *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Např. Výměna ložiska"
          />
        </div>

        {/* PRIORITA */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Priorita</label>
          <div className="flex gap-4 mt-1">
            {['nizka', 'stredni', 'vysoka', 'havarie'].map(p => (
              <label key={p} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={formData.priority === p}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* POPIS */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Podrobný popis</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            Zrušit
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Ukládám...' : 'Vytvořit zakázku'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

CreateJobModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default CreateJobModal;