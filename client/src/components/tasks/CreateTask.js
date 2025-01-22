import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button 
} from '@mui/material';
import { createTask } from '../../services/api';

const CreateTask = ({ open, onClose, onTaskCreated }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(taskData);
      onTaskCreated();
      onClose();
      setTaskData({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Task</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTask; 