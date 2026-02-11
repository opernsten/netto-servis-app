import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Důležitý import keepPreviousData
import { getMachines } from '../../services/machineService';
import MachineTable from '../../features/machines/MachineTable';
import CreateMachineModal from '../../modals/machines/CreateMachineModal';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { Wrench, ChevronLeft, ChevronRight } from 'lucide-react'; // Ikony pro šipky

const MachineList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- STRÁNKOVÁNÍ ---
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20; // Kolik strojů na stránku

  // --- REACT QUERY ---
  const { 
    data: result, // Přejmenujeme data na result, protože uvnitř bude { data, count }
    isLoading, 
    isError, 
    error,
    refetch,
    isPlaceholderData // Indikuje, že zobrazujeme stará data zatímco se načítají nová
  } = useQuery({
    queryKey: ['machines', page], // Přidáme 'page' do klíče -> při změně stránky se to načte znovu
    queryFn: () => getMachines(page, ITEMS_PER_PAGE),
    placeholderData: keepPreviousData, // UX pecka: nechá zobrazenou starou stránku, dokud se nenačte nová (nebliká to)
    staleTime: 0 
  });

  // Vytáhneme data a počet z výsledku (bezpečně)
  const machines = result?.data || [];
  const totalCount = result?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // --- FUNKCE PRO ZMĚNU STRÁNKY ---
  const nextPage = () => {
    if (!isPlaceholderData && page < totalPages) {
      setPage(old => old + 1);
    }
  };

  const prevPage = () => {
    setPage(old => Math.max(old - 1, 1));
  };

  // --- UI PRO NAČÍTÁNÍ A CHYBY ---
  if (isLoading) return <div className="p-10 text-center text-slate-500">Načítám seznam strojů...</div>;
  
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
    <div className="space-y-6 pb-20"> {/* Přidán padding dole pro tlačítka */}
      <Header
        title="Databáze strojů"
        subtitle={`Celkem evidováno ${totalCount} zařízení`}
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

      {/* Tabulka (té je jedno, že dostane jen 20 strojů) */}
      <div className={isPlaceholderData ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity'}>
         <MachineTable machines={machines} />
      </div>

      {/* --- OVLÁDÁNÍ STRÁNKOVÁNÍ --- */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4 bg-white p-4 rounded-xl shadow-sm">
         <div className="text-sm text-slate-500">
            Zobrazeno <b>{(page - 1) * ITEMS_PER_PAGE + 1}</b> - <b>{Math.min(page * ITEMS_PER_PAGE, totalCount)}</b> z <b>{totalCount}</b>
         </div>

         <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-medium px-4">
              Stránka {page} z {totalPages || 1}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages || totalCount === 0}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
         </div>
      </div>

      {/* Modal pro nový stroj */}
      <CreateMachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch(); 
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default MachineList;