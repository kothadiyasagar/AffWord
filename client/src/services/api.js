import axios from 'axios';

const API_URL = 'https://affword.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = (email, password) => 
  api.post('/users/login', { email, password });

export const register = (name, email, password) => 
  api.post('/users/register', { name, email, password });

export const forgotPassword = (email) => 
  api.post('/users/forgot-password', { email });

export const getTasks = () => 
  api.get('/tasks');

export const createTask = (taskData) => 
  api.post('/tasks', taskData);

export const updateTaskStatus = (taskId, status) => 
  api.put(`/tasks/${taskId}`, { status: status });

export const getPosts = () => 
  api.get('/posts');

export const createPost = (formData) => 
  api.post('/posts', formData);

export const updateTask = (taskId, taskData) => 
  api.put(`/tasks/${taskId}`, taskData);

export default api; 