import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomerById } from '../../services/customerService';
import { Wrench, Layers } from 'lucide-react';
import EditCustomerModal from '../../modals/customers/EditCustomerModal';
import CreateMachineModal from '../../modals/machines/CreateMachineModal';

// Features
import CustomerDetailNav from '../../features/customers/CustomerDetailNav';
import CustomerCardHeader from '../../features/customers/CustomerCardHeader';
import CustomerInfoCards from '../../features/customers/CustomerInfoCards';
import CustomerMachineList from '../../features/customers/CustomerMachineList';
import CustomerJobList from '../../features/customers/CustomerJobList';

const CustomerDetail = () => {
  const { id } = useParams();
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('machines');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        console.error(err);
        alert('Nepodařilo se načíst detail zákazníka.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleCustomerUpdate = (updatedData) => {
    setCustomer(prev => ({ ...prev, ...updatedData }));
  };

  const handleMachineCreated = (newMachine) => {
    setCustomer(prev => ({
        ...prev,
        machines: [...(prev.machines || []), newMachine]
    }));
  };

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">Načítám profil...</div>;
  if (!customer) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-red-600">Zákazník nenalezen.</div>;

  return (
    <div className="min-h-screen bg-slate-100 pb-12 font-sans text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
        {/* 1. HORNÍ NAVIGACE */}
        <CustomerDetailNav
          customer={customer}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {/* 2. HLAVNÍ KARTA (VIZITKA) */}
        <div>
           <CustomerCardHeader customer={customer} />
           <CustomerInfoCards customer={customer} />
        </div>

        {/* 3. KARTA S DATY (Tabulky) */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl shadow-slate-300/40 overflow-hidden min-h-[500px]">
            <div className="flex border-b border-slate-300 bg-slate-50">
                <button 
                    onClick={() => setActiveTab('machines')}
                    className={`relative px-8 py-5 text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'machines' 
                        ? 'text-blue-700 bg-white border-t-2 border-t-blue-600 border-x border-slate-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-t-2 border-t-transparent'
                    }`}
                >
                    <Wrench size={18} className={activeTab === 'machines' ? 'text-blue-600' : 'text-slate-400 grayscale'}/>
                    Park strojů 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold ${activeTab === 'machines' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                        {customer.machines?.length || 0}
                    </span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`relative px-8 py-5 text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'jobs' 
                        ? 'text-purple-700 bg-white border-t-2 border-t-purple-600 border-x border-slate-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-t-2 border-t-transparent'
                    }`}
                >
                    <Layers size={18} className={activeTab === 'jobs' ? 'text-purple-600' : 'text-slate-400 grayscale'}/>
                    Historie servisu 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold ${activeTab === 'jobs' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                        {customer.jobs?.length || 0}
                    </span>
                </button>
            </div>

            <div className="p-0">
                {/* A) TABULKA STROJŮ */}
                {activeTab === 'machines' && (
                    <CustomerMachineList
                        machines={customer.machines}
                        onAddMachine={() => setIsMachineModalOpen(true)}
                    />
                )}

                {/* B) TABULKA ZAKÁZEK */}
                {activeTab === 'jobs' && (
                    <CustomerJobList jobs={customer.jobs} />
                )}
            </div>
        </div>

        {/* MODALY */}
        {customer && (
            <EditCustomerModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                customer={customer}
                onUpdate={handleCustomerUpdate}
            />
        )}
        
        <CreateMachineModal
            isOpen={isMachineModalOpen}
            onClose={() => setIsMachineModalOpen(false)}
            customerId={customer.id} 
            onSuccess={handleMachineCreated}
        />

      </div>
    </div>
  );
};

export default CustomerDetail;
