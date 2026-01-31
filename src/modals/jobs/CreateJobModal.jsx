import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { createJob } from '../../services/jobService';
import { getCustomers } from '../../services/customerService';
import { getMachinesByCustomer } from '../../services/machineService'; 
import { Wrench, User, Calendar, FileText, Briefcase } from 'lucide-react';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  
  // Stavy pro stroje
  const [customerMachines, setCustomerMachines] = useState([]);
  const [selectedMachineIds, setSelectedMachineIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const SERVICE_TYPES = [
    "Pozáruční servis",
    "Záruční servis",
    "Oprava poruchy",
    "Instalace",
    "MID (Ověření)",
    "Údržba / Preventivní prohlídka"
  ];

  const [formData, setFormData] = useState({
    job_number: '',
    title: 'Pozáruční servis',
    customer_id: '',
    technician_names: '',
    coach: '',
    has_service_contract: false,
    scheduled_date: new Date().toISOString().split('T')[0],
    description: '',
    priority: 'stredni'
  });

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      setCustomerMachines([]);
      setSelectedMachineIds([]);
      setSearchTerm('');
      setFormData(prev => ({ 
        ...prev, 
        customer_id: '',
        technician_names: '',
        coach: '',
        description: ''
      }));
    }
  }, [isOpen]);

  // Načtení strojů při změně zákazníka
  useEffect(() => {
    if (formData.customer_id) {
      loadMachines(formData.customer_id);
    } else {
      setCustomerMachines([]);
    }
    setSelectedMachineIds([]);
  }, [formData.customer_id]);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const loadMachines = async (customerId) => {
    // Použijeme službu místo přímého volání supabase
    const data = await getMachinesByCustomer(customerId);
    setCustomerMachines(data || []);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const toggleMachine = (machineId) => {
    setSelectedMachineIds(prev => 
      prev.includes(machineId)
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createJob(formData, selectedMachineIds);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Chyba při vytváření zakázky.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Zde se snažíme modálu vnutit větší šířku (pokud to komponenta Modal podporuje přes className)
    // Pokud je modál stále úzký, bude potřeba upravit Modal.jsx
    <Modal isOpen={isOpen} onClose={onClose} title="Nová servisní zakázka" maxWidth="max-w-6xl">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        
        {/* HLAVNÍ GRID - 2 SLOUPCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEVÝ SLOUPEC: INFORMACE --- */}
            <div className="space-y-4">
                
                {/* Číslo zakázky */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Číslo zakázky *</label>
                  <input
                    type="text"
                    name="job_number"
                    required
                    value={formData.job_number}
                    onChange={handleChange}
                    placeholder="ZE(YY)-XXXX"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-slate-700"
                  />
                </div>

                {/* 1. Typ a Zákazník */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Typ servisu *</label>
                  <select
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Zákazník *</label>
                  {/* NAŠEPTÁVAČ ZÁKAZNÍKA */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Začněte psát jméno firmy..."
                      value={searchTerm}
                      onClick={() => setIsSearchOpen(true)}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsSearchOpen(true);
                        // Když píše, vymažeme vybrané ID (aby musel vybrat ze seznamu)
                        setFormData(prev => ({ ...prev, customer_id: '' }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                        formData.customer_id ? 'border-green-500 bg-green-50 text-green-800 font-bold' : ''
                      }`}
                    />
                    
                    {/* Rozbalovací seznam výsledků */}
                    {isSearchOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {customers
                          .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                // 1. Uložíme ID zákazníka
                                setFormData(prev => ({ ...prev, customer_id: c.id }));
                                // 2. Do textového pole dáme jméno
                                setSearchTerm(c.name);
                                // 3. Zavřeme nabídku
                                setIsSearchOpen(false);
                              }}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
                            >
                              <div className="font-bold text-slate-800">{c.name}</div>
                              <div className="text-xs text-slate-500">{c.address}</div>
                            </div>
                          ))}
                          
                        {/* Pokud nic nenajde */}
                        {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <div className="p-3 text-sm text-slate-400 text-center italic">
                                Žádný zákazník nenalezen.
                            </div>
                        )}
                      </div>
                    )}
                 </div> 
                 
                  {/* Checkbox Smlouva */}
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <input
                        type="checkbox"
                        id="has_service_contract"
                        name="has_service_contract"
                        checked={formData.has_service_contract}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="has_service_contract" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        Zákazník má aktivní servisní smlouvu
                    </label>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* 2. Lidé (Technici a Kouč) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Technici</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                name="technician_names"
                                value={formData.technician_names}
                                onChange={handleChange}
                                placeholder="Novák, Svoboda"
                                className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kouč zakázky</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                name="coach"
                                value={formData.coach}
                                onChange={handleChange}
                                placeholder="Jméno kouče"
                                className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Termín a Priorita */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Termín výjezdu</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                        type="date"
                        name="scheduled_date"
                        required
                        value={formData.scheduled_date}
                        onChange={handleChange}
                        className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priorita</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium ${
                          formData.priority === 'havarie' ? 'text-red-600 border-red-200 bg-red-50' : ''
                      }`}
                    >
                      <option value="nizka">Nízká</option>
                      <option value="stredni">Střední</option>
                      <option value="vysoka">Vysoká</option>
                      <option value="havarie">HAVÁRIE</option>
                    </select>
                  </div>
                </div>

                {/* 4. Popis */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Podrobný popis / Zadání</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Specifikace závady..."
                    ></textarea>
                  </div>
                </div>

            </div>

            {/* --- PRAVÝ SLOUPEC: STROJE --- */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-[500px] overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
                    <div className="font-bold text-slate-700 flex items-center gap-2">
                        <Wrench size={18} className="text-blue-600"/>
                        Výběr zařízení
                    </div>
                    {customerMachines.length > 0 && (
                        <span className="text-xs bg-white border px-2 py-1 rounded-full text-slate-500">
                            Nalezeno: {customerMachines.length} ks
                        </span>
                    )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {!formData.customer_id ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6">
                            <User size={48} className="mb-3 opacity-20" />
                            <p>Nejdříve vyberte zákazníka v levé části.</p>
                        </div>
                    ) : customerMachines.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6">
                            <Wrench size={48} className="mb-3 opacity-20" />
                            <p>Tento zákazník nemá v databázi evidované žádné stroje.</p>
                        </div>
                    ) : (
                        customerMachines.map(machine => (
                            <label 
                                key={machine.id} 
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    selectedMachineIds.includes(machine.id) 
                                    ? 'bg-blue-50 border-blue-300 shadow-sm' 
                                    : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                                }`}
                            >
                                <input 
                                type="checkbox"
                                className="w-5 h-5 text-blue-600 rounded mt-0.5"
                                checked={selectedMachineIds.includes(machine.id)}
                                onChange={() => toggleMachine(machine.id)}
                                />
                                <div>
                                    <div className={`font-medium text-sm ${selectedMachineIds.includes(machine.id) ? 'text-blue-800' : 'text-slate-800'}`}>
                                        {machine.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        S/N: {machine.serial_number} • {machine.type}
                                    </div>
                                </div>
                            </label>
                        ))
                    )}
                </div>
                
                {/* Info patička seznamu */}
                <div className="p-3 bg-white border-t border-slate-200 text-xs text-center text-slate-400">
                    Vybráno strojů: <span className="font-bold text-slate-800">{selectedMachineIds.length}</span>
                </div>
            </div>

        </div>

        {/* --- PATIČKA FORMULÁŘE (Tlačítka) --- */}
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            Zrušit
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow">
            {loading ? 'Vytvářím...' : 'Vytvořit zakázku'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

CreateJobModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default CreateJobModal;