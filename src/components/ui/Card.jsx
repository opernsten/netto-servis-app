import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {noPadding ? children : <div className="p-6">{children}</div>}
    </div>
  );
};

export default Card;
