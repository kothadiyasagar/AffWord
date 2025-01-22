import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box 
} from '@mui/material';
import { getPosts, createPost } from '../../services/api';
import CreatePost from './CreatePost';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button 
          variant="contained" 
          onClick={() => setOpenCreatePost(true)}
        >
          Create Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={post.imageUrl}
                alt={post.caption}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="body1">{post.caption}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Posted by {post.user.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreatePost 
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onPostCreated={fetchPosts}
      />
    </Container>
  );
};

export default Feed; 