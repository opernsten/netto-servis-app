import React from 'react';

const Input = ({
  label,
  icon: Icon,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-3 text-slate-400" />
        )}
        <input
          className={`w-full ${Icon ? 'pl-9' : 'px-3'} py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
