import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const CustomerCardHeader = ({ customer }) => {
  return (
    <Card className="rounded-t-2xl border-x border-t border-slate-300 shadow-sm overflow-hidden" noPadding>
        {/* MODRÁ HLAVIČKA (UVNITŘ KARTY) */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex items-center gap-6">
                    {/* Ikona firmy */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-2xl">
                        <Building2 size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">{customer.name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-blue-100">
                            <MapPin size={16} className="text-blue-200"/>
                            <span className="font-medium text-sm tracking-wide">{customer.address || 'Adresa neuvedena'}</span>
                        </div>
                    </div>
                </div>

                {/* Status Smlouvy */}
                <div className="mt-4 md:mt-0">
                    {customer.has_service_contract ? (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-600 rounded-full border border-emerald-400 shadow-lg">
                            <div className="p-1 bg-white rounded-full"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-emerald-100 uppercase leading-none tracking-wider">Status</span>
                                <Badge variant="success-solid" className="px-0 py-0 bg-transparent text-sm">SMLOUVA AKTIVNÍ</Badge>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-800/40 backdrop-blur-md rounded-full border border-white/20">
                            <div className="p-1 bg-slate-400 rounded-full"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-300 uppercase leading-none tracking-wider">Status</span>
                                <Badge variant="neutral-solid" className="px-0 py-0 bg-transparent text-sm">BEZ SMLOUVY</Badge>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Card>
  );
};

export default CustomerCardHeader;
