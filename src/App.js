import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';

function App() {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleTaskDragStart = (e, task) => {
    setDraggedTask(task);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ height: '100vh', overflow: 'hidden' }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '250px' },
          height: { xs: 'auto', md: '100vh' },
          overflowY: 'auto',
          bgcolor: '#f1f5f9',
          p: 2,
        }}
      >
        <Sidebar onTaskDragStart={handleTaskDragStart} />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <CalendarView draggedTask={draggedTask} />
      </Box>
    </Stack>
  );
}

export default App;
