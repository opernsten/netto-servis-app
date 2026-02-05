import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../services/customerService';
import CustomerTable from '../../features/customers/CustomerTable';
import CreateCustomerModal from '../../modals/customers/CreateCustomerModal';
import { Plus, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCustomerCreated = () => {
    fetchData();
  };

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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <Input
            placeholder="Hledat zákazníka..."
            icon={Search}
            containerClassName="flex-1 max-w-md"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <CustomerTable customers={customers} loading={loading} />

      <CreateCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
};

export default CustomerList;
