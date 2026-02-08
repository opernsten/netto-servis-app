import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // <--- NOVÝ IMPORT
import { getMachines } from '../../services/machineService';
import MachineTable from '../../features/machines/MachineTable';
import CreateMachineModal from '../../modals/machines/CreateMachineModal';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { Wrench } from 'lucide-react'; // Nebo jiná ikona, kterou tam máš

const MachineList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- REACT QUERY (Nový motor) ---
  const { 
    data: machines = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['machines'],
    queryFn: getMachines,
    staleTime: 0,
    refetchOnWindowFocus: true // 5 minut cache
  });

  // --- UI PRO NAČÍTÁNÍ A CHYBY ---

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Načítám seznam strojů...</div>;
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Chyba při načítání strojů: {error.message}
        <br />
        <button onClick={() => refetch()} className="underline mt-2">Zkusit znovu</button>
      </div>
    );
  }

  // --- HLAVNÍ OBSAH ---

  return (
    <div className="space-y-6">
      <Header
        title="Databáze strojů"
        subtitle="Správa všech zařízení a jejich historie"
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Wrench size={18} />
            Nový stroj
          </Button>
        }
      />

      {/* Tabulka */}
      <MachineTable machines={machines} />

      {/* Modal pro nový stroj */}
      <CreateMachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch(); // <--- Aktualizace seznamu po přidání
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default MachineList;