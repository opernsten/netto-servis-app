import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/customerService';
import CustomerTable from '../../features/customers/CustomerTable';
import CreateCustomerModal from '../../modals/customers/CreateCustomerModal'; // <--- Import Modálu
import { Plus, Search } from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stav pro otevření/zavření modálu
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funkce pro načtení dat
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Nepodařilo se načíst zákazníky.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Funkce, která se zavolá, když se úspěšně vytvoří zákazník
  const handleCustomerCreated = () => {
    fetchData(); // Znovu načti tabulku, ať vidíme nového zákazníka
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Zákazníci</h1>
          <p className="text-slate-500 text-sm">Správa firem a kontaktů</p>
        </div>
        
        {/* Tlačítko nyní otevírá modál */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Nový zákazník
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Hledat zákazníka..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <CustomerTable customers={customers} loading={loading} />

      {/* Zde vkládáme naše modální okno */}
      <CreateCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
};

export default CustomerList;