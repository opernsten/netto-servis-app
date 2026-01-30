/**
 * @component Sidebar
 * @description Hlavní boční navigace aplikace.
 * Obsahuje odkazy na hlavní routy (Dashboard, Zákazníci, Stroje...).
 * Je statická součást layoutu.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, FileText } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-400">Netto Servis</h1>
        <p className="text-xs text-slate-500 mt-1">Servisní systém</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
          <LayoutDashboard size={20} />
          <span>Přehled</span>
        </Link>
        
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase mt-4">Hlavní menu</div>
        
        
        <Link to="/customers" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
          <Users size={20} />
          <span>Zákazníci</span>
        </Link>
        
        <Link to="/machines" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
          <Wrench size={20} />
          <span>Stroje</span>
        </Link>
        
        <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
          <FileText size={20} />
          <span>Zakázky</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">T</div>
          <div>
            <p className="text-sm font-medium">Technik</p>
            <p className="text-xs text-slate-500">online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;