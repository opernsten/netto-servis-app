import React from 'react';
import { Phone, Mail, User, Briefcase, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';

const CustomerInfoCards = ({ customer }) => {
  return (
    <Card className="rounded-t-none border-t-0 bg-slate-50 mb-8" noPadding>
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* DLAŽDICE 1: Kontakt */}
                <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-300 group border-slate-300">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                        Kontakt
                    </h3>
                    <div className="space-y-4">
                        <a href={`tel:${customer.phone}`} className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Telefon</p>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{customer.phone || 'Nevyplněno'}</p>
                            </div>
                        </a>
                        <a href={`mailto:${customer.email}`} className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors break-all">{customer.email || 'Nevyplněno'}</p>
                            </div>
                        </a>
                    </div>
                </Card>

                {/* DLAŽDICE 2: Fakturace */}
                <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-300 border-slate-300">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                        Fakturační údaje
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="text-xs font-bold text-slate-600 uppercase">IČO</span>
                            <span className="font-mono text-sm font-bold text-slate-900">{customer.ico || 'Nevyplněno'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="text-xs font-bold text-slate-600 uppercase">DIČ</span>
                            <span className="font-mono text-sm font-bold text-slate-900">{customer.dic || 'Nevyplněno'}</span>
                        </div>
                    </div>
                </Card>

                {/* DLAŽDICE 3: Lidé (s ikonami) */}
                <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-300 border-slate-300">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                        Zodpovědné osoby
                    </h3>
                    <div className="space-y-4">
                        {/* IKONA KLIENTA */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-500 font-bold leading-none mb-1">Kontaktní osoba</p>
                                <p className="text-sm font-bold text-slate-800">{customer.contact_person || 'Nevyplněno'}</p>
                            </div>
                        </div>
                        {/* IKONA KOUČE */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-200 shadow-sm">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-slate-500 font-bold leading-none mb-1">Náš kouč</p>
                                <p className="text-sm font-bold text-slate-800">{customer.internal_coach || 'Nevyplněno'}</p>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Poznámka - výraznější rámeček */}
            {customer.notes && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-400 text-slate-800 shadow-sm">
                        <div className="mt-0.5 text-yellow-600"><FileText size={20}/></div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-yellow-700 uppercase">Interní poznámka</p>
                            <p className="text-sm italic leading-relaxed text-slate-800">{customer.notes || 'Bez poznámky'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Card>
  );
};

export default CustomerInfoCards;
