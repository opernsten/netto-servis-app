/**
 * @component Sidebar
 * @description Hlavní boční navigace aplikace.
 * Obsahuje odkazy na hlavní routy (Dashboard, Zákazníci, Stroje...).
 * Je statická součást layoutu.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, FileText } from 'lucide-react';
import { APP_TITLE, APP_SUBTITLE, SIDEBAR_NAV_LINKS, PLACEHOLDER_USER } from '../../constants/appConstants';

const navIcons = {
  '/': <LayoutDashboard size={20} />,
  '/customers': <Users size={20} />,
  '/machines': <Wrench size={20} />,
  '/jobs': <FileText size={20} />,
};

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-400">{APP_TITLE}</h1>
        <p className="text-xs text-slate-500 mt-1">{APP_SUBTITLE}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase mt-4">Hlavní menu</div>
        
        {SIDEBAR_NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {navIcons[link.to]}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">{PLACEHOLDER_USER.initials}</div>
          <div>
            <p className="text-sm font-medium">{PLACEHOLDER_USER.name}</p>
            <p className="text-xs text-slate-500">{PLACEHOLDER_USER.status}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;