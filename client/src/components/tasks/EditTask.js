import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { updateTask } from '../../services/api';

const EditTask = ({ open, onClose, task, onTaskUpdated }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    if (task) {
      setTaskData({
        name: task.name,
        description: task.description,
        status: task.status
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task._id, {
        name: taskData.name,
        description: taskData.description,
        status: taskData.status
      });
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            name="name"
            label="Task Name"
            margin="normal"
            value={taskData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="description"
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={taskData.description}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTask; 