import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Přidáno keepPreviousData
import { getJobs } from '../../services/jobService';
import JobTable from '../../features/jobs/JobTable';
import CreateJobModal from '../../modals/jobs/CreateJobModal';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'; // Přidány šipky
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

const JobList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- STRÁNKOVÁNÍ ---
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20; // Počet zakázek na stránku

  // --- DATA LOADING ---
  const { 
    data: result, // Přejmenujeme na 'result', protože teď vrací objekt { data, count }
    isLoading, 
    isError,
    error,
    refetch,
    isPlaceholderData // Indikuje, že zobrazujeme stará data během načítání nových
  } = useQuery({
    queryKey: ['jobs', page], // Přidáme stránku do klíče
    queryFn: () => getJobs(page, ITEMS_PER_PAGE), // Posíláme parametry
    staleTime: 0,
    placeholderData: keepPreviousData, // UX: Nechá zobrazena stará data, dokud se nenačtou nová
    refetchOnWindowFocus: true
  });

  // Bezpečné vytažení dat (pokud je result undefined, použijeme prázdné hodnoty)
  const jobs = result?.data || [];
  const totalCount = result?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // --- OVLÁDÁNÍ STRÁNKOVÁNÍ ---
  const nextPage = () => {
    if (!isPlaceholderData && page < totalPages) {
      setPage(old => old + 1);
    }
  };

  const prevPage = () => {
    setPage(old => Math.max(old - 1, 1));
  };

  // --- UI PRO NAČÍTÁNÍ A CHYBY ---
  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Načítám servisní zakázky...</div>;
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Chyba při načítání: {error.message}
        <br />
        <button onClick={() => refetch()} className="underline mt-2">Zkusit znovu</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Header
        title="Servisní zakázky"
        subtitle={`Přehled všech výjezdů a oprav (Celkem: ${totalCount})`}
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <ClipboardList size={18} />
            Nová zakázka
          </Button>
        }
      />

      {/* Tabulka s lehkou průhledností při načítání nové stránky */}
      <div className={isPlaceholderData ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity'}>
         <JobTable jobs={jobs} />
      </div>

      {/* --- OVLÁDACÍ LIŠTA STRÁNKOVÁNÍ --- */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4 bg-white p-4 rounded-xl shadow-sm">
         <div className="text-sm text-slate-500">
            Zobrazeno <b>{(page - 1) * ITEMS_PER_PAGE + 1}</b> - <b>{Math.min(page * ITEMS_PER_PAGE, totalCount)}</b> z <b>{totalCount}</b>
         </div>

         <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-medium px-4">
              Stránka {page} z {totalPages || 1}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages || totalCount === 0}
              className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
         </div>
      </div>

      {/* Modal pro novou zakázku */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setPage(1); // Skočíme na první stránku
          refetch(); 
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default JobList;