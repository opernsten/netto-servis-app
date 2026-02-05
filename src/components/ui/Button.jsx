/**
 * @component Button
 * @description Generická UI komponenta tlačítka.
 * 'Presentational component' - přijímá data pouze přes props (label, onClick, variant).
 * Nezávislá na stavu aplikace.
 */

import React from 'react';

const Button = ({ 
  children,       // Text nebo ikona uvnitř tlačítka
  onClick,        // Funkce po kliknutí
  variant = 'primary', // Styl: 'primary', 'secondary', 'success', 'danger'
  type = 'button',     // Typ: 'button' nebo 'submit'
  className = '',      // Možnost přidat extra třídy zvenčí
  disabled = false,    // Jestli je neaktivní
  ...props             // Ostatní (např. title, id)
}) => {
  
  // 1. Základní vzhled společný pro všechna tlačítka
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // 2. Definice barevných variant
  const variants = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",      // Tmavé (hlavní)
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50", // Bílé s rámečkem
    success: "bg-green-600 text-white hover:bg-green-700",       // Zelené (dokončení)
    danger: "bg-red-600 text-white hover:bg-red-700",            // Červené (smazání)
    ghost: "text-slate-600 hover:bg-slate-100 border-transparent" // Jen text (zrušit)
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
