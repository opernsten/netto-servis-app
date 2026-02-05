import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { supabase } from '../../api/supabaseClient';

const EditCustomerModal = ({ isOpen, onClose, customer, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    ico: '',
    dic: '',
    contact_person: '', // Zodpovědná osoba
    internal_coach: '', // Náš kouč
    notes: '',
    has_service_contract: false
  });

  // Načtení dat zákazníka do formuláře při otevření
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        address: customer.address || '',
        phone: customer.phone || '',
        email: customer.email || '',
        ico: customer.ico || '',
        dic: customer.dic || '',
        contact_person: customer.contact_person || '',
        internal_coach: customer.internal_coach || '',
        notes: customer.notes || '',
        has_service_contract: customer.has_service_contract || false
      });
    }
  }, [customer, isOpen]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          ico: formData.ico,
          dic: formData.dic,
          contact_person: formData.contact_person,
          internal_coach: formData.internal_coach,
          notes: formData.notes,
          has_service_contract: formData.has_service_contract
        })
        .eq('id', customer.id)
        .select()
        .single();

      if (error) throw error;

      // Pošleme aktualizovaná data zpět do rodičovské komponenty
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Chyba při úpravě zákazníka:', error);
      alert('Nepodařilo se uložit změny.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upravit zákazníka">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Jméno firmy */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Název firmy / Zákazníka</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Adresa */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adresa</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Kontakty (Telefon / Email) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* IČO / DIČ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">IČO</label>
            <input
              type="text"
              name="ico"
              value={formData.ico}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DIČ</label>
            <input
              type="text"
              name="dic"
              value={formData.dic}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <hr className="border-slate-100 my-2" />

        {/* Lidé (Kontaktní osoba / Kouč) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kontaktní osoba (u nich)</label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Jméno a příjmení"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Náš kouč</label>
            <input
              type="text"
              name="internal_coach"
              value={formData.internal_coach}
              onChange={handleChange}
              placeholder="Kdo se o ně stará?"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* CHECKBOX PRO SMLOUVU */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <input
                type="checkbox"
                id="has_service_contract_edit"
                name="has_service_contract"
                checked={formData.has_service_contract}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
            />
            <label htmlFor="has_service_contract_edit" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Tento zákazník má aktivní servisní smlouvu
            </label>
        </div>

        {/* Poznámka */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Interní poznámka</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} type="button">
            Zrušit
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Ukládám...' : 'Uložit změny'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomerModal;