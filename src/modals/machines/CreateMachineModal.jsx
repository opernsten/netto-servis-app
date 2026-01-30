import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal';
import { createMachine } from '../../services/machineService';
import { getCustomers } from '../../services/customerService';
import { Search, ChevronDown, Check } from 'lucide-react';

const CreateMachineModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data pro výběr zákazníka
  const [customers, setCustomers] = useState([]); 
  
  // STAV PRO VYHLEDÁVÁNÍ (Autocomplete)
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    type: 'TQS', // Výchozí hodnota podle nového seznamu
    customer_id: ''
  });

  // Načtení zákazníků při otevření okna
  useEffect(() => {
    if (isOpen) {
      const loadCustomers = async () => {
        try {
          const data = await getCustomers();
          setCustomers(data);
          
          // Reset formuláře
          setSearchTerm('');
          setShowDropdown(false);
          setFormData({
            name: '',
            serial_number: '',
            type: 'TQS',
            customer_id: ''
          });

        } catch (err) {
          console.error(err);
          setError('Nepodařilo se načíst seznam zákazníků.');
        }
      };
      loadCustomers();
    }
  }, [isOpen]);

  // Filtrace zákazníků podle toho, co uživatel píše
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer) => {
    setFormData({ ...formData, customer_id: customer.id });
    setSearchTerm(customer.name); // Do políčka doplníme jméno
    setShowDropdown(false); // Zavřeme nabídku
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.customer_id) {
      setError('Musíte vybrat zákazníka ze seznamu.');
      setLoading(false);
      return;
    }

    try {
      await createMachine(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Chyba při ukládání stroje.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nový stroj">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

        {/* 1. CHYTRÉ VYHLEDÁVÁNÍ ZÁKAZNÍKA */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Zákazník (Majitel) *</label>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Začněte psát název firmy..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setFormData({ ...formData, customer_id: '' }); // Reset ID když uživatel začne přepisovat
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          {/* Vyskakovací seznam nalezených firem */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{customer.name}</p>
                      {customer.address && <p className="text-xs text-slate-500">{customer.address}</p>}
                    </div>
                    {formData.customer_id === customer.id && <Check size={16} className="text-blue-600"/>}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500 text-sm">
                  Žádný zákazník nenalezen.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. NÁZEV STROJE */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Název stroje *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Např. Linka 1"
          />
        </div>

        {/* 3. VÝROBNÍ ČÍSLO a TYP (Upravený seznam) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Výrobní číslo</label>
            <input
              type="text"
              name="serial_number"
              required
              value={formData.serial_number}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder='Např. 9005xxxxx'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Typ</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="TQS">TQS</option>
              <option value="CW">CW</option>
              <option value="X-RAY">X-RAY</option>
              <option value="HC-A">HC-A</option>
              <option value="Jiné">Jiné</option>
            </select>
          </div>
        </div>

        {/* TLAČÍTKA */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            Zrušit
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50">
            {loading ? 'Ukládám...' : 'Přidat stroj'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

CreateMachineModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default CreateMachineModal;