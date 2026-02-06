import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import cs from 'date-fns/locale/cs';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// 1. Nastavení lokalizace (Čeština)
const locales = {
  'cs': cs,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Týden začíná v pondělí
  getDay,
  locales,
});

const messages = {
  allDay: 'Celý den',
  previous: 'Zpět',
  next: 'Další',
  today: 'Dnes',
  month: 'Měsíc',
  week: 'Týden',
  day: 'Den',
  agenda: 'Agenda',
  date: 'Datum',
  time: 'Čas',
  event: 'Událost',
  noEventsInRange: 'Žádné události v tomto období',
};

const ServiceCalendar = ({ events, onEventClick }) => {
  
  // 2. Funkce pro barvení událostí
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; // Default modrá

    if (event.type === 'machine') {
      backgroundColor = '#10b981'; // Zelená (Plánovaný servis stroje)
    } else if (event.type === 'job') {
       if (event.status === 'hotovo') backgroundColor = '#94a3b8'; // Šedá (Hotovo)
       else if (event.status === 'porucha') backgroundColor = '#ef4444'; // Červená (Porucha)
       else if (event.status === 'ceka_na_dily') backgroundColor = '#f59e0b'; // Oranžová
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="h-[600px] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        culture="cs"
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onEventClick} // Kliknutí na událost
        views={['month', 'week', 'day', 'agenda']} // Dostupné pohledy
      />
    </div>
  );
};

export default ServiceCalendar;