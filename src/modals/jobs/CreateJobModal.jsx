import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { createJob } from '../../services/jobService';
import { getCustomers } from '../../services/customerService';
import { getMachinesByCustomer } from '../../services/machineService'; 
import JobForm from '../../features/jobs/JobForm';
import JobMachineSelector from '../../features/jobs/JobMachineSelector';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  
  // Stavy pro stroje
  const [customerMachines, setCustomerMachines] = useState([]);
  const [selectedMachineIds, setSelectedMachineIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
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
    <Modal isOpen={isOpen} onClose={onClose} title="Nová servisní zakázka" maxWidth="max-w-6xl">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        
        {/* HLAVNÍ GRID - 2 SLOUPCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEVÝ SLOUPEC: INFORMACE --- */}
            <JobForm
              formData={formData}
              onChange={handleChange}
              customers={customers}
              searchTerm={searchTerm}
              onSearchTermChange={(term) => {
                setSearchTerm(term);
                setFormData(prev => ({ ...prev, customer_id: '' }));
              }}
              isSearchOpen={isSearchOpen}
              onSearchOpenChange={setIsSearchOpen}
              onCustomerSelect={(c) => {
                setFormData(prev => ({ ...prev, customer_id: c.id }));
                setSearchTerm(c.name);
                setIsSearchOpen(false);
              }}
            />

            {/* --- PRAVÝ SLOUPEC: STROJE --- */}
            <JobMachineSelector
              machines={customerMachines}
              selectedMachineIds={selectedMachineIds}
              onToggleMachine={toggleMachine}
              customerId={formData.customer_id}
            />

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
