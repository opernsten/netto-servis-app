import React, { useEffect, useState } from 'react';
import { getMachines } from '../../services/machineService';
import MachineTable from '../../features/machines/MachineTable';
import CreateMachineModal from '../../modals/machines/CreateMachineModal'; // <--- Import
import { Wrench } from 'lucide-react';

const MachineList = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- Stav okna

  // Funkce pro načtení dat
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stroje</h1>
          <p className="text-slate-500 text-sm">Evidence servisovaných zařízení</p>
        </div>
        
        {/* Tlačítko nyní otevírá modál */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Wrench size={18} />
          Nový stroj
        </button>
      </div>

      <MachineTable machines={machines} loading={loading} />

      {/* Naše nové modální okno */}
      <CreateMachineModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData} // Po úspěchu znovu načíst seznam
      />
    </div>
  );
};

export default MachineList;