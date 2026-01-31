import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachineById } from '../../services/machineService';
import { formatDate } from '../../utils/dateUtils';
import EditMachineModal from '../../modals/machines/EditMachineModal';
import HistoryDetailModal from '../../modals/machines/HistoryDetailModal';
import { ArrowLeft, MapPin, Cpu, CalendarCheck, History, AlertTriangle, CheckCircle2, Factory, Edit3, Truck } from 'lucide-react';

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

  // Logika pro barvu hlavičky podle statusu
  const isProblem = machine.status !== 'ok';
  const headerBgClass = isProblem ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200';
  const statusIcon = isProblem ? <AlertTriangle className="text-red-600" size={24} /> : <CheckCircle2 className="text-green-600" size={24} />;
  const statusText = isProblem ? 'PORUCHA / SERVIS' : 'OK - V PROVOZU';
  const statusTextColor = isProblem ? 'text-red-700' : 'text-green-700';

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
      <div className={`rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${headerBgClass}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isProblem ? 'bg-red-100' : 'bg-slate-100'}`}>
             <Factory size={32} className={isProblem ? 'text-red-600' : 'text-slate-600'} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="font-bold text-2xl text-slate-900">{machine.name}</span>
               <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-mono">{machine.type}</span>
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm ${statusTextColor}`}>
               {statusIcon}
               {statusText}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Edit3 size={18} />
          Upravit stroj
        </button>
      </div>

      {/* 2. DVOUSLOUPCOVÝ LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEVÝ PANEL - INFO */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Technické Info</h3>
              
              <div className="space-y-5">
                {/* Majitel */}
                <div>
                   <div className="text-xs text-slate-500 mb-1">Majitel (Zákazník)</div>
                   <div className="font-medium text-slate-900">{machine.customers?.name}</div>
                   <div className="text-sm text-slate-500">{machine.customers?.address}</div>
                </div>

                {/* Dodavatel */}
                <div className="flex items-start gap-3">
                   <Truck className="text-orange-500 mt-1" size={20} />
                   <div>
                      <div className="text-xs text-slate-500">Dodavatel stroje</div>
                      <div className="font-medium text-slate-900">{machine.supplier || 'Neurčeno'}</div>
                   </div>
                </div>

                {/* S/N */}
                <div>
                   <div className="text-xs text-slate-500 mb-1">Výrobní číslo</div>
                   <div className="font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-700">
                     {machine.serial_number || '-'}
                   </div>
                </div>

                <hr className="border-slate-100" />

                {/* Umístění */}
                <div className="flex items-start gap-3">
                   <MapPin className="text-blue-500 mt-1" size={20} />
                   <div>
                      <div className="text-xs text-slate-500">Umístění / Linka</div>
                      <div className="font-medium text-slate-900">{machine.location || 'Neurčeno'}</div>
                   </div>
                </div>

                {/* SW Verze */}
                <div className="flex items-start gap-3">
                   <Cpu className="text-purple-500 mt-1" size={20} />
                   <div>
                      <div className="text-xs text-slate-500">Verze Software</div>
                      <div className="font-medium text-slate-900">{machine.sw_version || 'Neurčeno'}</div>
                   </div>
                </div>

                {/* Prvotní ověření - NOVÉ */}
                 <div className="flex items-start gap-3">
                   <div className="bg-slate-100 p-1 rounded text-slate-500 mt-1">
                      <CalendarCheck size={16} />
                   </div>
                   <div>
                      <div className="text-xs text-slate-500">Prvotní ověření</div>
                      <div className="font-medium text-slate-900">
                        {machine.initial_verification ? formatDate(machine.initial_verification) : 'Neurčeno'}
                      </div>
                   </div>
                </div>

                 {/* Poslední kontrola */}
                 <div className="flex items-start gap-3">
                   <CalendarCheck className="text-green-500 mt-1" size={20} />
                   <div>
                      <div className="text-xs text-slate-500">Poslední datum ověření</div>
                      <div className="font-medium text-slate-900">{machine.last_verified ? formatDate(machine.last_verified) : 'Neurčeno'}</div>
                   </div>
                </div>

              </div>
           </div>
        </div>

        {/* PRAVÝ PANEL - HISTORIE */}
        <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <History size={18} className="text-slate-500"/>
                    <h3 className="font-bold text-slate-800">Deník stroje (Historie servisů)</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {machine.history && machine.history.length > 0 ? (
                        machine.history.map((entry, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                
                                {/* Levá část: Info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-sm font-bold text-blue-600">
                                            {entry.jobs?.job_number}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {formatDate(entry.created_at)}
                                        </span>
                                    </div>
                                    
                                    <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

                                    <div>
                                        <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                            👤 {entry.jobs?.technician_names || 'Neuveden'}
                                        </div>
                                        {/* Zkrácený náhled reportu (max 50 znaků) */}
                                        <div className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
                                            {entry.report ? entry.report : 'Bez popisu'}
                                        </div>
                                    </div>
                                </div>

                                {/* Pravá část: Tlačítko */}
                                <button 
                                    onClick={() => setSelectedHistoryEntry(entry)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 text-sm rounded-lg shadow-sm font-medium"
                                >
                                    Zobrazit detail
                                </button>
                            </div>
                        ))
                    ) : (
                        // ... prázdný stav ...
                        <div className="p-12 text-center text-slate-400">
                           <p>Zatím žádná historie.</p>
                        </div>
                    )}
                </div>
            </div>
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