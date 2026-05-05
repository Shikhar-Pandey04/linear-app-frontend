import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await axios.get('/issues/get-issues');

      const mappedEvents = (res.data.data || [])
        .filter(issue => issue.dueDate)
        .map(issue => ({
          id: issue._id,
          title: issue.title,
          start: new Date(issue.dueDate),
          end: new Date(issue.dueDate),
          priority: issue.priority?.toUpperCase(),
        }));

      return mappedEvents;
    } catch (err) {
      console.error('Schedule fetch error:', err);
      return [];
    }
  };

  // ✅ FIX: API + localStorage merge
  useEffect(() => {
    const loadData = async () => {
      const apiEvents = await fetchIssues();

      const saved = localStorage.getItem("calendarEvents");
      let localEvents = [];

      if (saved) {
        localEvents = JSON.parse(saved).map(e => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
      }

      setEvents([...apiEvents, ...localEvents]);
    };

    loadData();
  }, []);

  const handleSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  // ✅ FIX: save to localStorage
  const handleSave = () => {
    if (!title.trim()) return;

    const newEvent = {
      id: Date.now(),
      title,
      start: selectedDate,
      end: selectedDate,
      priority: "LOW",
    };

    setEvents(prev => {
      const updated = [...prev, newEvent];

      const onlyCustom = updated.filter(e => typeof e.id === "number");
      localStorage.setItem("calendarEvents", JSON.stringify(onlyCustom));

      return updated;
    });

    setShowModal(false);
    setTitle("");
  };

  // ✅ FIX: delete persist
  const handleDelete = (eventToDelete) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    setEvents(prev => {
      const updated = prev.filter(e => e.id !== eventToDelete.id);

      const onlyCustom = updated.filter(e => typeof e.id === "number");
      localStorage.setItem("calendarEvents", JSON.stringify(onlyCustom));

      return updated;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      
      <Sidebar />

      <main className="flex-1 ml-64 p-10">

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
              className="custom-calendar"
              selectable
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectSlot={handleSelect}
              onSelectEvent={handleDelete}

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
                    cursor: 'pointer',
                  },
                };
              }}
            />

          </div>
        </div>

        <style>
          {`
            .custom-calendar .rbc-off-range-bg {
              background: #0b0f14 !important;
            }

            .custom-calendar .rbc-day-bg {
              background: #0b0f14;
            }
          `}
        </style>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl w-[320px]">

              <h2 className="text-white mb-4 text-lg font-semibold">
                Add Event
              </h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="w-full p-3 rounded-lg bg-black border border-white/20 text-white outline-none"
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Schedule;