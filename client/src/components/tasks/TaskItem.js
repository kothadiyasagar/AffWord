import { Paper, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskItem = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task._id,
    data: {
      type: 'task',
      task,
      status: task.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  };

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: '#f5f5f5',
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
        ...style,
      }}
      {...attributes}
      {...listeners}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {task.name}
        </Typography>
        <IconButton 
          size="small" 
          onClick={onEdit}
          sx={{ pointerEvents: 'none' }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {task.description}
      </Typography>
    </Paper>
  );
};

export default TaskItem; 