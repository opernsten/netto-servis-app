import React from 'react';

const Badge = ({ variant = 'neutral', children, className = '' }) => {
  const variants = {
    blue: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800", // "resi_se" / "rozpracovana"
    orange: "bg-orange-100 text-orange-800", // "ceka_dily"
    purple: "bg-purple-100 text-purple-700", // "ceka_na_dily" (alt) or "Service Contract"
    success: "bg-green-100 text-green-800", // "hotovo" / "ok"
    danger: "bg-red-100 text-red-800", // "porucha"
    neutral: "bg-gray-100 text-gray-800", // default / "odstaveno"

    // Solid variants
    'success-solid': "bg-emerald-600 text-white", // "Smlouva Aktivní"
    'neutral-solid': "bg-slate-800 text-slate-100", // "BEZ SMLOUVY"
  };

  const selectedVariant = variants[variant] || variants.neutral;

  return (
    <span className={`${selectedVariant} text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
