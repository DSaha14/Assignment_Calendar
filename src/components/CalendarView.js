import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import EventModal from './EventModal';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Divider,
} from '@mui/material';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

const categoryColors = {
  Exercise: '#4ade80',
  Eating: '#fbbf24',
  Work: '#60a5fa',
  Relax: '#a78bfa',
  Family: '#f87171',
  Social: '#34d399',
  General: '#9ca3af',
};

const CalendarView = ({ draggedTask }) => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const BASE_URL = 'http://localhost:5000/api/events';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(BASE_URL);
        const formatted = res.data.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(formatted);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot({
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end),
    });
    setModalOpen(true);
  };

  const handleDropFromOutside = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  const dragFromOutsideItem = () => null;

  const handleAddEvent = async (event) => {
    try {
      const res = await axios.post(BASE_URL, event);
      setEvents((prev) => [
        ...prev,
        { ...res.data, start: new Date(res.data.start), end: new Date(res.data.end) },
      ]);
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updated = events.map((e) =>
      e._id === event._id ? { ...e, start, end } : e
    );
    setEvents(updated);
  };

  const handleEventResize = ({ event, start, end }) => {
    const updated = events.map((e) =>
      e._id === event._id ? { ...e, start, end } : e
    );
    setEvents(updated);
  };

  const handleEventClick = async (event) => {
    const confirmDelete = window.confirm(`Delete event "${event.title}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/${event._id}`);
      setEvents(events.filter((e) => e._id !== event._id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor =
      event.color || categoryColors[event.category] || categoryColors.General;
    const style = {
      backgroundColor,
      borderRadius: '6px',
      color: '#000',
      border: 'none',
      display: 'block',
      padding: '2px 6px',
      fontWeight: 500,
    };
    return { style };
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(e.target.value);
    setCurrentDate(date);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        📅 My Calendar
      </Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
          </Typography>

          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{ maxWidth: 200 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ height: '70vh' }}>
          <DnDCalendar
            date={currentDate}
            onNavigate={handleNavigate}
            selectable
            resizable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['week', 'day', 'agenda']}
            showMultiDayTimes
            popup
            style={{ height: '100%' }}
            onSelectSlot={handleSelectSlot}
            onDropFromOutside={handleDropFromOutside}
            dragFromOutsideItem={dragFromOutsideItem}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onSelectEvent={handleEventClick}
            draggableAccessor={(event) => !!event._id}
            eventPropGetter={eventStyleGetter}
          />
        </Box>
      </Paper>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddEvent}
        slotInfo={selectedSlot}
        prefill={
          draggedTask
            ? {
                title: draggedTask.name,
                category: draggedTask.goalId || 'General',
                color: draggedTask.color,
              }
            : null
        }
      />
    </Box>
  );
};

export default CalendarView;
