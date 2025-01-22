import { Paper, Typography, Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from './TaskItem';

const Column = ({ id, title, items, onEdit }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      droppableId: id,
      type: 'column'
    }
  });

  const getColumnColor = (status) => {
    switch (status) {
      case 'done':
        return 'success.main';
      case 'completed':
        return 'info.main';
      default:
        return 'warning.main';
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        height: '100%', 
        backgroundColor: isOver ? '#f0f7ff' : '#fff',
        transition: 'background-color 0.2s ease'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: getColumnColor(id) }}>
        {title} ({items.length})
      </Typography>
      <Box
        ref={setNodeRef}
        sx={{
          minHeight: 500,
          transition: 'background-color 0.2s ease',
          backgroundColor: isOver ? '#e3f2fd' : 'transparent',
          padding: 1
        }}
      >
        <SortableContext
          items={items.map(item => item._id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={() => onEdit(task)}
            />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
};

export default Column; 