import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '../api/axios';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Schedule = () => {
  const [events, setEvents] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');

      const mappedEvents = (res.data.data || [])
        .filter(issue => issue.dueDate)
        .map(issue => ({
          title: issue.title,
          start: new Date(issue.dueDate),
          end: new Date(issue.dueDate),
          priority: issue.priority?.toUpperCase(),
        }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error('Schedule fetch error:', err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-white p-10">

      <div className="mb-8">
        <h1 className="text-5xl font-black tracking-tight">
          Schedule
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your deadlines visually
        </p>
      </div>

      <div className="h-[85vh] rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20">
        <div className="h-full w-full bg-[#0b0f14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={(event) => {
              let bg = '#6366f1';

              if (event.priority === 'HIGH') bg = '#ef4444';
              else if (event.priority === 'MEDIUM') bg = '#f59e0b';
              else if (event.priority === 'LOW') bg = '#3b82f6';

              return {
                style: {
                  backgroundColor: bg,
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontSize: '12px',
                  padding: '3px 6px',
                },
              };
            }}
          />

        </div>
      </div>

    </div>
  );
};

export default Schedule;
