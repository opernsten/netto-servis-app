/**
 * @component Modal
 * @description Generický kontejner pro modální okna (overlay + content).
 * Řeší zobrazení/skrytí na základě props (isOpen) a zachytává kliknutí mimo okno.
 */

import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Pokud není okno otevřené, nic nevykresluj (ani prázdný div)
  if (!isOpen) return null;
  
  return (
    // Černé pozadí (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* Samotné okno (Content) */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Hlavička okna */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Obsah okna */}
        <div className="p-6">
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
  children: PropTypes.node
};

// TOTO JE TEN ŘÁDEK, KTERÝ CHYBĚL NEBO BYL ŠPATNĚ:
export default Modal;