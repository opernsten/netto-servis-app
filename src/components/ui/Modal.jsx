/**
 * @component Modal
 * @description Generický kontejner pro modální okna (overlay + content).
 * Řeší zobrazení/skrytí na základě props (isOpen) a zachytává kliknutí mimo okno.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

// Přidali jsme prop 'maxWidth', výchozí je 'max-w-lg' (klasické úzké okno)
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  
  // Zavření klávesou ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      {/* Kliknutí mimo okno ho zavře */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Tady používáme proměnnou {maxWidth} */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()} // Kliknutí uvnitř okna ho NEzavře
      >
        
        {/* Hlavička */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Obsah (s rolováním, pokud je obsah moc dlouhý) */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  maxWidth: PropTypes.string, // Validace nové propsy
};

export default Modal;