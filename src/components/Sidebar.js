import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material/styles';

const GoalBox = styled(Paper)(({ bgcolor, selected }) => ({
  marginBottom: '8px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: bgcolor,
  border: selected ? '2px solid #000' : '1px solid #ccc',
  cursor: 'pointer',
}));

const TaskBox = styled(Paper)(({ bgcolor }) => ({
  marginBottom: '8px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: bgcolor,
  cursor: 'grab',
}));

const goalsData = [
  { id: 1, name: 'Be fit', color: '#FFEFD6' },
  { id: 2, name: 'Academics', color: '#D6ECFF' },
  { id: 3, name: 'LEARN', color: '#F0E6FF' },
  { id: 4, name: 'Sports', color: '#F6F0FF' },
];

const tasksData = {
  3: [
    { id: 't1', name: 'AI based agents' },
    { id: 't2', name: 'MLE' },
    { id: 't3', name: 'DE related' },
    { id: 't4', name: 'Basics' },
  ],
  // Add more if needed
};

const Sidebar = ({ onTaskDragStart }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (selectedGoal) {
      setTasks(tasksData[selectedGoal.id] || []);
    }
  }, [selectedGoal]);

  return (
    <div style={{ padding: 16, minWidth: 250 }}>
      <Typography variant="h6" gutterBottom>GOALS</Typography>
      <List>
        {goalsData.map((goal) => (
          <GoalBox
            key={goal.id}
            bgcolor={goal.color}
            selected={selectedGoal?.id === goal.id}
            onClick={() => setSelectedGoal(goal)}
            elevation={selectedGoal?.id === goal.id ? 3 : 1}
          >
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={goal.name} />
          </GoalBox>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>TASKS</Typography>
      <List>
        {tasks.map((task) => (
          <TaskBox
            key={task.id}
            bgcolor={selectedGoal?.color || '#eee'}
            draggable
            onDragStart={(e) =>
              onTaskDragStart(e, {
                ...task,
                goalId: selectedGoal?.id,
                color: selectedGoal?.color,
              })
            }
          >
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={task.name} />
          </TaskBox>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
