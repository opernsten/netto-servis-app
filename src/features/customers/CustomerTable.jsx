import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // <--- 1. PŘIDÁNO: Import pro navigaci
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

const CustomerTable = ({ customers, loading }) => {
  const navigate = useNavigate(); // <--- 2. PŘIDÁNO: Aktivace navigace

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Načítám data...</div>;
  }

  if (!customers || customers.length === 0) {
    return <div className="p-8 text-center text-slate-500">Zatím žádní zákazníci.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Firma / Jméno</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kontakt</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Adresa</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">IČO: {customer.ico || '-'}</p>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} /> {customer.email}
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} /> {customer.phone}
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} /> 
                  <span className="truncate max-w-[200px]">{customer.address || '-'}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                {/* 3. PŘIDÁNO: onClick událost */}
                <button 
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CustomerTable.propTypes = {
  customers: PropTypes.array,
  loading: PropTypes.bool
};

export default CustomerTable;