import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '../../services/calendarService';
import ServiceCalendar from '../../features/calendar/ServiceCalendar';
import Header from '../../components/layout/Header'; // Použijeme tvůj Header
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
  const navigate = useNavigate();

  // 1. Načtení dat
  const { 
    data: events = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: getCalendarEvents,
    refetchInterval: 5000, // Automatické aktualizace každých 5 sekund
  });

  // 2. Kliknutí na událost
  const handleEventClick = (event) => {
    if (event.type === 'job') {
      navigate(`/jobs/${event.resourceId}`);
    } else if (event.type === 'machine') {
      navigate(`/machines/${event.resourceId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header 
            title="Plánování servisu" 
            subtitle="Načítám kalendář..." 
        />
        <div className="p-10 text-center text-slate-500">Načítám data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header 
            title="Plánování servisu" 
            subtitle="Chyba načítání" 
        />
        <div className="p-10 text-center text-red-500">Chyba při načítání dat kalendáře.</div>
      </div>
    );
  }

  // --- SPRÁVNÁ STRUKTURA (bez PageLayout) ---
  return (
    <div className="space-y-6">
      {/* Použijeme tvůj standardní Header komponent */}
      <Header 
        title="Plánování servisu"
        subtitle="Přehled výjezdů a plánovaných revizí"
      />

      {/* Kalendář */}
      <ServiceCalendar 
        events={events} 
        onEventClick={handleEventClick} 
      />
      
      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="font-semibold mr-2">Legenda:</div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Zakázka (Nová)
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span> Čeká na díly
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Porucha
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Plánovaný servis stroje
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400"></span> Hotovo
          </div>
      </div>
    </div>
  );
};

export default CalendarPage;