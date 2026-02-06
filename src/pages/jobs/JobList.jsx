import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // <--- JEDINÝ NOVÝ IMPORT
import { getJobs } from '../../services/jobService';
import JobTable from '../../features/jobs/JobTable';
import CreateJobModal from '../../modals/jobs/CreateJobModal';
import { ClipboardList } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

const JobList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- MÍSTO useEffect a useState POUŽIJEME useQuery ---
  const { 
    data: jobs = [], // Když data nejsou, je to prázdné pole
    isLoading, 
    isError,
    error,
    refetch // Funkce pro obnovení dat
  } = useQuery({
    queryKey: ['jobs'],     // Klíč pro cache
    queryFn: getJobs,       // Funkce pro stažení
    staleTime: 1000 * 60 * 5 // 5 minut cache
  });

  // --- PODMÍNKY PRO NAČÍTÁNÍ A CHYBU ---
  
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

  // --- PŮVODNÍ DESIGN ---

  return (
    <div className="space-y-6">
      <Header
        title="Servisní zakázky"
        subtitle="Přehled všech výjezdů a oprav"
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

      {/* Tabulka dostane data přímo z React Query */}
      <JobTable jobs={jobs} />

      {/* Modal po úspěchu zavolá refetch() aby se tabulka obnovila */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch(); // <--- Tady řekneme: "Stáhni nová data!"
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default JobList;