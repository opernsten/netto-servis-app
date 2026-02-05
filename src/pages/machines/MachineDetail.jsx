import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachineById } from '../../services/machineService';
import EditMachineModal from '../../modals/machines/EditMachineModal';
import HistoryDetailModal from '../../modals/machines/HistoryDetailModal';
import { ArrowLeft } from 'lucide-react';
import MachineDetailHeader from '../../features/machines/MachineDetailHeader';
import MachineInfoPanel from '../../features/machines/MachineInfoPanel';
import MachineHistoryList from '../../features/machines/MachineHistoryList';

const MachineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);

  const loadData = async () => {
    try {
      const data = await getMachineById(id);
      setMachine(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Načítám detail stroje...</div>;
  if (!machine) return <div className="p-8 text-center text-red-500">Stroj nenalezen.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Tlačítko Zpět */}
      <button 
        onClick={() => navigate('/machines')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={20} />
        Zpět na seznam strojů
      </button>

      {/* 1. HLAVIČKA STROJE */}
      <MachineDetailHeader
        machine={machine}
        onEdit={() => setIsEditModalOpen(true)}
      />

      {/* 2. DVOUSLOUPCOVÝ LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEVÝ PANEL - INFO */}
        <div className="md:col-span-1 space-y-6">
           <MachineInfoPanel machine={machine} />
        </div>

        {/* PRAVÝ PANEL - HISTORIE */}
        <div className="md:col-span-2">
            <MachineHistoryList
                history={machine.history}
                onSelectEntry={setSelectedHistoryEntry}
            />
        </div>

      </div>

      {/* MODÁLNÍ OKNO PRO EDITACI */}
      <EditMachineModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        machine={machine}
        onSuccess={loadData}
      />

      {/* MODÁL PRO DETAIL HISTORIE */}
      <HistoryDetailModal 
        isOpen={!!selectedHistoryEntry}
        onClose={() => setSelectedHistoryEntry(null)}
        entry={selectedHistoryEntry}
      />

    </div>
  );
};

export default MachineDetail;
