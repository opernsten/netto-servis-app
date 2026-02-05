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
    // POZADÍ STRÁNKY: Čistá šedá
    <div className="min-h-screen bg-slate-100 pb-12 font-sans text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
        {/* 1. HORNÍ NAVIGACE */}
        <div className="mb-6 flex items-center justify-between">
            <button 
                onClick={() => navigate('/customers')} 
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-white"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="font-medium">Zpět na přehled</span>
            </button>
            
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-200">
                    ID: {customer.id.slice(0,8)}
                </span>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-300 shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-600 transition-all font-bold text-sm"
                >
                    <Edit size={16} /> <span className="hidden sm:inline">Upravit údaje</span>
                </button>
            </div>
        </div>

        {/* 2. HLAVNÍ KARTA (VIZITKA) */}
        {/* DŮLEŽITÉ: overflow-hidden zajistí, že gradient uvnitř nepřečuhuje rohy */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-300/40 overflow-hidden mb-8">
            
            {/* --- GRADIENT HLAVIČKA (Opraveno) --- */}
            {/* Vloženo přímo sem, barvy textu změněny na bílou pro kontrast */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                        {/* Ikona firmy - bílá na průhledném pozadí */}
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
                            <Building2 size={40} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">{customer.name}</h1>
                            <div className="flex items-center gap-2 mt-2 text-blue-100">
                                <MapPin size={16} className="text-blue-200"/> 
                                <span className="font-medium text-sm">{customer.address || 'Adresa neuvedena'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Smlouvy - upraveno pro tmavé pozadí */}
                    <div className="mt-4 md:mt-0">
                        {customer.has_service_contract ? (
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 shadow-lg">
                                <div className="p-1 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-300 uppercase leading-none tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-white">SMLOUVA AKTIVNÍ</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <div className="p-1 bg-slate-400 rounded-full"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase leading-none tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-slate-100">BEZ SMLOUVY</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* --- KONEC GRADIENT HLAVIČKY --- */}


            {/* Grid s informacemi (Šedé pozadí pro kontrast s bílými dlaždicemi) */}
            <div className="p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* DLAŽDICE 1: Kontakt */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-2">
                            Kontakt
                        </h3>
                        <div className="space-y-4">
                            <a href={`tel:${customer.phone}`} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Telefon</p>
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{customer.phone || '—'}</p>
                                </div>
                            </a>
                            <a href={`mailto:${customer.email}`} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors break-all">{customer.email || '—'}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* DLAŽDICE 2: Fakturace */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-2">
                            Fakturační údaje
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase">IČO</span>
                                <span className="font-mono text-sm font-bold text-slate-900">{customer.ico || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase">DIČ</span>
                                <span className="font-mono text-sm font-bold text-slate-900">{customer.dic || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* DLAŽDICE 3: Lidé */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-2">
                            Zodpovědné osoby
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold leading-none mb-1">Klient</p>
                                    <p className="text-sm font-bold text-slate-800">{customer.contact_person || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold leading-none mb-1">Náš kouč</p>
                                    <p className="text-sm font-bold text-slate-800">{customer.internal_coach || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Poznámka */}
                {customer.notes && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                         <div className="flex gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-slate-700 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"></div>
                            <div className="mt-0.5 text-yellow-600"><FileText size={20}/></div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-yellow-700 uppercase">Interní poznámka</p>
                                <p className="text-sm italic leading-relaxed text-slate-700">{customer.notes}</p>
                            </div>
                         </div>
                    </div>
                )}
            </div>
        </div>

        {/* 3. KARTA S DATY (Tabulky) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-300/40 overflow-hidden min-h-[500px]">
            <div className="flex border-b border-slate-200 bg-slate-50/50">
                <button 
                    onClick={() => setActiveTab('machines')}
                    className={`relative px-8 py-5 text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'machines' 
                        ? 'text-blue-700 bg-white border-t-2 border-t-blue-600 border-x border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' 
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
                        ? 'text-purple-700 bg-white border-t-2 border-t-purple-600 border-x border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' 
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
                                <p className="text-slate-400 text-sm mb-6">Evidence strojů je prázdná.</p>
                                <Button variant="primary" onClick={() => setIsMachineModalOpen(true)} className="shadow-lg shadow-blue-500/30">
                                    + Přidat první stroj
                                </Button>
                            </div>
                        ) : (
                            <>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
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
                                <thead className="bg-slate-50/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
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