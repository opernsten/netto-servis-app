import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // <--- NOVÝ IMPORT
import { getCustomers } from '../../services/customerService';
import CustomerTable from '../../features/customers/CustomerTable';
import CreateCustomerModal from '../../modals/customers/CreateCustomerModal';
import { Plus, Search } from 'lucide-react'; // Zachovány tvé ikony
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CustomerList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- REACT QUERY (Nový motor) ---
  const { 
    data: customers = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    staleTime: 1000 * 60 * 10 // 10 minut cache
  });

  // --- UI PRO NAČÍTÁNÍ A CHYBY ---

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Načítám adresář zákazníků...</div>;
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Chyba při načítání zákazníků: {error.message}
        <br />
        <button onClick={() => refetch()} className="underline mt-2">Zkusit znovu</button>
      </div>
    );
  }

  // --- HLAVNÍ OBSAH (Zachován tvůj layout) ---

  return (
    <div className="space-y-6">
      <Header
        title="Zákazníci"
        subtitle="Správa firem a kontaktů"
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Nový zákazník
          </Button>
        }
      />

      {/* Vyhledávací pole (Zachováno z tvého kódu) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <Input
            placeholder="Hledat zákazníka..."
            icon={Search}
            containerClassName="flex-1 max-w-md"
        />
      </div>

      {/* Tabulka */}
      <CustomerTable customers={customers} />

      {/* Modal pro nového zákazníka */}
      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch(); // <--- Aktualizace po vytvoření
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default CustomerList;