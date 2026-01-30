import React, { useEffect, useState } from 'react';
import { getMachines } from '../../services/machineService';
import MachineTable from '../../features/machines/MachineTable';
import { Wrench } from 'lucide-react';

const MachineList = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stroje</h1>
          <p className="text-slate-500 text-sm">Evidence servisovaných zařízení</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Wrench size={18} />
          Nový stroj
        </button>
      </div>

      <MachineTable machines={machines} loading={loading} />
    </div>
  );
};

export default MachineList;