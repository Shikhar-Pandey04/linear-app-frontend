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
        .filter(issue => issue.dueDate) // important
        .map(issue => ({
          title: issue.title,
          start: new Date(issue.dueDate),
          end: new Date(issue.dueDate),
          priority: issue.priority,
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
    <div className="h-screen w-full bg-[#0d1117] text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>

      <div className="h-[85vh] bg-[#0b0f14] border border-gray-800 rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          
          eventPropGetter={(event) => {
            let bg = '#6366f1'; // default

            if (event.priority === 'HIGH') bg = '#ef4444';
            else if (event.priority === 'MEDIUM') bg = '#f59e0b';
            else if (event.priority === 'LOW') bg = '#3b82f6';

            return {
              style: {
                backgroundColor: bg,
                borderRadius: '6px',
                border: 'none',
                color: 'white',
                fontSize: '12px',
              },
            };
          }}
        />
      </div>

    </div>
  );
};

export default Schedule;