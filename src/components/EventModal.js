import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';

const categories = ['Exercise', 'Eating', 'Work', 'Relax', 'Family', 'Social'];

// Helper to keep local date input values properly parsed
const toLocalDate = (dateTimeStr) => {
  const [date, time] = dateTimeStr.split('T');
  return new Date(`${date}T${time}`);
};

const EventModal = ({ isOpen, onClose, onSave, slotInfo, prefill }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Exercise');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (slotInfo) {
      const startDate = new Date(slotInfo.start);
      const endDate = new Date(slotInfo.end);

      setStart(startDate.toISOString().slice(0, 16));
      setEnd(endDate.toISOString().slice(0, 16));
    }

    if (prefill) {
      setTitle(prefill.title || '');
      setCategory(prefill.category || 'Exercise');
    }
  }, [slotInfo, prefill]);

  const handleSave = () => {
    if (!title || !start || !end) return;

    onSave({
      title,
      category,
      start: toLocalDate(start),
      end: toLocalDate(end),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EventIcon color="primary" />
          Create New Event
        </span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Event Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: <CategoryIcon sx={{ mr: 1, color: 'gray' }} />
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Start Time"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />

        <TextField
          fullWidth
          label="End Time"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Create Event</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
