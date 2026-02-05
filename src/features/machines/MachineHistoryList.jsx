import React from 'react';
import { History } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/dateUtils';

const MachineHistoryList = ({ history, onSelectEntry }) => {
  return (
    <Card className="rounded-xl shadow-sm border border-slate-200 overflow-hidden" noPadding>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <History size={18} className="text-slate-500"/>
            <h3 className="font-bold text-slate-800">Deník stroje (Historie servisů)</h3>
        </div>

        <div className="divide-y divide-slate-100">
            {history && history.length > 0 ? (
                history.map((entry, index) => (
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
                            onClick={() => onSelectEntry(entry)}
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
    </Card>
  );
};

export default MachineHistoryList;
