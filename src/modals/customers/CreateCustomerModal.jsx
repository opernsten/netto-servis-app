import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/ui/Modal'; // Náš univerzální rámeček
import { createCustomer } from '../../services/customerService'; // Funkce pro zápis do DB

const CreateCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data formuláře
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    ico: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Pošleme data do Supabase
      await createCustomer(formData);
      
      // 2. Vyčistíme formulář
      setFormData({ name: '', email: '', phone: '', address: '', ico: '', notes: '' });
      
      // 3. Řekneme rodičovské stránce "Hotovo, obnov data"
      onSuccess();
      
      // 4. Zavřeme okno
      onClose();
    } catch (err) {
      setError('Chyba při ukládání zákazníka. Zkuste to znovu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nový zákazník">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Název firmy / Jméno *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Např. Novák s.r.o."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">IČO</label>
            <input
              type="text"
              name="ico"
              value={formData.ico}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Telefon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Adresa</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ulice, Město..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Ukládám...' : 'Vytvořit zákazníka'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

CreateCustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default CreateCustomerModal;