import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById } from '../../services/customerService';
import Button from '../../components/ui/Button';
import { 
  ArrowLeft, Building2, Phone, Mail, User, Briefcase, 
  Wrench, FileText, MapPin, BadgeCheck, AlertCircle, Edit, Layers, ChevronRight
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import EditCustomerModal from '../../modals/customers/EditCustomerModal';
import CreateMachineModal from '../../modals/machines/CreateMachineModal';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400">Načítám profil...</div>;
  if (!customer) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-red-500">Zákazník nenalezen.</div>;

  return (
    // 1. HLAVNÍ KONTEJNER: Přidáno 'relative', aby se 'absolute' prvky uvnitř chytaly tohoto boxu a nelezly do menu
    // Změna pozadí na 'bg-slate-100' (tmavší než 50), aby bílé karty vynikly
    <div className="relative min-h-screen bg-slate-100 pb-12 font-sans text-slate-600">
      
      {/* DEKORATIVNÍ POZADÍ HLAVIČKY */}
      {/* Nyní je uvnitř 'relative' kontejneru, takže nepřeteče doleva */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-700 to-indigo-800 z-0 shadow-sm"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
      
        {/* NAVIGACE (Bílá na modrém pozadí) */}
        <div className="mb-8 flex items-center justify-between">
            <button 
                onClick={() => navigate('/customers')} 
                className="group flex items-center gap-2 text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="font-medium">Zpět na přehled</span>
            </button>
            
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-blue-200 uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded backdrop-blur-sm border border-white/10">
                    ID: {customer.id.slice(0,8)}
                </span>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-xl border-none shadow-lg shadow-black/10 hover:shadow-xl hover:bg-blue-50 transition-all duration-300 font-bold text-sm"
                >
                    <Edit size={16} /> <span className="hidden sm:inline">Upravit údaje</span>
                </button>
            </div>
        </div>

        {/* 2. HLAVNÍ KARTA (VIZITKA) */}
        {/* Zvýšený stín (shadow-xl) a jasnější border */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-300/50 overflow-hidden mb-8 ring-1 ring-slate-200">
            
            {/* Hlavička uvnitř karty */}
            <div className="p-8 pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-6">
                        {/* Ikona firmy */}
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-blue-100">
                            <Building2 size={36} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{customer.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-slate-500">
                                <MapPin size={16} className="text-blue-500"/> 
                                <span className="font-medium text-sm text-slate-700">{customer.address || 'Adresa neuvedena'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Smlouvy */}
                    <div className="mt-2 md:mt-0">
                        {customer.has_service_contract ? (
                            <div className="flex items-center gap-3 px-5 py-2 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase leading-none tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-emerald-800">SMLOUVA AKTIVNÍ</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 rounded-full border border-slate-200">
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-slate-600">BEZ SMLOUVY</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid s informacemi - Jasně oddělené sekce */}
            <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Sloupec 1: Kontakt */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/60 hover:border-blue-200 transition-colors">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            Kontakt
                        </h3>
                        <div className="space-y-4">
                            <a href={`tel:${customer.phone}`} className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shadow-sm">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{customer.phone || '—'}</span>
                            </a>
                            <a href={`mailto:${customer.email}`} className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shadow-sm">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors break-all">{customer.email || '—'}</span>
                            </a>
                        </div>
                    </div>

                    {/* Sloupec 2: Fakturace */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/60 hover:border-blue-200 transition-colors">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Fakturační údaje
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold text-slate-500 uppercase">IČO</span>
                                <span className="font-mono text-sm font-bold text-slate-900">{customer.ico || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold text-slate-500 uppercase">DIČ</span>
                                <span className="font-mono text-sm font-bold text-slate-900">{customer.dic || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sloupec 3: Lidé */}
                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/60 hover:border-blue-200 transition-colors">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            Zodpovědné osoby
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 font-bold text-xs">
                                    K
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold leading-none mb-0.5">Klient</p>
                                    <p className="text-sm font-bold text-slate-800">{customer.contact_person || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 font-bold text-xs">
                                    M
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold leading-none mb-0.5">Náš kouč</p>
                                    <p className="text-sm font-bold text-slate-800">{customer.internal_coach || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Poznámka - výraznější */}
                {customer.notes && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                         <div className="flex gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-slate-700 shadow-sm">
                            <div className="mt-0.5 text-yellow-600"><FileText size={20}/></div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-yellow-700 uppercase">Interní poznámka</p>
                                <p className="text-sm italic leading-relaxed text-slate-800">{customer.notes}</p>
                            </div>
                         </div>
                    </div>
                )}
            </div>
        </div>

        {/* 3. KARTA S DATY (Tabulky) */}
        {/* Opět výrazný stín a rámeček */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-300/50 overflow-hidden min-h-[500px] ring-1 ring-slate-200">
            
            {/* Navigace záložek */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                <button 
                    onClick={() => setActiveTab('machines')}
                    className={`relative px-8 py-5 text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'machines' 
                        ? 'text-blue-700 bg-white border-t-2 border-t-blue-600 border-r border-slate-100' 
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
                        ? 'text-purple-700 bg-white border-t-2 border-t-purple-600 border-x border-slate-100' 
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
                    <div className="animate-fadeIn">
                        {(!customer.machines || customer.machines.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 text-slate-300">
                                    <Wrench size={24} />
                                </div>
                                <h3 className="text-slate-900 font-bold mb-1">Zatím žádné stroje</h3>
                                <p className="text-slate-500 text-sm mb-6">Evidence strojů je prázdná.</p>
                                <Button variant="primary" onClick={() => setIsMachineModalOpen(true)} className="shadow-lg shadow-blue-500/30">
                                    + Přidat první stroj
                                </Button>
                            </div>
                        ) : (
                            <>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="px-8 py-4 font-bold">Název stroje</th>
                                            <th className="px-6 py-4 font-bold">Sériové číslo</th>
                                            <th className="px-6 py-4 font-bold">Umístění</th>
                                            <th className="px-6 py-4 font-bold">Typ</th>
                                            <th className="px-8 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {customer.machines.map(machine => (
                                            <tr key={machine.id} onClick={() => navigate(`/machines/${machine.id}`)} className="hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-base">{machine.name}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200 shadow-sm">{machine.serial_number}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {machine.location ? (
                                                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                                                            <MapPin size={14} className="text-slate-400" /> {machine.location}
                                                        </span>
                                                    ) : <span className="text-slate-400">-</span>}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="inline-block border border-slate-200 px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-600 bg-white shadow-sm">
                                                        {machine.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 group-hover:border-blue-300 group-hover:text-blue-600 transition-all shadow-sm ml-auto">
                                                        <ChevronRight size={16} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
                                    <button 
                                        onClick={() => setIsMachineModalOpen(true)}
                                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
                                    >
                                        + Přidat další stroj
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* B) TABULKA ZAKÁZEK */}
                {activeTab === 'jobs' && (
                    <div className="animate-fadeIn">
                         {(!customer.jobs || customer.jobs.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 text-slate-300">
                                    <Layers size={24} />
                                </div>
                                <p className="text-slate-500 font-medium">Žádná historie zakázek.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-4 font-bold">Zakázka</th>
                                        <th className="px-6 py-4 font-bold">Datum</th>
                                        <th className="px-6 py-4 font-bold">Stav</th>
                                        <th className="px-6 py-4 font-bold">Popis</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {customer.jobs.map(job => (
                                        <tr key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="hover:bg-purple-50 cursor-pointer transition-all duration-200 group">
                                            <td className="px-8 py-5">
                                                 <span className="font-mono font-bold text-slate-700 group-hover:text-purple-700 transition-colors text-base border-l-4 pl-3 border-transparent group-hover:border-purple-400">
                                                    {job.job_number}
                                                 </span>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 font-medium">{formatDate(job.created_at)}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border ${
                                                    job.status === 'hotovo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                                    job.status === 'nova' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 truncate max-w-[250px]">{job.description}</td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-300 group-hover:border-purple-300 group-hover:text-purple-600 transition-all shadow-sm ml-auto">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
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