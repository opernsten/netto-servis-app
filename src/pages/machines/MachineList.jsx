import React, { useEffect, useState } from 'react';
import { getMachines } from '../../services/machineService';
import MachineTable from '../../features/machines/MachineTable';
import CreateMachineModal from '../../modals/machines/CreateMachineModal';
import { Wrench } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

const MachineList = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Header
        title="Stroje"
        subtitle="Evidence servisovaných zařízení"
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Wrench size={18} />
            Nový stroj
          </Button>
        }
      />

      <MachineTable machines={machines} loading={loading} />

      <CreateMachineModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default MachineList;
