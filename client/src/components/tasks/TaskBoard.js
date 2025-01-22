import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getTasks, updateTaskStatus } from '../../services/api';
import CreateTask from './CreateTask';
import EditTask from './EditTask';
import TaskItem from './TaskItem';
import Column from './Column';

const TaskBoard = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    completed: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTasks();
      const grouped = {
        pending: [],
        completed: [],
        done: []
      };
      data.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        } else {
          grouped[task.status] = [task];
        }
      });
      setTasks(grouped);
    } catch (error) {
      setError('Error fetching tasks. Please try again later.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || !active) {
      setActiveId(null);
      return;
    }

    const activeTask = findTask(active.id);
    const newStatus = over.data?.current?.droppableId || over.id;

    if (!['pending', 'completed', 'done'].includes(newStatus)) {
      console.error('Invalid status:', newStatus);
      return;
    }

    if (activeTask && activeTask.status !== newStatus) {
      try {
        await updateTaskStatus(active.id, newStatus);

        setTasks(prev => {
          const newTasks = { ...prev };
          
          newTasks[activeTask.status] = newTasks[activeTask.status].filter(
            task => task._id !== active.id
          );
          
          const updatedTask = { ...activeTask, status: newStatus };
          newTasks[newStatus] = [...(newTasks[newStatus] || []), updatedTask];
          
          return newTasks;
        });
      } catch (error) {
        console.error('Error updating task status:', error?.response?.data || error.message);
        setError('Failed to update task status. Please try again.');
        fetchTasks();
      }
    }
    setActiveId(null);
  };

  const findTask = (taskId) => {
    for (const [status, taskList] of Object.entries(tasks)) {
      const task = taskList?.find(t => t._id === taskId);
      if (task) return task;
    }
    return null;
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create Task
          </Button>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Grid container spacing={3}>
            {Object.entries(tasks).map(([status, items]) => (
              <Grid item xs={12} md={4} key={status}>
                <Column
                  id={status}
                  title={status.charAt(0).toUpperCase() + status.slice(1)}
                  items={items}
                  onEdit={handleEdit}
                />
              </Grid>
            ))}
          </Grid>
        </DndContext>
      </Container>
      <CreateTask
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onTaskCreated={fetchTasks}
      />
      <EditTask
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskUpdated={fetchTasks}
      />
    </>
  );
};

export default TaskBoard;
