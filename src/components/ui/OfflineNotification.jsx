import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';

const OfflineNotification = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hláška zmizí po 4 vteřinách (prodloužil jsem to, aby se stihlo kliknout)
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-xl flex items-center gap-4 transition-all duration-300 border ${
      !isOnline 
        ? 'bg-red-600 text-white border-red-700 animate-pulse' 
        : 'bg-green-600 text-white border-green-700'
    }`}>
      {!isOnline ? (
        /* OFFLINE STAV - Jen text, žádné tlačítko */
        <div className="flex items-center gap-3">
          <WifiOff size={24} className="shrink-0" />
          <div className="flex flex-col">
              <span className="font-bold leading-tight">Jste offline</span>
              <span className="text-xs opacity-90">Data se neukládají, ani nenačítají.</span>
          </div>
        </div>
      ) : (
        /* ONLINE STAV - Tady nabídneme obnovení */
        <>
          <div className="flex items-center gap-3">
             <Wifi size={24} />
             <div>
                <span className="font-bold block leading-tight">Jste zpět online</span>
                <span className="text-xs opacity-90">Připojení obnoveno.</span>
             </div>
          </div>

          {/* TLAČÍTKO PRO OBNOVENÍ - JE TEĎ TADY */}
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 bg-white text-green-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-green-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap ml-2"
          >
            <RotateCcw size={14} />
            Načíst data
          </button>
        </>
      )}
    </div>
  );
};

export default OfflineNotification;