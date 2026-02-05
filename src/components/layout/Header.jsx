import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, actions, backTo, backLabel = 'Zpět' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {backTo && (
            <button
                onClick={() => navigate(backTo)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
                <ArrowLeft size={20} />
                {backLabel}
            </button>
        )}
        {title && <h1 className="text-2xl font-bold text-slate-800">{title}</h1>}
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>

      {actions && (
        <div className="flex gap-2 items-center">
            {actions}
        </div>
      )}
    </div>
  );
};

export default Header;
