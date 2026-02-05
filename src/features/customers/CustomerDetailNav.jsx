import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';

const CustomerDetailNav = ({ customer, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
        <button
            onClick={() => navigate('/customers')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-white"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Zpět na přehled</span>
        </button>

        <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-300">
                ID: {customer.id.slice(0,8)}
            </span>
            <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl border border-slate-300 shadow-sm hover:shadow-md hover:border-blue-500 hover:text-blue-700 transition-all font-bold text-sm"
            >
                <Edit size={16} /> <span className="hidden sm:inline">Upravit údaje</span>
            </button>
        </div>
    </div>
  );
};

export default CustomerDetailNav;
