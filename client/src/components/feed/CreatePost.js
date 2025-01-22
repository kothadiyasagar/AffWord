import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box 
} from '@mui/material';
import { createPost } from '../../services/api';

const CreatePost = ({ open, onClose, onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);

      await createPost(formData);
      onPostCreated();
      onClose();
      setCaption('');
      setImage(null);
      setPreview('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Caption"
            margin="normal"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
            multiline
            rows={3}
          />
          <Box mt={2}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              required
            />
          </Box>
          {preview && (
            <Box mt={2}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: 200 }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePost; 